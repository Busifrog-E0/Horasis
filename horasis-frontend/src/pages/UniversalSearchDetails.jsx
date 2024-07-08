import { useNavigate } from "react-router-dom"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import RecentlyActiveMemebrsTab from "../components/Members/RecentlyActiveMemebrsTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import SearchBar from "../components/SearchBar"
import { MAINTAB, _retrieveData, _storeData } from "../utils/LocalStorage"
import { useState } from "react"
import Tab from "../components/ui/Tab"
import PostSectionTab from "../components/Posts/PostSectionTab"
import TabItem from "../components/ui/TabItem"
import EventsList from "../components/Events/EventsList"
import MembersSection from "../components/Connections/MembersSection"

const UniversalSearchDetails = () => {

    const [activeTab, setActiveTab] = useState((_retrieveData(MAINTAB) && _retrieveData(MAINTAB)["universalsearch"]) ? Number(_retrieveData(MAINTAB)["universalsearch"]) : 0)

    const tabs = () => [
        {
            key: 0,
            title: "All",
            render: () => <div>
                <div className="bg-system-secondary-bg p-3 lg:p-6 rounded-b-lg ">
                    <h4 className="font-semibold text-lg text-brand-gray mb-4">Posts</h4>
                    <div className="flex flex-col gap-4">

                        <PostSectionTab />
                        <PostSectionTab />
                    </div>
                    <div className="border-b border-system-file-border "></div>
                    <h4 className="font-semibold text-lg text-brand-gray mt-4 mb-2">Events</h4>
                    <div className="flex gap-6 flex-wrap my-2">

                        <TabItem variant="active">
                            All Events
                        </TabItem>
                        <TabItem variant="inactive">
                            My Upcoming Events
                        </TabItem>
                    </div>
                    <div className="lg:pr-32">
                        <EventsList cols={4} gap="gap-3 lg:gap-10" />
                    </div>
                    {/* <div className="flex flex-row justify-end mt-4 mb-2">
                        <div className="cursor-pointer flex items-center gap-2">
                            <h4 className="font-semibold text-xl text-system-primary-accent">Load More</h4>
                            <svg className="text-system-primary-accent h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                        </div>
                    </div> */}
                </div>

            </div>
        },
        {
            key: 1,
            title: "Members",
            render: () => <MembersSection />
        },
        {
            key: 2,
            title: "Posts",
            render: () => <></>
        },
        {
            key: 3,
            title: "Events",
            render: () => <></>
        },
        {
            key: 4,
            title: "Discussions",
            render: () => <></>
        },
        {
            key: 5,
            title: "Insights",
            render: () => <></>
        },
    ]
    const onTabChange = (item) => {
        setActiveTab(item.key)
        _storeData(MAINTAB, { "universalsearch": item.key })
    }
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
                    <Tab name="universalsearch" activeTab={activeTab} onTabChange={onTabChange} tabs={tabs()} />


                </div>
            </div>
        </div>
    </>)
}


export default UniversalSearchDetails
