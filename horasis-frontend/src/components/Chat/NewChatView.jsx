import { useContext, useEffect, useState } from 'react'
import DashboardHeader from '../DashboardHeader'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import InComingMessage from './ChatElements/InComingMessage'
import OutGoingMessage from './ChatElements/OutGoingMessage'
import UserDetailsTab from './ChatElements/UserDetailsTab'
import { runOnce } from '../../utils/runOnce'
import { getItem, patchItem, postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import io from 'socket.io-client'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { useSocket } from '../../context/Socket/SocketService'
import { useLocation } from 'react-router-dom'

const NewChatView = ({ userId }) => {
	// context
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const { socket } = useSocket()
	const location = useLocation()

	// message
	const [messages, setMessages] = useState([])
	const [messageToSend, setMessageToSend] = useState('')
	const [conversationId, setConversationId] = useState('')

	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
	})
	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getAllMessages = (tempMessages) => {
		getData(`chats/${conversationId}/messages?${jsonToQuery(filters)}`, tempMessages, setMessages)
	}

	const getData = (endpoint, tempData, setData) => {
		setLoadingCom(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				let newMessages = [...tempData, ...data]
				setData(newMessages)
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
		getAllMessages(initialRender ? [] : messages)
	}
	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (messages.length > 0) hasAnyLeft(`chats/${conversationId}/messages`, messages)
	}, [messages])

	useEffect(() => {
		if (conversationId) {
			fetch()
		}
	}, [filters, conversationId])

	// get user details
	const [user, setUser] = useState()
	const [isUserLoading, setIsUserLoading] = useState(true)
	const getUserDetails = runOnce(() => {
		setIsUserLoading(true)
		getItem(
			`users/${userId}`,
			(result) => {
				setUser(result)
				getConversationId()
				setIsUserLoading(false)
			},
			(err) => {
				setIsUserLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	})
	useEffect(() => {
		getUserDetails()
	}, [userId])

	const seeAllMessages = () => {
		console.log('see messages')
		patchItem(
			`chats/${conversationId}/seeAllMessages`,{},
			(result) => {},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	// get conversation id
	const [isConvIdLoading, setIsConvIdLoading] = useState(true)
	const getConversationId = runOnce(() => {
		setIsConvIdLoading(true)
		postItem(
			`reterieveConversationId`,
			{ ReceiverId: userId },
			(result) => {
				setIsConvIdLoading(false)
				setConversationId(result)
			},
			(err) => {
				setIsConvIdLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	})

	const connectSocket = (conversationId) => {
		socket.emit('JoinRoom', { ConversationId: conversationId })

		socket.on('Message', (value) => {
			// console.log('message received', value)
			if (value.ConversationId === conversationId) {
				console.log('messages recieved')
				seeAllMessages()
				setMessages((prevMessages) => [value, ...prevMessages])
			}
		})

		return () => {
			socket.emit('LeaveRoom', { ConversationId: conversationId })
			socket.off('Message')
		}
	}

	useEffect(() => {
		if (!socket || !conversationId) return

		if (conversationId) {
			const cleanup = connectSocket(conversationId)
			return cleanup
		}
	}, [conversationId, socket])

	// Sending messages
	const onMessageSend = (e) => {
		if (e) {
			e.preventDefault()
		}
		if (socket && messageToSend) {
			console.log('emitted message')
			socket.emit('Message', {
				ConversationId: conversationId,
				Content: messageToSend,
			})
			setMessageToSend('')
		} else {
			console.log('no message or socket')
		}
	}

	return (
		<>
			<div className='h-full w-full flex flex-col bg-system-secondary-bg'>
				<div className={`${location.pathname.includes('/Chat/') ? '' : 'md:hidden'}`}>
					<DashboardHeader />
				</div>

				<div className='lg:mx-60 lg:border-x lg:border-t rounded-t-md lg:min-w-full max-w-[1000px] lg:self-center'>
					<UserDetailsTab user={user} isLoading={isUserLoading} viewAsFlex />
					<hr className='my-2' />
				</div>

				<div className='flex-1 flex flex-col overflow-auto relative lg:mx-60 mb-4 lg:border-x lg:border-b rounded-b-md lg:min-w-full max-w-[1000px] lg:self-center'>
					<div className='absolute w-full z-10 '>
						{!pageDisabled && (
							<div className='flex flex-row gap-2  items-center  justify-center w-full '>
								<p
									onClick={() => {
										fetchMore()
									}}
									className='cursor-pointer bg-system-primary-bg text-system-secondary-text py-2 px-4 rounded-full text-xs'>
									Load previous chat
								</p>
							</div>
						)}
						<div className='my-2'>{isLoading || isLoadingMore ? <Spinner /> : <></>}</div>
					</div>
					<div className='flex-1 overflow-auto px-3 pt-3 flex flex-col-reverse relative '>
						{/* auto scroll to bottom if new message came */}
						{messages.length > 0 ? (
							messages.map((message, index) => {
								if (message.SenderId === currentUserData.CurrentUser.UserId) {
									return <OutGoingMessage key={index} message={message} />
								} else {
									return <InComingMessage key={index} message={message} />
								}
							})
						) : (
							<p>No messages</p>
						)}
					</div>

					<div className='flex flex-row gap-2 py-4 px-3'>
						<div className='border-2 border-system-primary-accent bg-system-secondary-bg overflow-hidden rounded-lg flex-1'>
							<div className='flex gap-0 flex-row'>
								<div className='bg-system-secondary-bg p-3 px-4 flex-1'>
									<input
										value={messageToSend}
										onChange={(e) => setMessageToSend(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												onMessageSend()
											}
										}}
										className='w-full bg-system-secondary-bg italic text-system-primary-text outline-none'
										placeholder={'Write a message..'}></input>
								</div>
							</div>
						</div>
						<svg
							className='w-6 h-6 text-system-primary-accent cursor-pointer fill-system-primary-accent'
							onClick={onMessageSend}
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 -960 960 960'>
							<path d='M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z' />
						</svg>
					</div>

					{/* Place add new comment box here  and remove the above lines of code*/}
				</div>
			</div>
		</>
	)
}

export default NewChatView
