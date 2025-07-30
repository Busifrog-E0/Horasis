import { useNavigate } from "react-router-dom"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import RecentlyActiveMemebrsTab from "../components/Members/RecentlyActiveMemebrsTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import SearchBar from "../components/SearchBar"

const UniversalSearch = () => {
    const navigate = useNavigate()
    const OnClickCreateNew = (path) => {
        navigate(path)
    }

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
                <div className="lg:col-span-3">
                    <div className="p-5 bg-system-secondary-bg rounded-lg lg:px-36 lg:py-8">
                        <SearchBar />
                        <h1 className="text-system-primary-accent text-2xl my-3 lg:my-8 font-medium">Recent Searches</h1>
                        <div className="grid grid-cols-5 gap-4">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar" />
                                <h5 className="text-system-primary-accent text-lg text-center">Frank-Jurgen Ritcher</h5>
                            </div>
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar" />
                                <h5 className="text-system-primary-accent text-lg text-center">Frank-Jurgen Ritcher</h5>
                            </div>
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar" />
                                <h5 className="text-system-primary-accent text-lg text-center">Frank-Jurgen Ritcher</h5>
                            </div>
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar" />
                                <h5 className="text-system-primary-accent text-lg text-center">Frank-Jurgen Ritcher</h5>
                            </div>
                        </div>
                        <div className="grid gap-4 mt-3 lg:mt-8">
                            <div className="flex flex-row justify-between items-start w-1/2">
                                <div className="flex-grow cursor-pointer">
                                    <h5 className="text-system-primary-accent text-lg">Frank-Jurgen Ritcher</h5>
                                </div>
                                <svg className="w-5 h-5 mb-2 text-system-primary-accent cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                            </div>
                            <div className="flex flex-row justify-between items-start w-1/2">
                                <div className="flex-grow cursor-pointer">
                                    <h5 className="text-system-primary-accent text-lg">Frank-Jurgen Ritcher</h5>
                                </div>
                                <svg className="w-5 h-5 mb-2 text-system-primary-accent cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                            </div>
                            <div className="flex flex-row justify-between items-start w-1/2">
                                <div className="flex-grow cursor-pointer">
                                    <h5 className="text-system-primary-accent text-lg">Frank-Jurgen Ritcher</h5>
                                </div>
                                <svg className="w-5 h-5 mb-2 text-system-primary-accent cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                            </div>
                            <div className="flex flex-row justify-between items-start w-1/2">
                                <div className="flex-grow cursor-pointer">
                                    <h5 className="text-system-primary-accent text-lg">Frank-Jurgen Ritcher</h5>
                                </div>
                                <svg className="w-5 h-5 mb-2 text-system-primary-accent cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>)
}


export default UniversalSearch
