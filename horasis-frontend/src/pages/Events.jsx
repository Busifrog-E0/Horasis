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

				{/* <h4 className="font-medium text-2xl text-system-primary-accent mt-4 mb-1">Upcoming Events</h4>
                    <h4 className=" text-xl text-system-primary-text mb-2">Find answers, ask questions, and connect with our community aroundthe world.</h4>
                    <div className="flex gap-6 flex-wrap mt-4 mb-6">

                        <TabItem variant="active">
                            All Events
                        </TabItem>
                        <TabItem variant="inactive">
                            Popular Events
                        </TabItem>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-5">
                        <div className="bg-system-secondary-bg rounded-lg mt-3 overflow-hidden">
                            <div className="h-40 ">
                                <img src="https://th.bing.com/th/id/OIP.b6Wd5ElpRfRco6-8ZyL7NwHaE8?w=229&h=180&c=7&r=0&o=5&pid=1.7" className="object-cover h-full w-full rounded-lg" />
                            </div>
                            <div className="mt-1 grid grid-cols-7 gap-1 ">
                                <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col">
                                    <h4 className="text-xs text-center text-system-primary-text m-0">Jan</h4>
                                    <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">08</h4>
                                </div>
                                <div className="col-span-5 p-2 bg-system-secondary-bg rounded-lg shadow-lg">
                                    <h4 className="text-sm text-system-primary-text m-0 leading-4">Horasis India Meeting Worldwide Barcelona</h4>
                                    <h4 className="text-xs text-brand-gray-dim">Directly seated and inside for you to enjoy the show.</h4>

                                </div>

                            </div>
                        </div>
                        <div className="bg-system-secondary-bg rounded-lg mt-3 overflow-hidden">
                            <div className="h-40 ">
                                <img src="https://th.bing.com/th/id/OIP.TMjzM_W0Yn61ahSvOtBD-QHaEP?w=278&h=180&c=7&r=0&o=5&pid=1.7" className="object-cover h-full w-full rounded-lg" />
                            </div>
                            <div className="mt-1 grid grid-cols-7 gap-1 ">
                                <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col">
                                    <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
                                    <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">14</h4>
                                </div>
                                <div className="col-span-5 p-2 bg-system-secondary-bg rounded-lg shadow-lg">
                                    <h4 className="text-sm text-system-primary-text m-0 leading-4">Horasis USA Meeting Worldwide Barcelona</h4>
                                    <h4 className="text-xs text-brand-gray-dim">Directly seated and inside for you to enjoy the show.</h4>

                                </div>

                            </div>
                        </div>
                        <div className="bg-system-secondary-bg rounded-lg mt-3 overflow-hidden">
                            <div className="h-40 ">
                                <img src="https://partyslate.imgix.net/photos/221661/photo-e6d5744c-9727-4394-9593-19ed63113ab6.jpg?ixlib=js-2.3.2&w=1200&h=800&fit=crop" className="object-cover h-full w-full rounded-lg" />
                            </div>
                            <div className="mt-1 grid grid-cols-7 gap-1 ">
                                <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col">
                                    <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
                                    <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">18</h4>
                                </div>
                                <div className="col-span-5 p-2 bg-system-secondary-bg rounded-lg shadow-lg">
                                    <h4 className="text-sm text-system-primary-text m-0 leading-4">Horasis Meeting Worldwide Barcelona</h4>
                                    <h4 className="text-xs text-brand-gray-dim">Directly seated and inside for you to enjoy the show.</h4>

                                </div>

                            </div>
                        </div>
                        <div className="bg-system-secondary-bg rounded-lg mt-3 overflow-hidden">
                            <div className="h-40 ">
                                <img src="https://th.bing.com/th/id/OIP.kHXBiCvkXaeAtHwvS9uBbwHaEu?rs=1&pid=ImgDetMain" className="object-cover h-full w-full rounded-lg" />
                            </div>
                            <div className="mt-1 grid grid-cols-7 gap-1 ">
                                <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col">
                                    <h4 className="text-xs text-center text-system-primary-text m-0">Jan</h4>
                                    <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">08</h4>
                                </div>
                                <div className="col-span-5 p-2 bg-system-secondary-bg rounded-lg shadow-lg">
                                    <h4 className="text-sm text-system-primary-text m-0 leading-4">Horasis India Meeting Worldwide Barcelona</h4>
                                    <h4 className="text-xs text-brand-gray-dim">Directly seated and inside for you to enjoy the show.</h4>

                                </div>

                            </div>
                        </div>
                        <div className="bg-system-secondary-bg rounded-lg mt-3 overflow-hidden">
                            <div className="h-40 ">
                                <img src="https://i2-prod.manchestereveningnews.co.uk/incoming/article12751862.ece/ALTERNATES/s615b/161006_mpaawards_themidlandhotel_042.jpg" className="object-cover h-full w-full rounded-lg" />
                            </div>
                            <div className="mt-1 grid grid-cols-7 gap-1 ">
                                <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col">
                                    <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
                                    <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">14</h4>
                                </div>
                                <div className="col-span-5 p-2 bg-system-secondary-bg rounded-lg shadow-lg">
                                    <h4 className="text-sm text-system-primary-text m-0 leading-4">Horasis USA Meeting Worldwide Barcelona</h4>
                                    <h4 className="text-xs text-brand-gray-dim">Directly seated and inside for you to enjoy the show.</h4>

                                </div>

                            </div>
                        </div>
                        <div className="bg-system-secondary-bg rounded-lg mt-3 overflow-hidden">
                            <div className="h-40 ">
                                <img src="https://americanpavilion.com/wp-content/uploads/2018/04/Corporate-Event.jpg" className="object-cover h-full w-full rounded-lg" />
                            </div>
                            <div className="mt-1 grid grid-cols-7 gap-1 ">
                                <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col">
                                    <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
                                    <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">18</h4>
                                </div>
                                <div className="col-span-5 p-2 bg-system-secondary-bg rounded-lg shadow-lg">
                                    <h4 className="text-sm text-system-primary-text m-0 leading-4">Horasis Meeting Worldwide Barcelona</h4>
                                    <h4 className="text-xs text-brand-gray-dim">Directly seated and inside for you to enjoy the show.</h4>

                                </div>

                            </div>
                        </div>
                    </div> */}
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
