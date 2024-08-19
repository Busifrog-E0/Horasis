import MentionedTab from '../components/Activities/Mentions/MentionedTab'
import SavedActivityTab from '../components/Activities/Saved/SavedActivityTab'
import SavedArticlesTab from '../components/Articles/SavedArticlesTab'
import SuggestionsSection from '../components/Connections/SuggestionsSection'
import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'

const SavedArticlesPage = () => {
	return (
		<div className='p-2 lg:px-10 lg:py-6'>
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
				<div className='lg:col-span-2'>
					<SavedArticlesTab loadMoreEnabled={true} iconPresent={false} />
					{/* <SuggestionsSection loadMoreEnabled={true} limit={8} iconPresent={false} /> */}
					{/* <SavedActivities gapBnTabs="gap-3" classNameForPost='p-5 pr-10 ' header="All Updates" /> */}
				</div>
				<div className='flex flex-col gap-4'>
					{/* <div className='p-5 bg-system-secondary-bg rounded-lg'>
        <div className='flex items-center justify-between gap-2 mb-5'>
          <h4 className='font-medium text-2xl text-system-primary-text'>Events</h4>
        </div>
        <EmptyMembers emptyText={'No events'} />
      </div> */}
					<SavedActivityTab />
					<MentionedTab />
				</div>
			</div>
		</div>
	)
}

export default SavedArticlesPage
