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
	const [isLoadingMembers, setIsLoadingMembers] = useState(true)
	const [isLoadingMoreMembers, setIsLoadingMoreMembers] = useState(false)
	const [isLoadingPosts, setIsLoadingPosts] = useState(true)
	const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false)
	const [isLoadingEvents, setIsLoadingEvents] = useState(true)
	const [isLoadingMoreEvents, setIsLoadingMoreEvents] = useState(false)
	const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(true)
	const [isLoadingMoreDiscussions, setIsLoadingMoreDiscussions] = useState(false)
	const [isLoadingArticles, setIsLoadingArticles] = useState(true)
	const [isLoadingMoreArticles, setIsLoadingMoreArticles] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [members, setMembers] = useState([])
	const [posts, setPosts] = useState([])
	const [discussions, setDiscussions] = useState([])
	const [events, setEvents] = useState([])
	const [insights, setInsights] = useState([])

	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 3,
		Keyword: '',
	})

	const [activeTab, setActiveTab] = useState(0)
	const [eventTab, setEventTab] = useState('all')
	const [discussionTab, setDiscussionTab] = useState('all')

	const setLoadingCom = (tempArr, value, setLoading, setLoadingMore) => {
		if (tempArr.length > 0) {
			setLoadingMore(value)
		} else {
			setLoading(value)
		}
	}

	const onTabChange = (item) => {
		setPageDisabled(true)
		setActiveTab(item.key)
	}

	const tabs = () => [
		{
			key: 0,
			title: 'All',
			render: () => (
				<div className='bg-system-secondary-bg px-2'>
					<AllMembersSearchTab
						getConnectionCount={() => {}}
						data={members}
						getAllData={getAllMembers}
						isLoading={isLoadingMembers}
						setData={setMembers}
						setIsLoading={setIsLoadingMembers}
						fetchMore={fetchMore}
						isLoadingMore={isLoadingMoreMembers}
						pageDisabled={true}
					/>
					<div className='border-b border-system-file-border m-4'></div>
					<PostsSearchTab
						data={posts}
						getAllData={getPosts}
						isLoading={isLoadingPosts}
						setData={setPosts}
						setIsLoading={setIsLoadingPosts}
						fetchMore={fetchMore}
						isLoadingMore={isLoadingMorePosts}
						pageDisabled={true}
					/>
					<div className='border-b border-system-file-border m-4'></div>
					<EventsSearchTab
						data={events}
						getAllData={getEvents}
						isLoading={isLoadingEvents}
						setData={setEvents}
						setIsLoading={setIsLoadingEvents}
						fetchMore={fetchMore}
						isLoadingMore={isLoadingMoreEvents}
						pageDisabled={true}
						eventTab={eventTab}
						setEventTab={setEventTab}
					/>
					<div className='border-b border-system-file-border m-4'></div>

					<DiscussionsSearchTab
						data={discussions}
						getAllData={getDiscussions}
						isLoading={isLoadingDiscussions}
						setData={setEvents}
						setIsLoading={setIsLoadingDiscussions}
						fetchMore={fetchMore}
						isLoadingMore={isLoadingMoreDiscussions}
						pageDisabled={true}
						discussionTab={discussionTab}
						setDiscussionTab={setDiscussionTab}
					/>
					<div className='border-b border-system-file-border m-4'></div>
					<InsightsSearchTab
						data={insights}
						getAllData={getInsights}
						isLoading={isLoadingArticles}
						setData={setInsights}
						setIsLoading={setIsLoadingArticles}
						fetchMore={fetchMore}
						isLoadingMore={isLoadingMoreArticles}
						pageDisabled={true}
					/>
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
					isLoading={isLoadingMembers}
					setData={setMembers}
					setIsLoading={setIsLoadingMembers}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMoreMembers}
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
					isLoading={isLoadingPosts}
					setData={setPosts}
					setIsLoading={setIsLoadingPosts}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMorePosts}
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
					isLoading={isLoadingPosts}
					setData={setEvents}
					setIsLoading={setIsLoadingPosts}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMorePosts}
					pageDisabled={pageDisabled}
					eventTab={eventTab}
					setEventTab={setEventTab}
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
					isLoading={isLoadingDiscussions}
					setData={setEvents}
					setIsLoading={setIsLoadingDiscussions}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMoreDiscussions}
					pageDisabled={pageDisabled}
					discussionTab={discussionTab}
					setDiscussionTab={setDiscussionTab}
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
					isLoading={isLoadingArticles}
					setData={setInsights}
					setIsLoading={setIsLoadingArticles}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMoreArticles}
					pageDisabled={pageDisabled}
				/>
			),
		},
	]

	const onKeyChanged = (value) => {
		setFilters({ ...filters, Keyword: value })
	}

	const getAllMembers = (tempMembers, limit) => {
		getData(
			`users?&${jsonToQuery({ ...filters, Limit: limit })}`,
			tempMembers,
			setMembers,
			setIsLoadingMembers,
			setIsLoadingMoreMembers
		)
	}
	const getPosts = (tempPosts, limit) => {
		getData(
			`${'activities'}?${jsonToQuery({ ...filters, Limit: limit })}`,
			tempPosts,
			setPosts,
			setIsLoadingPosts,
			setIsLoadingMorePosts
		)
	}
	const getDiscussions = (tempDiscussions, limit) => {
		const allApi = 'discussions'
		const followingApi = `user/${currentUserData.CurrentUser.UserId}/discussions`
		const api = discussionTab === 'all' ? allApi : followingApi
		getData(
			`${api}?${jsonToQuery({ ...filters, Limit: limit })}`,
			tempDiscussions,
			setDiscussions,
			setIsLoadingDiscussions,
			setIsLoadingMoreDiscussions
		)
	}
	const getEvents = (tempEvents, limit, orderby = 'Index') => {
		getData(
			`events?${jsonToQuery({ ...filters, Limit: limit, OrderBy: orderby })}`,
			tempEvents,
			setEvents,
			setIsLoadingEvents,
			setIsLoadingMoreEvents
		)
	}
	const getInsights = (tempInsights, limit) => {
		getData(
			`articles?${jsonToQuery({ ...filters, Limit: limit })}`,
			tempInsights,
			setInsights,
			setIsLoadingArticles,
			setIsLoadingMoreArticles
		)
	}

	const getData = (endpoint, tempData, setData, setIsLoading, setIsLoadingMore) => {
		setLoadingCom(tempData, true, setIsLoading, setIsLoadingMore)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				setData([...tempData, ...data])
				setLoadingCom(tempData, false, setIsLoading, setIsLoadingMore)
			},
			(err) => {
				setLoadingCom(tempData, false, setIsLoading, setIsLoadingMore)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const hasAnyLeft = (endpoint, tempData, extraFilter) => {
		getItem(
			`${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, ...extraFilter, Limit: 1 })}`,
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
				getAllMembers(initialRender ? [] : members, 10)
				getPosts(initialRender ? [] : posts, 10)
				getEvents(initialRender ? [] : events, 10)
				getDiscussions(initialRender ? [] : discussions, 10)
				getInsights(initialRender ? [] : insights, 10)
				break
			case 1:
				getAllMembers(initialRender ? [] : members, 10)
				break
			case 2:
				getPosts(initialRender ? [] : posts, 10)
				break
			case 3:
				getEvents(initialRender ? [] : events, 10)
				break
			case 4:
				getDiscussions(initialRender ? [] : discussions, 10)
				break
			case 5:
				getInsights(initialRender ? [] : insights, 10)
				break
			default:
				break
		}
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		const limit = activeTab === 0 ? 2 : 10
		const sortBy = eventTab === 'all' ? 'Index' : 'NoOfMembers'

		getEvents([], limit, sortBy)
	}, [eventTab])

	useEffect(() => {
		const limit = activeTab === 0 ? 2 : 10
		getDiscussions([], limit)
	}, [discussionTab])

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
				if (events.length > 0) hasAnyLeft(`events`, events, { OrderBy: eventTab === 'all' ? 'Index' : 'NoOfMembers' })
				break
			case 4:
				if (discussions.length > 0) {
					const allApi = 'discussions'
					const followingApi = `user/${currentUserData.CurrentUser.UserId}/discussions`
					const api = discussionTab === 'all' ? allApi : followingApi
					hasAnyLeft(`${api}`, discussions)
				}
				break
			case 5:
				if (insights.length > 0) hasAnyLeft(`articles`, insights)
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
			<div className='mb-4 lg:mb-5 w-11/12 md:w-full lg:w-3/4'>
				<SearchBar value={filters.Keyword} onChange={onKeyChanged} onClickSearch={fetch} />
			</div>

			<Tab name='connections' activeTab={activeTab} onTabChange={onTabChange} tabs={tabs()} />
		</>
	)
}

export default UniversalSearchSection
