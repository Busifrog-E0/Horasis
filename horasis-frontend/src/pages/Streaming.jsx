import { useIsConnected, useJoin, useClientEvent, useRTCClient } from 'agora-rtc-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { useToast } from '../components/Toast/ToastService'
import StreamUsersList from '../components/Streaming/StreamUsersList'
import JoinToStream from '../components/Streaming/JoinToStream'
import StreamParticipantList from '../components/Streaming/StreamParticipantList'
import { useSocket } from '../context/Socket/SocketService'
import { jsonToQuery } from '../utils/searchParams/extractSearchParams'
import { getNextId } from '../utils/URLParams'

export const Streaming = () => {
    const client = useRTCClient()
    const { updateCurrentUser, currentUserData } = useAuth()
    const toast = useToast()
    const { socket } = useSocket()

    const { eventid } = useParams()
    const [event, setEvent] = useState({})
    const [loadingToken, setIsLoadingToken] = useState(true)
    const [loadingEvent, setIsLoadingEvent] = useState(true)
    const [calling, setCalling] = useState(false)
    const isConnected = useIsConnected()
    const [appId, setAppId] = useState('206c8a92da8d4676aabfb8314a21fa17')
    const [channel, setChannel] = useState(eventid)
    const [token, setToken] = useState('')
    const [role, setRole] = useState('Member')
    const [user, setUser] = useState({})

    let newUser = useJoin({ uid: currentUserData.CurrentUser.UserId, appid: appId, channel: channel, token: token ? token : null }, calling, client ? client : null)

    useEffect(() => {
        console.log(newUser)
        if (client) {
            console.log(client)
        }
    }, [newUser])

    const [micOn, setMic] = useState(true)
    const [cameraOn, setCamera] = useState(true)

    const getUser = () => {
        getItem(
            `users/${currentUserData.CurrentUser.UserId}`,
            (result) => {
                setUser(result)
            },
            (err) => {
                console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }
    const getToken = () => {
        setIsLoadingToken(true)
        getItem(
            `event/${eventid}/videoCall/join`,
            (result) => {
                if (result && result.Token) {
                    setToken(result.Token)
                    setRole(result.Role)
                }
                // setToken("007eJxTYBDl+aDxnmevYv+bF4t2P8m7GMh1qKL6cKfBZFnzpx/OMLsoMBgZmCVbJFoapSRapJiYmZslJialJVkYG5okGhmmJRqaWyffSGsIZGS4qfWQlZEBAkF8doa81PKQ1OISBgYA+HIh1Q==")
                setIsLoadingToken(false)
            },
            (err) => {
                // setToken("007eJxTYBDl+aDxnmevYv+bF4t2P8m7GMh1qKL6cKfBZFnzpx/OMLsoMBgZmCVbJFoapSRapJiYmZslJialJVkYG5okGhmmJRqaWyffSGsIZGS4qfWQlZEBAkF8doa81PKQ1OISBgYA+HIh1Q==")
                setIsLoadingToken(false)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    const getEvent = () => {
        setIsLoadingEvent(true)
        getItem(
            `events/${eventid}`,
            (result) => {
                setEvent(result)
                setIsLoadingEvent(false)
            },
            (err) => {
                navigate('/NotFound', { replace: true })
                setIsLoadingEvent(false)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    useEffect(() => {
        getToken([])
        getEvent()
        getUser()
    }, [])

    useClientEvent(client, 'user-joined', (user) => {
        console.log(user)
    })
    useClientEvent(client, 'user-left', (user) => {
        console.log(user)
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(true)
    const [pageDisabled, setPageDisabled] = useState(true)
    const [filters, setFilters] = useState({
        Keyword: '',
        OrderBy: 'Index',
        Limit: 10,
    })
    const [participants, setParticipants] = useState([])
    const setLoadingCom = (tempArr, value) => {
        if (tempArr.length > 0) {
            setIsLoadingMore(value)
        } else {
            setIsLoading(value)
        }
    }
    const getParticipantsList = (tempParticipants) => {
        getItem(
            `events/${eventid}/videoCall/participants?${jsonToQuery(filters)}&NextId=${getNextId(tempParticipants)}`,
            (result) => {
                setParticipants([...tempParticipants, ...result])
            },
            (err) => {
                setLoadingCom(tempParticipants, false)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    const hasAnyLeft = () => {
        getItem(
            `events/${eventid}/videoCall/participants?${jsonToQuery({ ...filters, Limit: 1 })}&NextId=${getNextId(participants)}`,
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
    }

    const videoSocket = () => {
        if (isConnected) {
            socket.emit('JoinEvent', { EventId: eventid }, () => {
                console.log('Joined')
            }),
                socket.emit('user-joined-videocall', {
                    EventId: eventid,
                    UserId: currentUserData.CurrentUser.UserId,
                })

            if (role === 'Speaker') client.setClientRole('host')
            else client.setClientRole('audience')

            socket.on('participants-list', (value) => {
                console.log('jemvadfghjadvfjyadkvfjh nmjmyhjyuhjnythjbg')
                getParticipantsList([])
            })
            return () => {
                socket.emit('LeaveRoom', { ConversationId: eventid })
                socket.off('participants-list')
            }
        } else {
            socket.emit('user-left-videocall', { EventId: eventid, UserId: currentUserData.CurrentUser.UserId })

            return () => { }
        }
    }

    useEffect(() => {
        if (!socket || !eventid) return
        if (eventid) {
            const cleanup = videoSocket()
            return cleanup
        }
    }, [isConnected, socket])

    useEffect(() => {
        if (participants.length > 0) hasAnyLeft()
    }, [participants])

    return (
        <>
            {loadingToken ? (
                <div className='flex items-center justify-center h-full'>
                    <div className='text-xl font-semibold text-gray-700'>Loading...</div>
                </div>
            ) : isConnected ? (
                <div className='bg-system-primary-darker-accent h-full overflow-hidden'>
                    <div className='h-full grid grid-cols-4'>
                        <div className='col-span-3 p-4 overflow-hidden h-full'>
                            <StreamUsersList event={event} cameraOn={cameraOn} micOn={micOn}
                                setCamera={setCamera} isConnected={isConnected} calling={calling} setMic={setMic} setCalling={setCalling}
                                role={role} currentUser={user} />
                        </div>

                        <div className=' h-full col-span-1 p-4 h-full'>
                            <StreamParticipantList participants={participants} />
                        </div>
                    </div>
                    {/* */}
                </div>
            ) : loadingEvent ? (
                <div className='flex items-center justify-center h-full'>
                    <div className='text-xl font-semibold text-gray-700'>Loading...</div>
                </div>
            ) : (
                <div className='h-full overflow-hidden relative'>
                    <JoinToStream event={event} appId={appId} channel={channel} token={token} setAppId={setAppId} setCalling={setCalling} setChannel={setChannel} setToken={setToken} />
                </div>
            )}
        </>
    )
}

export default Streaming
