import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import EmptyMembers from '../components/Common/EmptyMembers'
import TimeLineTab from '../components/Activities/TimeLineTab'
import MentionedTab from '../components/Activities/Mentions/MentionedTab'
import SavedActivityTab from '../components/Activities/Saved/SavedActivityTab'

const Activities = () => {
	return (
		<>
			{/* <div className='p-2 lg:px-10 lg:py-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
					<div>
						<CurrentProfileTab />
						<h4 className='font-medium text-xl text-system-primary-text mt-3 lg:mt-5'>Today's Event</h4>
						<TodaysEventTab />
						<div className='p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5'>
							<h4 className='font-medium text-md text-system-primary-text mb-4'>Recently Active Members</h4>
							<RecentlyActiveMemebrsTab />
						</div>
					</div>
			
				</div>
			</div> */}
			<div className='lg:col-span-2'>
				<TimeLineTab api={'feed'} gapBnTabs='gap-3' classNameForPost='p-5 ' header='All Updates' />
			</div>
			<div className='flex flex-col gap-4'>
				<MentionedTab />
				<SavedActivityTab bordered={true} />
			</div>
		</>
	)
}

export default Activities
