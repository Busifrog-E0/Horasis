import { useState } from "react"

const MiniTab = ({ gap = "gap-3", tabs, alignment = "justify-start", fontSize = "text-base" }) => {
  const [activeTab, setActiveTab] = useState(0)


  const TabList = () => {
    return (
      <div className={`flex items-center ${alignment} ${gap}`}>
        {tabs.map((item, index) => {
          return (
            <p
              key={index}
              className={`font-semibold ${fontSize} cursor-pointer border-b-2 pb-0.5
            ${activeTab === index
                  ? "rounded-t-lg text-system-primary-accent bg-system-secondary-bg border-system-primary-accent"
                  : "text-brand-gray-dim border-transparent"
                }`}
              onClick={() => {
                setActiveTab(index)
              }}
            >
              {item.title}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div className="">
      <TabList />
      <TabContent>{tabs[activeTab].render()}</TabContent>
    </div>
  )
}

const TabContent = ({ children }) => {
  // px-4  my-4

  return <div className={``}>{children}</div>
}

MiniTab.displayName = "MiniTab"

export default MiniTab
