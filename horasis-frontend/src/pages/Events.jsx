import { useContext } from 'react'
import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import Button from '../components/ui/Button'
import TabItem from '../components/ui/TabItem'
import { AuthContext } from '../utils/AuthProvider'
import { useNavigate } from 'react-router-dom'
import EventsList from '../components/Events/EventsList'
import EventsSection from '../components/Events/EventsSection'
import UpcomingEvents from '../components/Events/UpcomingEvents'

const Events = () => {
    const { currentUserData, scrollToTop } = useContext(AuthContext)
    const isPermitted = currentUserData.CurrentUser.Role.includes('Admin')
    const navigate = useNavigate()
    const OnClickCreateNew = (path) => {
        scrollToTop()
        navigate(path)
    }

    return (
        <>
            {/* <div className="p-2 lg:px-10 lg:py-6">
            <div className="grid lg:grid-cols-4 gap-3 lg:gap-12">
                <div className="hidden lg:block">
                    <CurrentProfileTab />
                    <h4 className="font-medium text-xl text-system-primary-text mt-3 lg:mt-5">Today's Event</h4>
                    <TodaysEventTab />

                    <div className="p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5">
                        <h4 className="font-medium text-md text-system-primary-text mb-4">Recently Active Members</h4>
                        <RecentlyActiveMemebrsTab />
                    </div>
                </div>
            </div>
        </div> */}
            <div className='lg:col-span-2'>
                <EventsSection />
            </div>
            <div>
                {isPermitted && (
                    <Button onClick={() => OnClickCreateNew('/Events/Create/New')} width='full' variant='black' className=' mb-4 lg:mb-8'>
                        Create an Event
                    </Button>
                )}
                <UpcomingEvents />
            </div>
        </>
    )
}

export default Events
