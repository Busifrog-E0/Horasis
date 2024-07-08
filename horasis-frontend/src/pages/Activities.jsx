import TodaysEventTab from "../components/Events/TodaysEventTab"
import RecentlyActiveMemebrsTab from "../components/Members/RecentlyActiveMemebrsTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import Button from "../components/ui/Button"
import DropdownMenu from "../components/ui/DropdownMenu"
import { relativeTime } from "../utils/date"

const Activities = () => {

    return (<>
        <div className="p-2 lg:px-10 lg:py-6">
            <div className="grid lg:grid-cols-4 gap-3 lg:gap-12">
                <div>
                    <CurrentProfileTab />
                    <h4 className="font-medium text-xl text-system-primary-text mt-3 lg:mt-5">Today's Event</h4>
                    <TodaysEventTab />
                    <div className="p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5">
                        <h4 className="font-medium text-md text-system-primary-text mb-4">Recently Active Members</h4>
                        <RecentlyActiveMemebrsTab />

                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="p-5 pr-10 bg-system-secondary-bg rounded-lg">
                        <div className="flex items-center gap-5">
                            <img className="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar" />

                            <div className="flex-1 rounded-md p-2 px-3 border border-system-file-border flex items-center justify-between bg-system-secondary-bg">
                                <h4 className="font-medium text-xl text-brand-gray-dim italic ">Share what's on your mind, Frank</h4>

                            </div>

                        </div>
                    </div>
                    {/* <div className="flex gap-3 flex-wrap mt-5">
                        <Button variant="redhot">
                            Join Event
                        </Button>
                        <Button variant="default">
                            Join Event
                        </Button>
                        <Button variant="white">
                            Join Event
                        </Button>
                        <Button variant="sea_outlined">
                            Join Event
                        </Button>
                        <Button variant="primary">
                            Join Event
                        </Button>
                        <Button variant="danger_outlined">
                            Join Event
                        </Button>
                        <Button variant="danger">
                            Join Event
                        </Button>
                        <Button variant="success">
                            Join Event
                        </Button>
                        <Button variant="disabled">
                            Join Event
                        </Button>
                    </div> */}
                    <h4 className="font-medium text-2xl text-system-primary-text mt-3 lg:mt-9 mb-4">All Updates</h4>
                    <div className="flex flex-col gap-3">
                        <div className="p-5 bg-system-secondary-bg rounded-lg">
                            <div className="flex items-start gap-2">
                                <img className="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />

                                <div className="flex-1">
                                    <h4 className="font-semibold text-xl text-system-primary-accent mt-1">James Lim</h4>
                                    <h4 className="text-system-primary-text mt-1">joined the Event Horasis Global Meeting</h4>

                                </div>
                                <div>
                                    <h4 className="font-medium text-base text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-system-secondary-bg rounded-lg">
                            <div className="flex items-start gap-2">
                                <img className="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar" />

                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-10">
                                        <h4 className="font-semibold text-xl text-system-primary-accent mt-1">Frank-Jurgen Ritcher</h4>
                                        <h4 className="font-medium text-base text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                    </div>
                                    <h4 className="text-system-primary-text mt-1">updated his profile photo</h4>

                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-10 mt-8">
                                <div className="flex flex-wrap items-start justify-between gap-10">
                                    <div className="flex items-start gap-1 cursor-pointer">
                                        <p className="text-brand-gray-dim mt-1">likes</p>
                                    </div>
                                    <div className="flex items-start gap-1 cursor-pointer">
                                        <p className="text-brand-gray-dim mt-1">replies</p>
                                    </div>
                                </div>
                                <DropdownMenu />
                            </div>
                        </div>
                        <div className="p-5 bg-system-secondary-bg rounded-lg">
                            <div className="flex items-start gap-2">
                                <img className="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Rounded avatar" />

                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-10">
                                        <h4 className="font-semibold text-xl text-system-primary-accent mt-1">Tejeswara Rao Pedada</h4>
                                        <h4 className="font-medium text-base text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                    </div>


                                </div>
                            </div>
                            <div className="mt-5">
                                <h4 className="text-system-primary-text font-medium text-xl">Have a great day!</h4>
                            </div>
                            <div className="flex items-center justify-between gap-10 mt-8">
                                <div className="flex flex-wrap items-start justify-between gap-10">
                                    <div className="flex items-start gap-1 cursor-pointer">
                                        <p className="text-brand-gray-dim mt-1">likes</p>
                                    </div>
                                    <div className="flex items-start gap-1 cursor-pointer">
                                        <p className="text-brand-gray-dim mt-1">replies</p>
                                    </div>
                                </div>
                                <DropdownMenu />
                            </div>
                        </div>
                        <div className="p-5 bg-system-secondary-bg rounded-lg">
                            <div className="flex items-start gap-2">
                                <img className="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="Rounded avatar" />

                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-10">
                                        <h4 className="font-semibold text-xl text-system-primary-accent mt-1">Lee Wen De</h4>
                                        <h4 className="font-medium text-base text-brand-gray-dim">{relativeTime(1706194651000)}</h4>
                                    </div>


                                </div>
                            </div>
                            <div className="mt-5">
                                <h4 className="text-system-primary-text font-medium text-xl">Any interesting events coming up?</h4>
                            </div>
                            <div className="flex items-center justify-between gap-10 mt-8">
                                <div className="flex flex-wrap items-start justify-between gap-10">
                                    <div className="flex items-start gap-1 cursor-pointer">
                                        <p className="text-brand-gray-dim mt-1">likes</p>
                                    </div>
                                    <div className="flex items-start gap-1 cursor-pointer">
                                        <p className="text-brand-gray-dim mt-1">replies</p>
                                    </div>
                                </div>
                                <DropdownMenu />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="p-5 bg-system-secondary-bg rounded-lg">
                        <div className="flex items-center justify-between gap-2 mb-5">
                            <h4 className="font-medium text-2xl text-system-primary-text">Events</h4>
                            {/* arrow cursor-pointer */}
                        </div>
                        <div className="flex flex-col gap-4">
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
                        </div>
                    </div>
                    <div className="p-5 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5">
                        <div className="flex items-center justify-between gap-2 mb-5">
                            <h4 className="font-medium text-2xl text-system-primary-text">Mentions</h4>
                            {/* arrow cursor-pointer */}
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="border-b border-system-file-border pb-4">
                                <div className="flex items-start gap-2 ">
                                    <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-10">
                                            <h4 className="font-semibold text-system-primary-accent">James Lim</h4>
                                            <h4 className="font-medium text-sm text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <h4 className="text-brand-gray-dim text-sm">Any interesting events coming up? <span className="text-system-primary-text font-semibold">Frank-Jurgen Ritcher</span></h4>
                                </div>
                                <div className="flex items-center justify-between gap-10 mt-3">
                                    <div className="flex flex-wrap items-start justify-between gap-10">
                                        <div className="flex items-start gap-1 cursor-pointer">
                                            <p className="text-sm text-brand-gray-dim mt-1">likes</p>
                                        </div>
                                        <div className="flex items-start gap-1 cursor-pointer">
                                            <p className="text-sm text-brand-gray-dim mt-1">replies</p>
                                        </div>
                                    </div>
                                    <DropdownMenu />
                                </div>
                            </div>
                            <div className="border-b border-system-file-border pb-4">
                                <div className="flex items-start gap-2 ">
                                    <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-10">
                                            <h4 className="font-semibold text-system-primary-accent">James Lim</h4>
                                            <h4 className="font-medium text-sm text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <h4 className="text-brand-gray-dim text-sm">Thank you! <span className="text-system-primary-text font-semibold">Frank-Jurgen Ritcher</span></h4>
                                </div>
                                <div className="flex items-center justify-between gap-10 mt-3">
                                    <div className="flex flex-wrap items-start justify-between gap-10">
                                        <div className="flex items-start gap-1 cursor-pointer">
                                            <p className="text-sm text-brand-gray-dim mt-1">likes</p>
                                        </div>
                                        <div className="flex items-start gap-1 cursor-pointer">
                                            <p className="text-sm text-brand-gray-dim mt-1">replies</p>
                                        </div>
                                    </div>
                                    <DropdownMenu />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}


export default Activities
