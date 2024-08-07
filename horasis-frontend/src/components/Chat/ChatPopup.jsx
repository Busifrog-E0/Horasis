import { useState } from 'react'
import { useChatPopup } from '../../context/ChatPopup/ChatPopupService'
import ChatView from './ChatView'
import NewChatView from './NewChatView'

const ChatPopup = () => {
	const { userIds, removeUser, activeChat, setActiveChat } = useChatPopup()
	const [minimizedChats, setMinimizedChats] = useState({})
	const toggleMinimize = (userId) => {
		setMinimizedChats((prev) => ({
			...prev,
			[userId]: !prev[userId],
		}))
	}
	return (
		<div className='absolute z-[999]  bottom-0 right-1 lg:right-12 overflow-hidden'>
			<div className='hidden md:flex gap-2 items-end'>
				{userIds.map((item) => {
					const isMinimized = minimizedChats[item]
					return (
						<div className='rounded-t-md overflow-hidden' key={item}>
							<div className='bg-system-primary-accent py-3 px-3 cursor-pointer flex justify-between gap-10'>
								<p className='text-system-secondary-bg text-md'>Chat</p>
								<div className='flex gap-2'>
									<p className='text-system-secondary-bg' onClick={() => toggleMinimize(item)}>
										{isMinimized ? 'expand' : 'minimize'}
									</p>
									<p className='text-system-secondary-bg' onClick={() => removeUser(item)}>
										close
									</p>
								</div>
							</div>
							<div className={`transition-all duration-300 ${isMinimized ? 'h-0' : 'h-[30rem]'} overflow-hidden`}>
								{!isMinimized && (
									<div className='w-[24rem] h-full'>
										<NewChatView userId={item} />
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
			{activeChat && (
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
			)}
		</div>
	)
}

export default ChatPopup
