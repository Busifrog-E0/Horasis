import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { useToast } from "../Toast/ToastService"
import { getItem, postItem } from "../../constants/operations"
import Spinner from "../ui/Spinner"
import InComingMessage from "./ChatElements/InComingMessage"
import OutGoingMessage from "./ChatElements/OutGoingMessage"
import UserDetailsTab from "./ChatElements/UserDetailsTab"
import { socket } from "../../utils/socket"
import Button from "../ui/Button"
import { getNextId } from "../../utils/URLParams"
import { jsonToQuery } from "../../utils/searchParams/extractSearchParams"
import { runOnce } from "../../utils/runOnce"
import DashboardHeader from "../DashboardHeader"

const ChatView = ({ userId }) => {

    const { currentUserData, updateCurrentUser } = useContext(AuthContext)
    const toast = useToast()
    const [user, setUser] = useState()
    const [chatText, setChatText] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(0)
    const [conversationId, setConversationId] = useState('')
    const [isConnected, setIsConnected] = useState(socket(currentUserData.Token).connected);
    const [fooEvents, setFooEvents] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [activitiesData, setActivitiesData] = useState([])
    const [pageDisabled, setPageDisabled] = useState(true)
    const [filters, setFilters] = useState({
        OrderBy: 'Index',
        Limit: 10,
        Keyword: '',
    })

    const onChange = (value) => {
        setChatText(value)
    }

    const validate = (callback) => {
        callback()
    }

    const onSendBtnClicked = () => {
        setActivitiesData([...activitiesData, {
            "CreatedIndex": new Date().getTime(),
            "ConversationId": conversationId,
            "SenderId": currentUserData.CurrentUser.UserId,
            "Content": chatText,
            "SeenUsers": [
                {
                    "UserId": "60c72b345f1b2c0015a4e7d3",
                    "SeenIndex": new Date().getTime(),
                }
            ],
            "DocId": "60c72b365f1b2c0015a4e7d2"
        }])
        setChatText("")
        socket(currentUserData.Token).emit('Message', {
            ConversationId: conversationId, Content: chatText
        }, () => {

        })

    }

    const getUserDetails = runOnce(() => {
        setIsLoading(true)
        getItem(
            `users/${userId}`,
            (result) => {
                setUser(result)
                getConversationId()
            },
            (err) => {
                setIsLoading(false)
                // console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    })

    const getConversationId = () => {
        setIsLoading(true)
        postItem(
            `reterieveConversationId`,
            { "ReceiverId": userId },
            (result) => {
                setIsLoading(false)
                setConversationId(result)
            },
            (err) => {
                setIsLoading(false)
                // console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    function connect() {
        socket(currentUserData.Token).connect();
    }
    function disconnect() {
        socket(currentUserData.Token).disconnect();
    }

    const setLoadingCom = (tempArr, value) => {
        if (tempArr.length > 0) {
            setIsLoadingMore(value)
        } else {
            setIsLoading(value)
        }
    }

    const getAllActivities = (tempActivites) => {
        getData(`chats/${conversationId}/messages?${jsonToQuery(filters)}`, tempActivites, setActivitiesData)
    }
    const getData = (endpoint, tempData, setData) => {
        setLoadingCom(tempData, true)
        getItem(
            `${endpoint}&NextId=${getNextId(tempData)}`,
            (data) => {
                setData([...tempData, ...data])
                setLoadingCom(tempData, false)
            },
            (err) => {
                setLoadingCom(tempData, false)
                // console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }
    const hasAnyLeft = runOnce((endpoint, tempData) => {
        getItem(
            `${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1 })}`,
            (data) => {
                if (data?.length > 0) {
                    setPageDisabled(false)
                } else {
                    setPageDisabled(true)
                }
            },
            (err) => {
                setPageDisabled(true)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    })
    const fetchData = (initialRender = false) => {
        getAllActivities(initialRender ? [] : activitiesData)
    }

    const fetch = () => fetchData(true)
    const fetchMore = () => fetchData(false)

    useEffect(() => {
        if (activitiesData.length > 0) hasAnyLeft(`chats/${conversationId}/messages`, activitiesData)
    }, [activitiesData])

    useEffect(() => {
        console.log("USEEFFECT")
        if (conversationId) {
            fetch()
        }
    }, [filters, conversationId])

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onFooEvent(value) {
            console.log(value)
            setFooEvents(previous => [...previous, value]);
        }

        socket(currentUserData.Token).on('connect', onConnect);
        socket(currentUserData.Token).on('disconnect', onDisconnect);
        socket(currentUserData.Token).on('Message', onFooEvent);
        connect()
        return () => {
            socket(currentUserData.Token).off('connect', onConnect);
            socket(currentUserData.Token).off('disconnect', onDisconnect);
            socket(currentUserData.Token).off('foo', onFooEvent);
            disconnect()
        };
    }, []);

    useEffect(() => {
        getUserDetails()
    }, [])

    return (<>
        <div className='h-full flex flex-col bg-system-secondary-bg'>
            <DashboardHeader />
            <UserDetailsTab user={user} isLoading={isLoading} />
            <div className="flex flex-row gap-2">
                <Button onClick={() => disconnect()} >Dis-Connect</Button>
            </div>
            <div className="flex-1 overflow-auto px-3 pt-3">
                {isLoading ? <Spinner /> : <></>}

                {/* auto scroll to bottom if new message came */}
                {
                    activitiesData.length > 0 ?
                        activitiesData.map((activity, index) => {
                            if (activity.SenderId === currentUserData.CurrentUser.UserId) {
                                return <OutGoingMessage key={index} message={activity} />

                            }
                            else {
                                return <InComingMessage key={index} message={{
                                    CreatedIndex: new Date().getTime(),
                                    Content: "Hey Bob, did you get a chance to review the new security protocols we discussed last week?"
                                }} />
                            }
                        })

                        :
                        <p>No messages</p>

                }



            </div>
            <div className="p-3">
                <div className="flex flex-row">
                    <div className="border border-system-primary-border bg-system-secondary-bg overflow-hidden rounded-lg flex-1">
                        <div className="flex gap-0 flex-row">
                            <div className="bg-system-secondary-bg p-3 px-4 flex-1">
                                <input value={chatText} onChange={(e) => onChange(e.target.value)}
                                    className="w-full bg-system-secondary-bg italic text-system-primary-text outline-none" placeholder={"Write a message.."}></input>
                            </div>
                        </div>
                    </div>
                    <svg className="w-6 h-6 text-system-primary-accent cursor-pointer" onClick={() => validate(onSendBtnClicked)}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="blue">
                        <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                    </svg>
                </div>

                {/* Place add new comment box here  and remove the above lines of code*/}
            </div>

        </div>
    </>)
}

export default ChatView