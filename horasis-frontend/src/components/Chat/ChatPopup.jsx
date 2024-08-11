import { useState } from 'react'
import { useChatPopup } from '../../context/ChatPopup/ChatPopupService'
import ChatView from './ChatView'
import NewChatView from './NewChatView'
import { useLocation } from 'react-router-dom'
import close from '../../assets/icons/closewhite.svg'
const ChatPopup = () => {
	const { userIds, removeUser } = useChatPopup()
	const location = useLocation()
	const [minimizedChats, setMinimizedChats] = useState({})
	const toggleMinimize = (userId) => {
		setMinimizedChats((prev) => ({
			...prev,
			[userId]: !prev[userId],
		}))
	}
	if (location.pathname.includes('/Chat/')) {
		return <></>
	}
	return (
		<div className='absolute z-[999]  bottom-0 right-1 lg:right-12 overflow-hidden'>
			<div className='hidden md:flex gap-2 items-end'>
				{userIds.map((item) => {
					const isMinimized = minimizedChats[item]
					return (
						<SingleChat
							key={item}
							chat={item}
							removeUser={removeUser}
							toggleMinimize={toggleMinimize}
							isMinimized={isMinimized}
						/>
					)
					// return (
					// 	<div className='rounded-t-md overflow-hidden' key={item}>
					// 		<div className='bg-system-primary-accent py-3 px-3 cursor-pointer flex justify-between gap-10'>
					// 			<p className='text-system-secondary-bg text-md'>Chat</p>
					// 			<div className='flex gap-2'>
					// 				<p className='text-system-secondary-bg' onClick={() => toggleMinimize(item)}>
					// 					{isMinimized ? 'expand' : 'minimize'}
					// 				</p>
					// 				<p className='text-system-secondary-bg' onClick={() => removeUser(item)}>
					// 					close
					// 				</p>
					// 			</div>
					// 		</div>
					// 		<div className={`transition-all duration-300 ${isMinimized ? 'h-0' : 'h-[30rem]'} overflow-hidden`}>
					// 			{!isMinimized && (
					// 				<div className='w-[24rem] h-full'>
					// 					<NewChatView userId={item} />
					// 				</div>
					// 			)}
					// 		</div>
					// 	</div>
					// )
				})}
			</div>
			{/* {activeChat && (
				<div className='md:hidden fixed inset-0 bg-system-secondary-bg z-[999] pb-10'>
					<div className='bg-system-primary-accent py-3 px-3 cursor-pointer flex justify-between'>
						<p className='text-system-secondary-bg text-md'>Chat</p>
						<p className='text-system-secondary-bg' onClick={() => removeUser(activeChat)}>
							close
						</p>
					</div>
					<div className='w-full h-full'>
						<NewChatView userId={activeChat} />
					</div>
				</div>
			)} */}
		</div>
	)
}

const SingleChat = ({ chat, removeUser,toggleMinimize,isMinimized }) => {
	const [chatToRemove,setChatToRemove] = useState('')
	return (
		<div className='rounded-t-md overflow-hidden'>
			<div className='bg-system-primary-accent py-3 px-3 cursor-pointer flex justify-between gap-10'>
				<p className='text-system-secondary-bg text-md'>Chat</p>
				<div className='flex gap-2'>
					<p className='text-system-secondary-bg' onClick={() => toggleMinimize(chat)}>
						{isMinimized ? 'expand' : 'minimize'}
					</p>
					<p className='text-system-secondary-bg' onClick={() => removeUser(chat,chatToRemove)}>
					<img src={close} className='h-6  cursor-pointer' alt="" />
						
					</p>
				</div>
			</div>
			<div className={`transition-all duration-300 ${isMinimized ? 'h-0' : 'h-[30rem]'} overflow-hidden`}>
				{!isMinimized && (
					<div className='w-[24rem] h-full'>
						<NewChatView userId={chat} setChatToRemove={setChatToRemove} />
					</div>
				)}
			</div>
		</div>
	)
}

export default ChatPopup
