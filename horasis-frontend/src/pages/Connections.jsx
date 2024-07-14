import { useContext, useEffect, useState } from 'react'
import MemberSuggestionTab from '../components/Connections/MemberSuggestionTab'
import MembersSection from '../components/Connections/MembersSection'
import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import Button from '../components/ui/Button'
import Tab from '../components/ui/Tab'
import { MAINTAB, _retrieveData, _storeData } from '../utils/LocalStorage'
import { getItem } from '../constants/operations'
import { jsonToQuery } from '../utils/searchParams/extractSearchParams'
import { getNextId } from '../utils/URLParams'
import { AuthContext } from '../utils/AuthProvider'
import Spinner from '../components/ui/Spinner'
import FollowingsTab from '../components/Connections/Tabs/FollowingsTab'
import FollowersTab from '../components/Connections/Tabs/FollowersTab'
import AllMembersTab from '../components/Connections/Tabs/AllMembersTab'
import RecievedConnectionTab from '../components/Connections/Tabs/ReceivedConnectionTab'
import SendConnectionTab from '../components/Connections/Tabs/SendConnectionTab'
import ConnectionsTab from '../components/Connections/Tabs/ConnectionsTab'
import SuggestionsSection from '../components/Connections/SuggestionsSection'
import Input from '../components/ui/Input'

const tabs = () => [
	{
		key: 0,
		title: 'All Members',
		render: () => <AllMembersTab />,
	},
	{
		key: 1,
		title: 'Connections',
		render: () => <ConnectionsTab />,
	},
	{
		key: 2,
		title: 'Recieved',
		render: () => <RecievedConnectionTab />,
	},
	{
		key: 3,
		title: 'Send',
		render: () => <SendConnectionTab />,
	},
	{
		key: 4,
		title: 'Following',
		render: () => <FollowingsTab />,
	},
	{
		key: 5,
		title: 'Followers',
		render: () => <FollowersTab />,
	},
]

const Tabs = () => {
	const [activeTab, setActiveTab] = useState(
		_retrieveData(MAINTAB) && _retrieveData(MAINTAB)['connections'] ? Number(_retrieveData(MAINTAB)['connections']) : 0
	)

	const onTabChange = (item) => {
		setActiveTab(item.key)
		_storeData(MAINTAB, { connections: item.key })
	}
	return <Tab name='connections' activeTab={activeTab} onTabChange={onTabChange} tabs={tabs()} />
}

const SearchComponent = () => {
	const [searchKey, setSearchKey] = useState('')
	return (
		<Input
			className='py-3 rounded-xl border-2 border-system-secondary-accent'
			placeholder='Search Connections'
			width='full'
			value={searchKey}
			onChange={(e) => {
				setSearchKey(e.target.value)
			}}
		/>
	)
}

const Connections = () => {
	return (
		<>
			<div className='p-2 lg:px-10 lg:py-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
					<div className='hidden lg:block'>
						<CurrentProfileTab />
						<h4 className='font-medium text-xl text-system-primary-text mt-3 lg:mt-5'>Today's Event</h4>
						<TodaysEventTab />
						<div className='p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5'>
							<h4 className='font-medium text-md text-system-primary-text mb-4'>Recently Active Members</h4>
							<RecentlyActiveMemebrsTab />
						</div>
					</div>
					<div className='lg:col-span-2'>
						{/* <div className='flex-1 rounded-md p-2 px-4 border border-system-file-border flex items-center justify-between bg-system-secondary-bg'>
							<h4 className='font-medium text-lg text-brand-gray-dim italic '>Search Connections</h4>
						</div> */}
						<SearchComponent />
						<h4 className='font-medium text-2xl text-system-primary-accent mt-4 mb-3 lg:mb-6'>Connections</h4>
						<Tabs />
					</div>
					<div>
						<div className='p-5 bg-system-secondary-bg rounded-lg'>
							<div className='flex items-center justify-between gap-2 mb-5'>
								<h4 className='font-medium text-2xl text-system-primary-text'>Suggestions</h4>
								{/* arrow cursor-pointer */}
							</div>
							<div className='flex flex-col gap-4'>
								<SuggestionsSection />
								{/* <MemberSuggestionTab /> */}
								{/* <div className='border-b border-system-file-border pb-3'>
                  <div className='flex items-start gap-4'>
                    <img
                      className='w-16 h-16 rounded-full'
                      src='https://flowbite.com/docs/images/people/profile-picture-2.jpg'
                      alt='Rounded avatar'
                    />

                    <div className='flex-1'>
                      <h4 className='font-semibold text-system-primary-text'>
                        Tejeswara Rao Pedada
                      </h4>
                      <h4 className='font-medium text-sm text-brand-gray-dim mb-2'>
                        @trpedd, Consultant United States (U.S.A)
                      </h4>
                    </div>
                    <Button variant='outline'>Follow</Button>
                  </div>
                </div> */}
								{/* <MemberSuggestionTab /> */}
								{/* <div className='border-b border-system-file-border pb-3'>
                  <div className='flex items-start gap-4'>
                    <img
                      className='w-16 h-16 rounded-full'
                      src='https://flowbite.com/docs/images/people/profile-picture-2.jpg'
                      alt='Rounded avatar'
                    />

                    <div className='flex-1'>
                      <h4 className='font-semibold text-system-primary-text'>
                        Tejeswara Rao Pedada
                      </h4>
                      <h4 className='font-medium text-sm text-brand-gray-dim mb-2'>
                        @trpedd, Consultant United States (U.S.A)
                      </h4>
                    </div>
                    <Button variant='outline'>Follow</Button>
                  </div>
                </div> */}
								{/* <MemberSuggestionTab /> */}
								{/* <div className=''>
                  <div className='flex items-start gap-4'>
                    <img
                      className='w-16 h-16 rounded-full'
                      src='https://flowbite.com/docs/images/people/profile-picture-3.jpg'
                      alt='Rounded avatar'
                    />

                    <div className='flex-1'>
                      <h4 className='font-semibold text-system-primary-text'>Lee Wen De</h4>
                      <h4 className='font-medium text-sm text-brand-gray-dim mb-2'>
                        @trpedd, Consultant United States (U.S.A)
                      </h4>
                    </div>
                    <Button variant='outline'>Follow</Button>
                  </div>
                </div> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Connections
