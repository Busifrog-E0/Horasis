import Button from '../ui/Button'

const DiscussionsAnalyticsTab = ({ discussion }) => {
	return (
		<>
			<div className='rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg border flex flex-col justify-between' >
				<div>
					<div className='h-32 overflow-hidden rounded-lg'>
						<img src={discussion?.CoverPicture} className='object-cover h-full w-full' />
					</div>

					<div className='p-1 px-3'>
						<div className='flex flex-wrap items-center gap-x-2'>
							<h4 className='text-xs text-brand-gray-dim'>{discussion?.Privacy} Discussion</h4>
							<h4 className='tetx-xs text-brand-gray-dim'>•</h4>
							<h4 className='text-xs text-brand-gray-dim'>{discussion?.NoOfMembers} Members</h4>
						</div>
						<h4 className='text-md font-medium text-system-primary-text mb-1 mt-5'>{discussion?.DiscussionName}</h4>
						<h4 className='text-sm text-brand-gray-dim leading-5 line-clamp-2'>{discussion?.Description}</h4>
					</div>
				</div>
				<div className='flex items-center justify-center gap-1 cursor-pointer px-4 my-2'>
					<p className='text-brand-gray-dim text-xs mt-1'>{discussion?.NoOfActivities} Posts</p>
				</div>
			</div>
		</>
	)
}

export default DiscussionsAnalyticsTab
