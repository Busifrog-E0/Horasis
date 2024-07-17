import { useState } from 'react'
import { relativeTime } from '../../../utils/date'
import ActivityCommentReply from './ActivityCommentReply'
import avatar from '../../../assets/icons/avatar.svg'

const ActivityComment = ({ comment }) => {
	const [showReplies, setShowReplies] = useState(false)
	return (
		<div className='flex flex-col w-full bg-system-primary-bg rounded-lg'>
			<div className='flex items-start gap-2 bg-system-primary-bg w-full p-4 rounded-lg'>
				{comment?.UserDetails?.ProfilePicture ? (
					<>
						<img className='w-8 h-8 rounded-full' src={comment?.UserDetails?.ProfilePicture} alt='Rounded avatar' />
					</>
				) : (
					<>
						<img className='w-8 h-8 rounded-full' src={avatar} alt='Rounded avatar' />
					</>
				)}

				<div className='flex-1'>
					<div className='flex items-start justify-between gap-10'>
						<div className='flex  flex-col gap-2'>
							<h4 className='font-semibold text-md text-system-primary-accent mt-1'>
								{comment?.UserDetails?.FullName}
							</h4>
							<h4 className='text-system-primary-text text-md'>{comment?.Content}</h4>
							<h4
								className='text-system-primary-accent text-sm cursor-pointer'
								onClick={() => setShowReplies((prev) => !prev)}>
								View Replies
							</h4>
						</div>
						<h4 className='font-medium text-base text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
					</div>
				</div>
			</div>
			{showReplies && [0, 1, 2].map((item) => <ActivityCommentReply key={item} reply={comment} />)}
		</div>
	)
}

export default ActivityComment
