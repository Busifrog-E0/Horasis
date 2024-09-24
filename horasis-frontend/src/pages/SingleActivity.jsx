import { useParams } from 'react-router-dom'
import ActivityComponent from '../components/Activities/ActivityComponent'
import MentionedTab from '../components/Activities/Mentions/MentionedTab'
import EmptyMembers from '../components/Common/EmptyMembers'

const SingleActivity = () => {
	const { activityid } = useParams()
	return (
		<>
			<div className='lg:col-span-2'>
				<ActivityComponent
					titleSize='text-xl'
					descriptionSize='text-lg font-medium'
					onDelete={(DocId) => {}}
					activityId={activityid}
					bordered={false}
					avatarSize={'w-16 h-16'}
					className={`p-5 bg-system-secondary-bg rounded-lg relative`}
					openComment={true}
				/>
			</div>
			<div className='flex flex-col gap-4'>
				<div className='p-5 bg-system-secondary-bg rounded-lg'>
					<div className='flex items-center justify-between gap-2 mb-5'>
						<h4 className='font-medium text-2xl text-system-primary-text'>Events</h4>
					</div>
					<EmptyMembers emptyText={'No events'} />
				</div>
				<MentionedTab />
			</div>
		</>
	)
}

export default SingleActivity
