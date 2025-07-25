import { relativeTime } from '../../../utils/date'
import avatar from '../../../assets/icons/avatar.svg'
import MentionTextLink from '../Mentions/MentionTextLink'

const ActivityCommentReply = ({ reply, timeSize, titleSize, iconSize, descriptionSize }) => {
	return (
		<div className='flex items-start gap-2 bg-system-secondary-bg w-full p-4 rounded-lg '>
			{reply.UserDetails.ProfilePicture ? (
				<>
					<img className='w-8 h-8 rounded-full' src={reply?.UserDetails?.ProfilePicture} alt='Rounded avatar' />
				</>
			) : (
				<>
					<img className='w-8 h-8 rounded-full' src={avatar} alt='Rounded avatar' />
				</>
			)}

			<div className='flex-1'>
				<div className='flex items-start justify-between gap-10'>
					<div className='flex  flex-col gap-2'>
						<h4 className={`font-semibold ${titleSize?titleSize:'text-md'} text-system-primary-accent mt-1`}>{reply?.UserDetails?.FullName}</h4>
						{/* <h4 className='text-system-primary-text text-md'>{reply?.Content}</h4> */}
						<MentionTextLink singleActivity={reply} descriptionSize={descriptionSize} />
					</div>
					<h4 className={`font-medium ${timeSize?timeSize:'text-base'} text-brand-gray-dim`}>{relativeTime(reply?.CreatedIndex)}</h4>
				</div>
			</div>
		</div>
	)
}

export default ActivityCommentReply
