

import { useNavigate } from "react-router-dom"
import Tab from "../components/ui/Tab";
import EventsList from "../components/Events/EventsList";
import { useState } from "react";
import { MAINTAB, _retrieveData, _storeData } from "../utils/LocalStorage";
import MembersSection from "../components/Connections/MembersSection";
import { relativeTime } from "../utils/date";
import DropdownMenu from "../components/ui/DropdownMenu";
import StaggeredList from "../components/ui/StaggeredList";
import VideoPlayer from "../components/ui/VideoPlayer";

const MyProfile = () => {

    const [activeTab, setActiveTab] = useState((_retrieveData(MAINTAB) && _retrieveData(MAINTAB)["myprofile"]) ? Number(_retrieveData(MAINTAB)["myprofile"]) : 0)
    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate(-1);
    };

    const tabs = () => [
        {
            key: 0,
            title: "Timeline",
            render: () => <div className="bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg ">
                <div className="p-5 pr-10 bg-system-secondary-bg rounded-lg mb-3">
                    <div className="flex items-center gap-5">
                        <img className="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar" />

                        <div className="flex-1 rounded-md p-2 px-3 border border-system-file-border flex items-center justify-between bg-system-secondary-bg">
                            <h4 className="font-medium text-xl text-brand-gray-dim italic ">Share what's on your mind, Frank</h4>

                        </div>

                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="p-5 bg-system-secondary-bg rounded-lg border border-system-file-border">
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
                    <div className="p-5 bg-system-secondary-bg rounded-lg border border-system-file-border">
                        <div className="flex items-start gap-2">
                            <img className="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Rounded avatar" />

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-10">
                                    <h4 className="font-semibold text-xl text-system-primary-accent mt-1">Frank-Jurgen Ritcher</h4>
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
                </div>
            </div>
        },
        {
            key: 1,
            title: "About",
            render: () => <>
                <div className="bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-b-lg ">
                    <div className="flex w-full items-start justify-end text-system-primary-text">
                        <svg className="w-6 h-6 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                        </svg>
                    </div>
                    <div className="grid lg:grid-cols-4 gap-y-6">
                        <div>
                            <h4 className="font-medium text-brand-gray-dim">Full Name</h4>
                        </div>
                        <div className="lg:col-span-3">
                            <h4 className="font-medium text-system-primary-text">Frank-Jurgen Ritcher</h4>
                        </div>
                        <div>
                            <h4 className="font-medium text-brand-gray-dim">User Name</h4>
                        </div>
                        <div className="lg:col-span-3">
                            <h4 className="font-medium text-system-primary-text">Frank</h4>
                        </div>
                        <div>
                            <h4 className="font-medium text-brand-gray-dim">Email</h4>
                        </div>
                        <div className="lg:col-span-3">
                            <h4 className="font-medium text-system-primary-text">Frank@gmail.com</h4>
                        </div>
                        <div>
                            <h4 className="font-medium text-brand-gray-dim">Job Title</h4>
                        </div>
                        <div className="lg:col-span-3">
                            <h4 className="font-medium text-system-primary-text">Consultant</h4>
                        </div>
                        <div>
                            <h4 className="font-medium text-brand-gray-dim">Company Name</h4>
                        </div>
                        <div className="lg:col-span-3">
                            <h4 className="font-medium text-system-primary-text">Horasis</h4>
                        </div>
                        <div>
                            <h4 className="font-medium text-brand-gray-dim">Country</h4>
                        </div>
                        <div className="lg:col-span-3">
                            <h4 className="font-medium text-system-primary-text">United States</h4>
                        </div>
                        <div>
                            <h4 className="font-medium text-brand-gray-dim">Bio</h4>
                        </div>
                        <div className="lg:col-span-3">
                            <h4 className="font-medium text-system-primary-text">
                                With over 15 years of experience in the technology and management consulting industries, Frank Johnson is a seasoned consultant renowned for delivering strategic solutions that drive business growth and innovation. Specializing in digital transformation, financial strategy, and organizational development, Frank has a proven track record of helping clients achieve their goals through tailored, actionable insights.
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5">
                    <div className="flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border">
                        <h4 className="font-medium text-lg text-system-primary-text">Notification</h4>
                        <h4 className="font-medium text-lg text-system-primary-accent">ON</h4>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <h4 className="font-medium text-lg text-system-primary-text">Language</h4>
                        <h4 className="font-medium text-lg text-system-primary-accent">English</h4>
                    </div>
                </div>
                <div className="bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5">
                    <div className="flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border">
                        <h4 className="font-medium text-lg text-system-primary-text">Security</h4>
                    </div>
                    <div className="flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border">
                        <h4 className="font-medium text-lg text-system-primary-text">Help & Support</h4>
                    </div>
                    <div className="flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border">
                        <h4 className="font-medium text-lg text-system-primary-text">Contact Us</h4>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <h4 className="font-medium text-lg text-system-primary-text">Privacy Policy</h4>
                    </div>
                </div>
            </>
        },
        {
            key: 2,
            title: "Connections",
            render: () => <div className="bg-system-secondary-bg p-4 lg:p-6 rounded-b-lg ">
                <MembersSection />
            </div>
        },
        {
            key: 3,
            title: "Events",
            render: () => <div className="bg-system-secondary-bg p-4 lg:p-10 rounded-b-lg ">
                <EventsList cols={4} gap="gap-1 lg:gap-x-16 lg:gap-y-10" />
            </div>
        },
        {
            key: 4,
            title: "Videos",
            render: () => <div className="bg-system-secondary-bg p-4 rounded-b-lg ">
                <div className="grid grid-cols-2 gap-4 p-4">
                    <VideoPlayer url={'https://stor.oceansfutures.org/oceansfuture-storage/assets/wwf_fc9393fe1e.mp4'} />
                    <VideoPlayer url={'https://stor.oceansfutures.org/oceansfuture-storage/assets/wwf_fc9393fe1e.mp4'} />
                </div>
            </div>
        },
        {
            key: 5,
            title: "Photos",
            render: () => <div className="bg-system-secondary-bg p-4 rounded-b-lg ">
                <StaggeredList />
            </div>
        },
        {
            key: 6,
            title: "Discussions",
            render: () => <div className="bg-system-secondary-bg p-4 lg:py-10 lg:px-12 rounded-b-lg ">
                <div className="flex flex-col gap-6">
                    <div className="border-b border-system-file-border pb-6">
                        <div className="flex items-start gap-2">
                            <div className="w-28 h-20 overflow-hidden rounded-lg">
                                <img className="w-full h-full object-cover" src="https://th.bing.com/th/id/OIP.fRpB3M9oOQSmhd5hwcmHtAHaFj?w=216&h=180&c=7&r=0&o=5&pid=1.7" alt="Rounded avatar" />

                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-10">
                                    <div>
                                        <h4 className="font-semibold text-system-primary-text text-md">Education</h4>
                                        <h4 className="text-brand-gray-dim text-sm mt-1">joined the Eventorasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meeting</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between gap-6">
                                <h4 className="font-medium text-sm text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                <DropdownMenu />
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-system-file-border pb-6">
                        <div className="flex items-start gap-2">
                            <div className="w-28 h-20 overflow-hidden rounded-lg">
                                <img className="w-full h-full object-cover" src="https://th.bing.com/th/id/OIP.CL6wvO0RBhLq7raz1iCn_gHaEK?rs=1&pid=ImgDetMain" alt="Rounded avatar" />

                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-10">
                                    <div>
                                        <h4 className="font-semibold text-system-primary-text text-md">health Care</h4>
                                        <h4 className="text-brand-gray-dim text-sm mt-1">joined the Eventorasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis Global Meeting</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between gap-6">
                                <h4 className="font-medium text-sm text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                <DropdownMenu />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        },
        {
            key: 7,
            title: "Documents",
            render: () => <div className="bg-system-secondary-bg p-4 lg:py-10 lg:px-12 rounded-b-lg ">
                <div className="flex flex-col gap-6">
                    <div className="border-b border-system-file-border pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 overflow-hidden rounded-lg">
                                <img className="w-full h-full object-contain" src="https://th.bing.com/th/id/OIP.O-6F-svmDZRlmeu9Pyy2jQHaFV?w=273&h=197&c=7&r=0&o=5&pid=1.7" alt="Rounded avatar" />

                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-10">
                                    <div>
                                        <h4 className="font-semibold text-system-primary-text text-md">image</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between gap-6">
                                <h4 className="font-medium text-sm text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                <DropdownMenu />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        },
    ]

    const onTabChange = (item) => {
        setActiveTab(item.key)
        _storeData(MAINTAB, { "myprofile": item.key })
    }

    return (<>
        <div className="p-2 lg:px-10 lg:py-6">
            <div className="rounded-lg z-20 bg-red-400 h-40 lg:h-80 relative">
                <img src="https://th.bing.com/th/id/OIP.FFchRAWwk-emGNqgImzwaAHaEK?rs=1&pid=ImgDetMain" className="object-cover h-full w-full rounded-lg" />
                <div className="absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 bg-brand-blue-transparent h-100 overflow-hidden rounded-lg">
                    <div className="flex w-full items-start justify-between">
                        <div className="flex items-center cursor-pointer" onClick={handleGoBack}>
                            {/* back arrow */}
                            <h4 className="font-medium text-xl text-brand-secondary">Back</h4>
                        </div>
                        <div className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                            </svg>
                        </div>

                    </div>

                </div>
                <div className="flex justify-center items-center cursor-pointer absolute left-5 -bottom-3 lg:left-20 lg:-bottom-8 z-30" >
                    <img className="w-24 lg:w-60 h-24 lg:h-60 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar" />
                </div>
            </div>
        </div>
        <div className="p-2 lg:px-10 lg:py-6 pt-6">
            <div className="grid lg:grid-cols-4 gap-3 lg:gap-12 ">
                <div className="py-5 lg:py-8 px-16 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8">
                    <h4 className="font-medium text-2xl text-center text-system-primary-text">Frank-Jurgen Ritcher</h4>
                    <h4 className="font-medium text-xl text-brand-gray-dim text-center">@Frank</h4>
                    <div className="flex justify-center items-center mt-2 lg:mt-6">
                        <div className="w-full p-3 rounded-full bg-system-secondary-accent text-center inline-block">
                            <span className="text-system-primary-accent text-md font-semibold">Admin</span>
                        </div>
                    </div>
                    <h4 className="font-semibold text-xl text-system-primary-text mt-3 lg:mt-6">About</h4>
                </div>

                <div className="lg:col-span-3">
                    <Tab onTabChange={onTabChange} activeTab={activeTab} name="myprofile" tabs={tabs()} alignment="justify-start" />

                </div>
            </div>
        </div>
    </>)
}


export default MyProfile
