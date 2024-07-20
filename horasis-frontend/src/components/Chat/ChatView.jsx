import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { useToast } from "../Toast/ToastService"
import { getItem } from "../../constants/operations"
import Spinner from "../ui/Spinner"
import avatar from '../../assets/icons/avatar.svg'
import InComingMessage from "./ChatElements/InComingMessage"
import OutGoingMessage from "./ChatElements/OutGoingMessage"

const ChatView = ({ userId }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(0)

    const { currentUserData, updateCurrentUser } = useContext(AuthContext)
    const toast = useToast()
    const [user, setUser] = useState()
    const [chatText, setChatText] = useState("")

    const onChange = (value) => {
        setChatText(value)
    }

    const validate = (callback) => {
        callback()
    }

    const onSendBtnClicked = () => {

    }



    const getUserDetails = () => {
        setIsLoading(true)
        getItem(
            `users/${userId}`,
            (result) => {
                setIsLoading(false)
                setUser(result)
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

    useEffect(() => {
        getUserDetails()
    }, [])
    return (<>
        <div className='h-full flex flex-col px-3 pt-3 lg:px-10 lg:pt-6 bg-system-secondary-bg'>
            <div>
                <div className='flex justify-start items-center'>
                    {user ? (
                        <>
                            {user.ProfilePicture ? (
                                <>
                                    <div className='w-16 h-16 rounded-full flex items-center justify-center bg-black'>
                                        <img
                                            className='w-16 h-16 rounded-full object-cover'
                                            src={user.ProfilePicture}
                                            alt='Rounded avatar'
                                            onClick={() => { }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className='w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed bg-brand-light-gray'
                                        onClick={() => { }}>
                                        <img src={avatar} className='object-cover h-full w-full rounded-lg' />
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <div className='w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed bg-slate-100'>
                                {isLoading ? <Spinner /> : <></>}
                            </div>
                        </>
                    )}
                </div>

                <h4 className='font-medium text-base text-system-primary-text mt-2'>{user && user.FullName}</h4>
                <h4 className='font-medium text-sm text-brand-gray-dim'>@{user && user.Username}</h4>
            </div>
            <div className="flex-1 overflow-auto py-6">
                {isLoading ? <Spinner /> : <></>}

                {/* auto scroll to bottom if new message came */}

                <InComingMessage message={{
                    CreatedIndex: new Date().getTime(),
                    Content: "Hey Bob, did you get a chance to review the new security protocols we discussed last week?"
                }} />

                <OutGoingMessage message={{
                    CreatedIndex: new Date().getTime(),
                    Content: "Hi Alice, yes, I went through them yesterday. I think they’re quite comprehensive, but I have a few concerns about the implementation timeline"
                }} />

            </div>
            <div className="py-3 lg:py-6">
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