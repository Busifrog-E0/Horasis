import React from 'react'
import { relativeTime } from '../../utils/date'
import avatar from '../../assets/icons/avatar.svg'

const ChatDetailsItem = ({ user, conversation, onChatClick }) => {
	return (
		<div className='p-3 px-5 border-b border-system-file-border cursor-pointer' onClick={() => onChatClick(user.DocId)}>
			<div className='flex items-start gap-2'>
				{user.ProfilePicture ? (
					<img className='w-12 h-12 rounded-full object-cover' src={user?.ProfilePicture} alt='Rounded avatar' />
				) : (
					<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
				)}
				<div className='flex-1 w-10'>
					<h4 className='font-semibold text-md text-system-primary-accent'>{user.FullName}</h4>
					<h4 className='text-sm font-medium text-system-primary-text truncate text-ellipsis'>
						{conversation?.LatestMessage?.Content}
					</h4>
				</div>
				<div className='flex flex-col items-end gap-2'>
					<h4 className='font-medium text-xs text-brand-gray-dim'>
						{relativeTime(conversation?.LatestMessage?.CreatedIndex)}
					</h4>
				
					{conversation.NumberOfUnseenMessages !== undefined && (
						<>
							{conversation.NumberOfUnseenMessages !== 0 && (
								<div className='p-1 bg-system-primary-accent aspect-square flex items-center justify-center rounded-full'>
									<p className=' m-0 p-0 leading-none text-system-secondary-bg'>
										{conversation.NumberOfUnseenMessages}
									</p>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default ChatDetailsItem
