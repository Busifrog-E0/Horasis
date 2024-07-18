import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import EmptyMembers from '../components/Common/EmptyMembers'
import TimeLineTab from '../components/Activities/TimeLineTab'
import MentionedTab from '../components/Activities/Mentions/MentionedTab'

const Activities = () => {

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
                        <TimeLineTab api={'activities'} gapBnTabs="gap-3" classNameForPost='p-5 pr-10 ' header="All Updates" />
                    </div>
                    <div>
                        <div className='p-5 bg-system-secondary-bg rounded-lg'>
                            <div className='flex items-center justify-between gap-2 mb-5'>
                                <h4 className='font-medium text-2xl text-system-primary-text'>Events</h4>
                                {/* arrow cursor-pointer */}
                            </div>
                            <EmptyMembers emptyText={'No events'} />
                            {/* <div className="flex flex-col gap-4">
                            <div className="border-b border-system-file-border pb-4">
                                <div className="flex items-start gap-2 ">
                                    <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-10">
                                            <h4 className="font-semibold text-system-primary-accent">James Lim</h4>
                                            <h4 className="font-medium text-sm text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                        </div>
                                        <h4 className="text-system-primary-text text-base">joined the Event Horasis Global Meeting</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-system-file-border pb-4">
                                <div className="flex items-start gap-2">
                                    <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Rounded avatar" />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-10">
                                            <h4 className="font-semibold text-system-primary-accent">Tejeswara Rao Pedada</h4>
                                            <h4 className="font-medium text-sm text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                        </div>
                                        <h4 className="text-system-primary-text text-base">joined the Event Horasis Global Meeting</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-system-file-border pb-4">
                                <div className="flex items-start gap-2">
                                    <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="Rounded avatar" />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-10">
                                            <h4 className="font-semibold text-system-primary-accent">Lee Wen De
                                            </h4>
                                            <h4 className="font-medium text-sm text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                        </div>
                                        <h4 className="text-system-primary-text text-base">joined the Event Horasis Global Meeting</h4>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        </div>
                        <MentionedTab />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Activities
