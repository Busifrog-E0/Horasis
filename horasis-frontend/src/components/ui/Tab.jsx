import { useState } from 'react'

const Tab = ({ tabs, gap = 'lg:gap-4', activeTab, onTabChange = () => {}, name, alignment = 'justify-start' }) => {
	const TabList = () => {
		return (
			<div className={`flex ${alignment} ${gap} overflow-x-scroll md:overflow-x-auto w-screen md:w-full`}>
				{tabs.map((item, index) => {
					return (
						<p
							key={index}
							className={`py-4 px-4 font-medium cursor-pointer text-xs lg:text-lg min-w-max
              ${
								activeTab === index
									? 'rounded-t-lg text-system-primary-accent bg-system-secondary-bg '
									: 'text-brand-gray-dim'
							}`}
							onClick={() => {
								onTabChange(item)
							}}>
							{item.title}
						</p>
					)
				})}
			</div>
		)
	}

	const TabContent = ({ children }) => {
		// px-4  my-4

		return <div className={`max-w-screen pr-6 md:pr-0`}>{children}</div>
	}

	return (
		<div className=''>
			<div className='block'>
				<TabList activeTab={activeTab} tablist={tabs} />
			</div>

			<TabContent>{tabs[activeTab].render()}</TabContent>
		</div>
	)
}

Tab.displayName = 'Tab'

export default Tab
