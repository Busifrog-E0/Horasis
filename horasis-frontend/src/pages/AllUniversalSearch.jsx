import { useNavigate } from "react-router-dom"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import RecentlyActiveMemebrsTab from "../components/Members/RecentlyActiveMemebrsTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import SearchBar from "../components/SearchBar"

const AllUniversalSearch = () => {
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
                    <div className="mb-3 lg:mb-5 lg:pr-64">
                        <SearchBar />
                    </div>
                    <div className="p-5 bg-system-secondary-bg rounded-lg px-14">
                        <h4 className="font-semibold text-md text-brand-gray">Insights</h4>
                        <div className="flex flex-col gap-10">
                            <div className="mt-2">
                                <div className="h-52 overflow-hidden rounded-lg">
                                    <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
                                </div>
                                <h4 className="font-semibold text-lg text-system-primary-accent mt-4">
                                    Horasis Lorem ipsum dolor sit ame..
                                </h4>
                                <h4 className="text-base mt-2 text-system-primary-accent">
                                    by Frank-Jurgen Richter
                                </h4>
                                <h4 className="text-xs text-brand-gray-dim mt-2">
                                    March 15 2023
                                </h4>
                            </div>
                            <div className="mt-2">
                                <div className="h-52 overflow-hidden rounded-lg">
                                    <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
                                </div>
                                <h4 className="font-semibold text-lg text-system-primary-accent mt-4">
                                    Horasis Lorem ipsum dolor sit ame..
                                </h4>
                                <h4 className="text-base mt-2 text-system-primary-accent">
                                    by Frank-Jurgen Richter
                                </h4>
                                <h4 className="text-xs text-brand-gray-dim mt-2">
                                    March 15 2023
                                </h4>
                            </div>
                            <div className="mt-2">
                                <div className="h-52 overflow-hidden rounded-lg">
                                    <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
                                </div>
                                <h4 className="font-semibold text-lg text-system-primary-accent mt-4">
                                    Horasis Lorem ipsum dolor sit ame..
                                </h4>
                                <h4 className="text-base mt-2 text-system-primary-accent">
                                    by Frank-Jurgen Richter
                                </h4>
                                <h4 className="text-xs text-brand-gray-dim mt-2">
                                    March 15 2023
                                </h4>
                            </div>
                            <div className="mt-2">
                                <div className="h-52 overflow-hidden rounded-lg">
                                    <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
                                </div>
                                <h4 className="font-semibold text-lg text-system-primary-accent mt-4">
                                    Horasis Lorem ipsum dolor sit ame..
                                </h4>
                                <h4 className="text-base mt-2 text-system-primary-accent">
                                    by Frank-Jurgen Richter
                                </h4>
                                <h4 className="text-xs text-brand-gray-dim mt-2">
                                    March 15 2023
                                </h4>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>)
}


export default AllUniversalSearch
