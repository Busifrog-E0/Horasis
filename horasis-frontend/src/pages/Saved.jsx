import MentionedActivities from "../components/Activities/Mentions/MentionedActivities"
import SavedActivities from "../components/Activities/Saved/SavedActivities"
import EmptyMembers from "../components/Common/EmptyMembers"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import RecentlyActiveMemebrsTab from "../components/Members/RecentlyActiveMemebrsTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"


const Saved = () => {

    return (
        <>
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
                        <SavedActivities gapBnTabs="gap-3" classNameForPost='p-5 pr-10 ' header="All Updates" />
                    </div>
                    <div>
                        <div className='p-5 bg-system-secondary-bg rounded-lg'>
                            <div className='flex items-center justify-between gap-2 mb-5'>
                                <h4 className='font-medium text-2xl text-system-primary-text'>Events</h4>
                                {/* arrow cursor-pointer */}
                            </div>
                            <EmptyMembers emptyText={'No events'} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Saved
