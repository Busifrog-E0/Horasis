import { useState } from 'react'
import avatar from '../../assets/icons/avatar.svg'
import Button from '../ui/Button'
import Input from '../ui/Input'
const NewStreamParticipantList = ({ participants, currentUser, leaveEvent, sendMessage, messages, setMessages }) => {
	const [activeTab, setActiveTab] = useState('participants')
	const [messageToSend, setMessageToSend] = useState('')
	return (
		<div className='flex flex-col h-full overflow-hidden p-6 bg-system-primary-accent-dim shadow-lg rounded-lg'>
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
				<div className='overflow-auto flex-1 flex-grow-1 w-full'>
					<div className=' grid grid-cols-3 bg-[#D6D3E3] text-brand-primary p-5 rounded-lg gap-6 '>
						{participants.length > 0 &&
							participants.map((user) => (
								<div key={user.UserId} className='flex flex-col items-center'>
									<img src={user.UserAvatar ? user.UserAvatar : avatar} alt='' className='h-20 rounded-full overflow-hidden w-20 object-cover' />
									<p className='text-center truncate'>{user.UserId === currentUser.DocId ? 'You' : user.UserName}</p>
								</div>
							))}
					</div>
				</div>
			)}
			{activeTab === 'messages' && (
				<div className='overflow-auto flex-1 flex-grow-1 w-full'>
					<div className='flex flex-col gap-2 my-2'>
						{messages.length > 0 &&
							messages.map((message) => {
								return (
									<div key={`${message.CreatedIndex}-${message.AuthorId}`} className='flex gap-2'>
										<img src={message.AuthorAvatar ? message.AuthorAvatar : avatar} alt='' className='h-6 rounded-full overflow-hidden w-6 object-cover' />
										<div>
											<p className='text-white text-sm'> {message.AuthorName}</p>
											<p className='text-system-secondary-bg bg-system-primary-darker-accent p-2 rounded-md'>{message.Content}</p>
										</div>
									</div>
								)
							})}
					</div>
					<Input value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)} />
					<Button
						onClick={() => {
							const AuthorId = currentUser.DocId
							const Content = messageToSend
							const CreatedIndex = new Date().getTime()
							const AuthorAvatar = currentUser.ProfilePicture
							const AuthorName = currentUser.FullName

							const MessageContent = { AuthorId, Content, CreatedIndex, AuthorAvatar, AuthorName }
							setMessages((prev) => [...prev, MessageContent])

							sendMessage(JSON.stringify(MessageContent))
							setMessageToSend('')
						}}>
						Send
					</Button>
				</div>
			)}
			<div className='my-2'>
				<Button variant='danger' width='full' size='md' onClick={leaveEvent}>
					Leave
				</Button>
			</div>
		</div>
	)
}

export default NewStreamParticipantList
