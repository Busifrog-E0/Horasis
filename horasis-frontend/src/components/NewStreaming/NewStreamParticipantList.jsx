import { useEffect, useRef, useState } from 'react'
import avatar from '../../assets/icons/avatar.svg'
import send from '../../assets/icons/send.svg'

import Button from '../ui/Button'
import Input from '../ui/Input'
const NewStreamParticipantList = ({ participants, currentUser, leaveEvent, sendMessage, messages, setMessages, speakers, role }) => {
	const [activeTab, setActiveTab] = useState('participants')
	const [messageToSend, setMessageToSend] = useState('')
	const messagesEndRef = useRef(null) // Reference to the end of the messages list

	// Function to scroll to the bottom when messages are updated
	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}

	// useEffect to run scrollToBottom when messages change
	useEffect(() => {
		scrollToBottom()
	}, [messages,activeTab]) // Run this effect every time messages update
	return (
		<div className='flex flex-col h-[88vh] relative  overflow-hidden p-4 bg-system-primary-accent-dim shadow-lg rounded-lg'>
			<div className='flex gap-2'>
				<p className={`text-gray-100 cursor-pointer text-center flex-1 ${activeTab === 'participants' && 'bg-system-primary-accent-transparent'} p-4 rounded-md`} onClick={() => setActiveTab('participants')}>
					Participants{' '}
				</p>
				<p className={`text-gray-100 cursor-pointer text-center flex-1 ${activeTab === 'messages' && 'bg-system-primary-accent-transparent'} p-4 rounded-md`} onClick={() => setActiveTab('messages')}>
					Messages{' '}
				</p>
			</div>
			<hr className='my-4 border-t border-system-secondary-bg-transparent' />
			{activeTab === 'participants' && (
				<>
					<div className='overflow-auto flex-1 flex-grow-1 w-full'>
						<div className='bg-[#d6d3e3] rounded-t-md'>
							<p className='px-4 pt-2 font-medium'>Speakers</p>
							<div className=' grid grid-cols-3 bg-[#D6D3E3] text-brand-primary p-5 rounded-lg gap-6 '>
								{role === 'Speaker' && (
									<div key={currentUser.DocId} className='flex flex-col items-center'>
										<img src={currentUser.ProfilePicture ? currentUser.ProfilePicture : avatar} alt='' className='h-20 rounded-full overflow-hidden w-20 object-cover' />
										<p className='text-center truncate'>You</p>
									</div>
								)}
								{speakers.length > 0 &&
									speakers.map((user) => {
										if (user.UserId === currentUser.DocId) return
										return (
											<div key={user.UserId} className='flex flex-col items-center'>
												<img src={user.UserAvatar ? user.UserAvatar : avatar} alt='' className='h-20 rounded-full overflow-hidden w-20 object-cover' />
												<p className='text-center truncate'>{user.UserId === currentUser.DocId ? 'You' : user.UserName}</p>
											</div>
										)
									})}
							</div>
						</div>
						<div className='bg-[#d6d3e3] rounded-b-md'>
							<p className='px-4 pt-2 font-medium'>Audience</p>
							<div className=' grid grid-cols-3 bg-[#D6D3E3] text-brand-primary p-5 rounded-lg gap-6 '>
								{role === 'Member' && (
									<div key={currentUser.DocId} className='flex flex-col items-center'>
										<img src={currentUser.ProfilePicture ? currentUser.ProfilePicture : avatar} alt='' className='h-20 rounded-full overflow-hidden w-20 object-cover' />
										<p className='text-center truncate'>You</p>
									</div>
								)}
								{participants.length > 0 &&
									participants.map((user) => {
										if (user.UserId === currentUser.DocId) return
										return (
											<div key={user.UserId} className='flex flex-col items-center'>
												<img src={user.UserAvatar ? user.UserAvatar : avatar} alt='' className='h-20 rounded-full overflow-hidden w-20 object-cover' />
												<p className='text-center truncate'>{user.UserId === currentUser.DocId ? 'You' : user.UserName}</p>
											</div>
										)
									})}
							</div>
						</div>
					</div>
					<div className='my-2'>
						<Button variant='danger' width='full' size='md' onClick={leaveEvent}>
							Leave
						</Button>
					</div>
				</>
			)}
			{activeTab === 'messages' && (
				<>
					<div className='overflow-y-auto flex-1 mb-20 w-full no-scrollbar'>
						<div className='flex flex-col gap-2 my-2 '>
							{messages.length > 0 &&
								messages.map((message) => {
									if (message.AuthorId === currentUser.DocId) {
										return (
											<div key={`${message.CreatedIndex}-${message.AuthorId}`} className='flex gap-2 items-start self-end text-right'>
												<div className='flex flex-col gap-2'>
													<p className='text-white text-sm'> You</p>
													<p className='text-system-secondary-bg bg-gray-600 py-3 px-4 rounded-md'>{message.Content}</p>
												</div>
											</div>
										)
									}
									return (
										<div key={`${message.CreatedIndex}-${message.AuthorId}`} className='flex gap-2 items-start self-start'>
											<img src={message.AuthorAvatar ? message.AuthorAvatar : avatar} alt='' className='h-12 w-12 rounded-full overflow-hidden  object-cover' />
											<div className='flex flex-col gap-2'>
												<p className='text-white text-sm'> {message.AuthorName}</p>
												<p className='text-system-secondary-bg bg-gray-600 py-3 px-4 rounded-md'>{message.Content}</p>
											</div>
										</div>
									)
								})}
							<div ref={messagesEndRef} />
						</div>
					</div>
					<div className='my-4 absolute bottom-0 px-4 w-full left-0 right-0'>
						<MessageInput
							value={messageToSend}
							onChange={(e) => setMessageToSend(e.target.value)}
							onClick={() => {
								if (messageToSend !== '') {
									const AuthorId = currentUser.DocId
									const Content = messageToSend
									const CreatedIndex = new Date().getTime()
									const AuthorAvatar = currentUser.ProfilePicture
									const AuthorName = currentUser.FullName

									const MessageContent = { AuthorId, Content, CreatedIndex, AuthorAvatar, AuthorName }
									setMessages((prev) => [...prev, MessageContent])

									sendMessage(JSON.stringify(MessageContent))
									setMessageToSend('')
								}
							}}
						/>
					</div>
				</>
			)}
		</div>
	)
}

const MessageInput = ({ value, onChange, onClick }) => {
	return (
		<div className='flex bg-gray-700 gap-2 p-2 rounded-md w-full'>
			<Input
				width='full'
				value={value}
				placeholder='Enter Message Here'
				className='bg-transparent flex-1 text-system-secondary-bg outline-none border-none focus:bg-transparent focus:outline-none  focus:border-none hover:shadow-none'
				onChange={onChange}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						onClick()
					}
				}}
			/>
			<Button className='px-4 bg-system-secondary-bg' onClick={onClick}>
				<img src={send} className='h-6  w-6' />
			</Button>
		</div>
	)
}

export default NewStreamParticipantList
