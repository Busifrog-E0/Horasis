import { relativeTime } from "../../../utils/date"

const ActivityCommentReply = ({ reply }) => {
	return (
		<div className='flex items-start gap-2 bg-system-primary-bg w-full p-4 rounded-lg pl-20'>
			{reply.UserDetails.ProfilePicture ? (
				<>
					<img className='w-8 h-8 rounded-full' src={reply.UserDetails.ProfilePicture} alt='Rounded avatar' />
				</>
			) : (
				<>
					<img className='w-8 h-8 rounded-full' src={avatar} alt='Rounded avatar' />
				</>
			)}

			<div className='flex-1'>
				<div className='flex items-start justify-between gap-10'>
					<div className='flex  flex-col gap-2'>
						<h4 className='font-semibold text-md text-system-primary-accent mt-1'>{reply.UserDetails.FullName}</h4>
						<h4 className='text-system-primary-text text-md'>Updated their photo</h4>
					</div>
					<h4 className='font-medium text-base text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
				</div>
			</div>
		</div>
	)
}

export default ActivityCommentReply