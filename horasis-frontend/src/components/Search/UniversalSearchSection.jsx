import { useContext, useEffect, useState } from 'react'
import { getItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { _retrieveData, MAINTAB, _storeData } from '../../utils/LocalStorage'
import Tab from '../ui/Tab'
import SearchBar from '../SearchBar'
import PostSectionTab from '../Posts/PostSectionTab'
import TabItem from '../ui/TabItem'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import AllMembersSearchTab from './Tabs/AllMembersSearchTab'
import EventsList from '../Events/EventsList'
import EventsSearchTab from './Tabs/EventsSearchTab'
import PostsSearchTab from './Tabs/PostsSearchTab'
import DiscussionsSearchTab from './Tabs/DiscussionsSearchTab'
import InsightsSearchTab from './Tabs/InsightsSearchTab'
import PostsSearchSection from './Sections/Posts/PostsSearchSection'

const UniversalSearchSection = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [members, setMembers] = useState([])
	const [posts, setPosts] = useState([])
	const [discussions, setDiscussions] = useState([])
	const [events, setEvents] = useState([])
	const [insights, setInsights] = useState([])

	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
	})
	// const [activeTab, setActiveTab] = useState(
	//     _retrieveData(MAINTAB) && _retrieveData(MAINTAB)['universalsearch'] ? Number(_retrieveData(MAINTAB)['universalsearch']) : 0
	// )
	const [activeTab, setActiveTab] = useState(0)

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const onTabChange = (item) => {
		setPageDisabled(true)
		setActiveTab(item.key)
		// _storeData(MAINTAB, { universalsearch: item.key })
	}

	const tabs = () => [
		{
			key: 0,
			title: 'All',
			render: () => (
				<div>
					<div className='bg-system-secondary-bg p-3 lg:p-6 rounded-b-lg '>
						<h4 className='font-semibold text-lg text-brand-gray mb-4'>Posts</h4>
						<PostsSearchSection
							posts={posts}
							emptyText={'No posts '}
							updateList={setPosts}
							whichTime='member'
							tabName='posts'
						/>
						<div className='border-b border-system-file-border '></div>
						<h4 className='font-semibold text-lg text-brand-gray mt-4 mb-2'>Events</h4>
						<div className='flex gap-6 flex-wrap my-2'>
							<TabItem variant='active'>All Events</TabItem>
							<TabItem variant='inactive'>My Upcoming Events</TabItem>
						</div>
						<div className='lg:pr-32'>
							<EventsList cols={4} gap='gap-3 lg:gap-10' data={[]} emptyText={'No events'} />
						</div>
					</div>
				</div>
			),
		},
		{
			key: 1,
			title: 'Members',
			render: () => (
				<AllMembersSearchTab
					getConnectionCount={() => {}}
					data={members}
					getAllData={getAllMembers}
					isLoading={isLoading}
					setData={setMembers}
					setIsLoading={setIsLoading}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
		{
			key: 2,
			title: 'Posts',
			render: () => (
				<PostsSearchTab
					data={posts}
					getAllData={getPosts}
					isLoading={isLoading}
					setData={setPosts}
					setIsLoading={setIsLoading}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
		{
			key: 3,
			title: 'Events',
			render: () => (
				<EventsSearchTab
					data={events}
					getAllData={getEvents}
					isLoading={isLoading}
					setData={setEvents}
					setIsLoading={setIsLoading}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
		{
			key: 4,
			title: 'Discussions',
			render: () => (
				<DiscussionsSearchTab
					data={discussions}
					getAllData={getDiscussions}
					isLoading={isLoading}
					setData={setEvents}
					setIsLoading={getDiscussions}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
		{
			key: 5,
			title: 'Insights',
			render: () => (
				<InsightsSearchTab
					data={insights}
					getAllData={getInsights}
					isLoading={isLoading}
					setData={setInsights}
					setIsLoading={getDiscussions}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
	]

	const onKeyChanged = (value) => {
		setFilters({ ...filters, Keyword: value })
	}

	const getAllMembers = (tempMembers) => {
		getData(`users?&${jsonToQuery(filters)}`, tempMembers, setMembers)
	}
	const getPosts = (tempPosts) => {
		getData(`${'activities'}?${jsonToQuery(filters)}`, tempPosts, setPosts)
	}
	const getDiscussions = (tempDiscussions) => {
		getData(`discussions?${jsonToQuery(filters)}`, tempDiscussions, setDiscussions)
	}
	const getEvents = (tempEvents) => {
		getData(`events?${jsonToQuery(filters)}`, tempEvents, setEvents)
	}
	const getInsights = (tempInsights) => {
		getData(`insights?${jsonToQuery(filters)}`, tempInsights, setInsights)
	}

	const getData = (endpoint, tempData, setData) => {
		setLoadingCom(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				setData([...tempData, ...data])
				setLoadingCom(tempData, false)
			},
			(err) => {
				setLoadingCom(tempData, false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const hasAnyLeft = (endpoint, tempData) => {
		getItem(
			`${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1 })}`,
			(data) => {
				if (data?.length > 0) {
					setPageDisabled(false)
				} else {
					setPageDisabled(true)
				}
			},
			(err) => {
				setPageDisabled(true)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const fetchData = (initialRender = false) => {
		switch (activeTab) {
			case 0:
				break
			case 1:
				getAllMembers(initialRender ? [] : members)
				break
			case 2:
				getPosts(initialRender ? [] : posts)
				break
			case 3:
				getEvents(initialRender ? [] : events)
				break
			case 4:
				getDiscussions(initialRender ? [] : discussions)
				break
			case 5:
				getInsights(initialRender ? [] : insights)
				break
			default:
				break
		}
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		switch (activeTab) {
			case 0:
				break
			case 1:
				if (members.length > 0) hasAnyLeft(`users`, members)
				break
			case 2:
				if (posts.length > 0) hasAnyLeft(`${'activities'}`, posts)
				break
			case 3:
				if (events.length > 0) hasAnyLeft(`events`, events)
				break
			case 4:
				if (discussions.length > 0) hasAnyLeft(`discussions`, discussions)
				break
			case 5:
				if (insights.length > 0) hasAnyLeft(`insights`, insights)
				break
			default:
				break
		}
	}, [members, posts, events, discussions, insights])

	useEffect(() => {
		fetch()
	}, [activeTab])

	return (
		<>
			<div className='mb-3 lg:mb-5 lg:pr-64'>
				<SearchBar value={filters.Keyword} onChange={onKeyChanged} onClickSearch={fetch} />
			</div>
			<Tab name='connections' activeTab={activeTab} onTabChange={onTabChange} tabs={tabs()} />
		</>
	)
}

export default UniversalSearchSection
