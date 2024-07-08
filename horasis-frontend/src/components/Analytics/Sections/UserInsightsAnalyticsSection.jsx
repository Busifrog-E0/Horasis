import { useState } from "react"
import Button from "../../ui/Button"
import MiniTab from "../../ui/MiniTab"
import MiniProgressBar from "../MiniProgressBar"

const UserInsightsAnalyticsSection = () => {

    const [activeTab, setActiveTab] = useState(0)
    const tabs = () => [
        {
            title: "All Users",
            value: "158",
            update: "+10.8",
            render: () => <div className="bg-system-secondary-bg rounded-lg p-3"></div>
        },
        {
            title: "Active Users",
            value: "142",
            update: "+43",
            render: () => <div className="bg-system-secondary-bg rounded-lg p-3"></div>
        },
        {
            title: "Total No. of Posts",
            value: "2560",
            update: "+68",
            render: () => <div className="bg-system-secondary-bg rounded-lg p-3"></div>
        },
    ]

    const miniLocationTabs = () => [
        {
            title: "Country",
            render: () => <div className="flex flex-col gap-2 mt-3">
                <MiniProgressBar color="bg-system-primary-btn" title={"Singapore"} value={"60"} />
                <MiniProgressBar color="bg-system-primary-btn" title={"Vietnam"} value={"20"} />
                <MiniProgressBar color="bg-system-primary-btn" title={"India"} value={"10"} />
                <MiniProgressBar color="bg-system-primary-btn" title={"Malaysia"} value={"10"} />
            </div>
        },
        {
            title: "City",
            render: () => <div className="flex flex-col gap-2 mt-3">
                <MiniProgressBar color="bg-system-primary-btn" title={"Singapore, Singapore"} value={"66"} />
                <MiniProgressBar color="bg-system-primary-btn" title={"Hanoi, Vietnam"} value={"14"} />
                <MiniProgressBar color="bg-system-primary-btn" title={"New Delhi, India"} value={"10"} />
                <MiniProgressBar color="bg-system-primary-btn" title={"Johor Bahru, Malaysia"} value={"10"} />
            </div>
        },
    ]

    const miniJobTabs = () => [
        {
            title: "Industry",
            render: () => <div className="flex flex-col gap-2 mt-3">
                <MiniProgressBar color="bg-brand-orange" title={"Technology"} value={"60"} />
                <MiniProgressBar color="bg-brand-orange" title={"Health Care"} value={"20"} />
                <MiniProgressBar color="bg-brand-orange" title={"Finance"} value={"10"} />
                <MiniProgressBar color="bg-brand-orange" title={"Manufacturing"} value={"10"} />
                <MiniProgressBar color="bg-brand-orange" title={"Retail"} value={"10"} />
            </div>
        },
        {
            title: "Job Title",
            render: () => <div className="flex flex-col gap-2 mt-3">
                <MiniProgressBar color="bg-brand-orange" title={"IT Manager"} value={"40"} />
                <MiniProgressBar color="bg-brand-orange" title={"Chief Nursing Officer"} value={"35"} />
                <MiniProgressBar color="bg-brand-orange" title={"Treasurer"} value={"10"} />
                <MiniProgressBar color="bg-brand-orange" title={"Plant Manager"} value={"10"} />
                <MiniProgressBar color="bg-brand-orange" title={"Head of Visual Merchandising"} value={"5"} />
            </div>
        },
    ]



    return (<>
        <div className="bg-system-secondary-bg rounded-lg p-3 px-6 pr-20">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                    {/* icon goes here */}
                    <h4 className="font-semibold text-xl text-system-primary-text">User Insights</h4>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                    <div className="flex-1 rounded-md cursor-pointer p-1 px-4 border border-system-file-border flex items-center justify-between bg-system-secondary-bg">
                        <h4 className="text-lg text-brand-gray-dim ">Dec 19 - Jan 19</h4>

                    </div>
                    <Button
                        variant="black"
                    >
                        Download Report
                    </Button>
                </div>
            </div>
            <div className="mt-8">
                <div className="grid lg:grid-cols-3 gap-4 lg:gap-16">
                    <div>
                        <TabList
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tablist={tabs()}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <TabContent>{tabs()[activeTab].render()}</TabContent>

                    </div>
                </div>
            </div>
        </div>
        <div className="bg-system-secondary-bg rounded-lg p-3 px-6 mt-3 lg:mt-6">
            <div className="flex items-center gap-2 mb-2">
                {/* icon goes here */}
                <h4 className="font-semibold text-xl text-system-primary-text">User Breakdown</h4>
            </div>
            <div className="grid lg:grid-cols-2 gap-10">
                <div className="">
                    <MiniTab tabs={miniLocationTabs()} />
                </div>
                <div className="">
                    <MiniTab tabs={miniJobTabs()} />
                </div>
            </div>
        </div>
    </>)
}


const TabList = ({ setActiveTab, activeTab, tablist }) => {
    return (
        <div className="flex flex-col gap-3">
            {tablist.map((item, index) => {
                return (
                    <div onClick={() => {
                        setActiveTab(index)
                    }} key={index} className={`rounded-lg border border-2 p-2 px-3 cursor-pointer ${activeTab === index
                        ? "border-system-primary-accent"
                        : "border-transparent"
                        }`}>
                        <div className="flex items-center gap-1 mb-2">
                            <h4 className="text-base text-brand-gray-dim">{item.title}</h4>
                            {/* info icon goes here */}
                        </div>
                        <p className={`font-semibold text-2xl text-system-primary-text`}>
                            {item.value} <sup className="text-xs text-brand-green">{item.update}</sup>
                        </p>
                    </div>
                )
            })}
        </div>
    )
}
const TabContent = ({ children }) => {
    return <div className={``}>{children}</div>
}


export default UserInsightsAnalyticsSection
