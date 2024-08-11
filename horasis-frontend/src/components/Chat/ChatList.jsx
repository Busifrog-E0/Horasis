import { useState, useRef, useEffect, useContext } from 'react'

import ConnectionsForChat from './ConnectionsForChat'
import { AuthContext } from '../../utils/AuthProvider'
import { useSocket } from '../../context/Socket/SocketService'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { useToast } from '../Toast/ToastService'
import { getItem } from '../../constants/operations'
import Input from '../../components/ui/Input'
import mail from '../../assets/icons/mail.svg'

const ChatList = () => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null)
	const [badge, setBadge] = useState(false)

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const { socket } = useSocket()

	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [connectionsForChat, setConnectionsForChat] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 3,
		Keyword: '',
	})
	const api = `chats`

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getConnectionsForChat = (tempArr) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempArr, setConnectionsForChat)
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
	const hasAnyLeft = (endpoint, tempData) => {
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
	}

	const fetchData = (initialRender = false) => {
		getConnectionsForChat(initialRender ? [] : connectionsForChat)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (connectionsForChat.length > 0) hasAnyLeft(`${api}`, connectionsForChat)
	}, [connectionsForChat])

	useEffect(() => {
		fetch()
	}, [filters, isOpen])
	const conversationList = () => {
		socket.on('ConversationList', (value) => {
			if (value === true) {
				fetch()
				setBadge(true)
			}
		})

		return () => {
			socket.off('ConversationList')
		}
	}

	useEffect(() => {
		if (!socket) return
		const cleanup = conversationList()
		return cleanup
	}, [socket])

	return (
		<>
			<div className='relative inline-block text-left' ref={dropdownRef}>
				<div className='relative'>
					<button
						type='button'
						className='inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim '
						onClick={() => {
							setBadge(false)
							setIsOpen((prev) => !prev)
						}}>
						
					<img src={mail} alt="" className='h-7' />
					</button>
					<span
						className={`${
							badge ? 'block' : 'hidden'
						} h-2 w-2 bg-system-error rounded-full absolute top-0 right-0`}></span>
				</div>

				{isOpen && (
					<div className='overflow-hidden origin-top-right absolute z-[999] right-0 mt-2 w-80 lg:w-96 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5'>
						<div className='bg-system-primary-accent p-3 px-5'>
							<p className='text-brand-secondary text-md'>Messages</p>
						</div>
						<div className='p-3 px-5 border-b border-system-file-border'>
							<div>
								<Input
									className='rounded-full p-2 px-4 border border-system-file-border-accent text-xs text-brand-gray-dim'
									width='full'
									placeholder='Search Messages'
									value={filters.Keyword}
									onChange={(e) => {
										setFilters((prev) => ({ ...prev, Keyword: e.target.value }))
									}}
								/>
							</div>
						</div>
						<ConnectionsForChat
							connectionsForChat={connectionsForChat}
							isLoading={isLoading}
							isLoadingMore={isLoadingMore}
							pageDisabled={pageDisabled}
							fetchMore={fetchMore}
							setIsOpen={setIsOpen}
						/>
					</div>
				)}
			</div>
		</>
	)
}

export default ChatList
