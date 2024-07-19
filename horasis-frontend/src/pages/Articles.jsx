import { useNavigate } from "react-router-dom"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import RecentlyActiveMemebrsTab from "../components/Members/RecentlyActiveMemebrsTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import DropdownMenu from "../components/ui/DropdownMenu"
import { relativeTime } from "../utils/date"
import SearchBar from "../components/SearchBar"
import InsightsList from "../components/Insights/InsightsList"

const Articles = () => {
    const navigate = useNavigate()
    const OnClickCreateNew = (path) => {
        navigate(path)
    }
    return (<>
        <div className="absolute z-10 right-0 bottom-0 p-10 px-14">
            <div onClick={() => OnClickCreateNew("/articles/create/new")} className="h-16 w-16 cursor-pointer shadow-lg bg-system-primary-btn p-5 rounded-full">
                <svg className="cursor-pointer w-full h-full text-brand-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
            </div>
        </div>
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
                        <InsightsList data={[]} emptyText={"No insights"} />
                    </div>

                </div>
            </div>
        </div>
    </>)
}


export default Articles
