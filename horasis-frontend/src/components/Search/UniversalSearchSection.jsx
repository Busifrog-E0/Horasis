import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useGetList from '../../hooks/useGetList'
import { useAuth } from '../../utils/AuthProvider'
import SearchBar from '../SearchBar'
import Tab from '../ui/Tab'
import AllMembersSearchTab from './Tabs/AllMembersSearchTab'
import DiscussionsSearchTab from './Tabs/DiscussionsSearchTab'
import EventsSearchTab from './Tabs/EventsSearchTab'
import InsightsSearchTab from './Tabs/InsightsSearchTab'
import PostsSearchTab from './Tabs/PostsSearchTab'

const UniversalSearchSection = () => {
	const { currentUserData } = useAuth()
	const location = useLocation()

	const [filters, setFilters] = useState({
		Keyword: location?.state?.TagName || '',
	})
	const [activeTab, setActiveTab] = useState(0)
	const [eventTab, setEventTab] = useState('all')
	const [discussionTab, setDiscussionTab] = useState('all')

	const endpoints = useMemo(
		() => ({
			members: 'users',
			posts: 'activities/search',
			events: 'events',
			discussions: discussionTab === 'all' ? 'discussions' : `user/${currentUserData.CurrentUser.UserId}/discussions`,
			insights: 'articles',
		}),
		[currentUserData, discussionTab]
	)

	const tabDataFetchers = {
		members: useGetList(endpoints.members, { ...filters }, true, false),
		posts: useGetList(endpoints.posts, { ...filters }, true, false),
		events: useGetList(
			endpoints.events,
			{ OrderBy: eventTab === 'all' ? 'Index' : 'NoOfMembers', ...filters },
			true,
			false
		),
		discussions: useGetList(endpoints.discussions, { ...filters }, true, false),
		insights: useGetList(endpoints.insights, { ...filters }, true, false),
	}

	const fetchData = () => {
		const allFetchers = Object.values(tabDataFetchers)
		if (activeTab === 0) {
			console.log(allFetchers)
			allFetchers.forEach(({ getList }) => getList([]))
		} else {
			const activeFetcherKey = Object.keys(tabDataFetchers)[activeTab - 1]
			tabDataFetchers[activeFetcherKey].getList([])
		}
	}

	useEffect(() => {
		tabDataFetchers.events.getList([])
	}, [eventTab])

	useEffect(() => {
		tabDataFetchers.discussions.getList([])
	}, [discussionTab])

	useEffect(() => {
		fetchData()
	}, [activeTab])

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const handleSearchChange = (value) => setFilters({ ...filters, Keyword: value })

	const renderTabContent = (key) => {
		const components = {
			members: AllMembersSearchTab,
			posts: PostsSearchTab,
			events: EventsSearchTab,
			discussions: DiscussionsSearchTab,
			insights: InsightsSearchTab,
		}
		if (key === 0) {
			return Object.keys(components).map((item, index) => {
				const tabKey = Object.keys(components)[index]
				const TabComponent = components[tabKey]
				if (TabComponent) {
					const { data, isLoading, isLoadingMore, setData, getList } = tabDataFetchers[tabKey]
					return (
						<TabComponent
							data={data}
							getAllData={() => getList([])}
							isLoading={isLoading}
							setData={setData}
							fetchMore={() => getList(data, false)}
							isLoadingMore={isLoadingMore}
							pageDisabled={true}
							eventTab={key === 3 ? eventTab : undefined}
							setEventTab={key === 3 ? setEventTab : undefined}
							discussionTab={key === 4 ? discussionTab : undefined}
							setDiscussionTab={key === 4 ? setDiscussionTab : undefined}
						/>
					)
				}
				return null
			})
		} else {
			const tabKey = Object.keys(components)[key - 1]
			const TabComponent = components[tabKey]
			if (TabComponent) {
				const { data, isLoading, isLoadingMore, setData, getList, isPageDisabled } = tabDataFetchers[tabKey]
				return (
					<TabComponent
						data={data}
						getAllData={() => getList([])}
						isLoading={isLoading}
						setData={setData}
						fetchMore={() => getList(data, false)}
						isLoadingMore={isLoadingMore}
						pageDisabled={isPageDisabled}
						eventTab={key === 3 ? eventTab : undefined}
						setEventTab={key === 3 ? setEventTab : undefined}
						discussionTab={key === 4 ? discussionTab : undefined}
						setDiscussionTab={key === 4 ? setDiscussionTab : undefined}
					/>
				)
			}
			return null
		}
	}

	const tabs = [
		{ key: 0, title: 'All', render: () => renderTabContent(0) },
		{ key: 1, title: 'Members', render: () => renderTabContent(1) },
		{ key: 2, title: 'Posts', render: () => renderTabContent(2) },
		{ key: 3, title: 'Events', render: () => renderTabContent(3) },
		{ key: 4, title: 'Discussions', render: () => renderTabContent(4) },
		{ key: 5, title: 'Insights', render: () => renderTabContent(5) },
	]

	return (
		<>
			<div className='mb-4 lg:mb-5 w-11/12 md:w-full lg:w-3/4'>
				<SearchBar value={filters.Keyword} onChange={handleSearchChange} onClickSearch={fetchData} />
			</div>

			<Tab name='connections' activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
		</>
	)
}

export default UniversalSearchSection
