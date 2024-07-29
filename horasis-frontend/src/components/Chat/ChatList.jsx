import React, { useState, useRef, useEffect } from 'react'
import ConnectionsForChat from './ConnectionsForChat'
import { useSocket } from '../../context/Socket/SocketService'
const ChatList = () => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null)
	const { socket } = useSocket()

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

	const conversationList = () => {
		socket.on('CoversationList', (value) => {
			console.log(value,'conversation list')
		})

		return () => {
			socket.off('CoversationList')
		}
	}

	useEffect(() => {
		if (!socket) return
		const cleanup = conversationList()
		return cleanup
	}, [socket])

	return (
		<>
			<div className='relative inline-block text-left ' ref={dropdownRef}>
				<button
					type='button'
					className='inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
					onClick={() => setIsOpen(!isOpen)}>
					Chat
				</button>

				{isOpen && (
					<div className='overflow-hidden origin-top-right absolute z-10 right-0 mt-2 w-80 lg:w-96 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5'>
						<div className='bg-system-primary-accent p-3 px-5'>
							<p className='text-brand-secondary text-md'>Messages</p>
						</div>
						<div className='p-3 px-5 border-b border-system-file-border'>
							<div className='w-full rounded-full p-2 px-4 border border-system-file-border-accent flex items-center justify-between bg-system-primary-bg'>
								<h4 className='text-xs text-brand-gray-dim  '>Search Messages</h4>
							</div>
						</div>
						<ConnectionsForChat />
					</div>
				)}
			</div>
		</>
	)
}

export default ChatList
