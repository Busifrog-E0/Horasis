import { useState } from 'react'

const SidebarTab = ({ tabs, title = 'User Analytics' }) => {
	const [activeTab, setActiveTab] = useState(0)

	return (
		<div className='grid lg:grid-cols-3 gap-4 lg:gap-16'>
			<div>
				{title && <h4 className='font-medium text-base text-brand-gray-dim mt-3 lg:mt-5 mb-3 lg:mb-5 mx-2'>{title}</h4>}
				<TabList setActiveTab={setActiveTab} activeTab={activeTab} tablist={tabs} />
			</div>
			<div className='lg:col-span-2'>
				<TabContent>{tabs[activeTab].render()}</TabContent>
			</div>
		</div>
	)
}

const TabList = ({ setActiveTab, activeTab, tablist }) => {
	return (
		<div className='flex flex-col gap-1 lg:gap-2'>
			{tablist.map((item, index) => {
				return (
					<div
						onClick={() => {
							setActiveTab(index)
						}}
						className={`p-4 py-3 cursor-pointer font-medium flex flex-row gap-3 items-center ${
							activeTab === index
								? 'rounded-lg text-brand-secondary bg-system-primary-accent'
								: 'text-system-primary-text'
						}`}
						key={index}>
						{activeTab === index ? item.whiteIcon : item.blackIcon}
						<p className='text-lg'>{item.title}</p>
					</div>
				)
			})}
		</div>
	)
}
const TabContent = ({ children }) => {
	// px-4  my-4

	return <div className={``}>{children}</div>
}

SidebarTab.displayName = 'SidebarTab'

export default SidebarTab
