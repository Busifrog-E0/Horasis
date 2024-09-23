import { useContext, useEffect, useState } from 'react'
import { getItem } from '../../constants/operations'
import { AuthContext, useAuth } from '../../utils/AuthProvider'
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
import useGetList from '../../hooks/useGetList'

const UniversalSearchSection = () => {
	const { currentUserData } = useAuth()

	const [activeTab, setActiveTab] = useState(0)
	const [eventTab, setEventTab] = useState('all')
	const [discussionTab, setDiscussionTab] = useState('all')

	const apiEndpointForDiscussions =
		discussionTab === 'all' ? 'discussions' : `user/${currentUserData.CurrentUser.UserId}/discussions`

	const [filters, setFilters] = useState({
		Keyword: '',
	})

	const {
		isLoading: isLoadingMembers,
		isLoadingMore: isLoadingMoreMembers,
		isPageDisabled: isPageDisabledMembers,
		data: members,
		setData: setMembers,
		getList: getAllMembers,
	} = useGetList('users', { ...filters }, true, false)
	const {
		isLoading: isLoadingPosts,
		isLoadingMore: isLoadingMorePosts,
		isPageDisabled: isPageDisabledPosts,
		data: posts,
		setData: setPosts,
		getList: getAllPosts,
	} = useGetList('activities/search', { ...filters }, true, false)
	const {
		isLoading: isLoadingEvents,
		isLoadingMore: isLoadingMoreEvents,
		isPageDisabled: isPageDisabledEvents,
		data: events,
		setData: setEvents,
		getList: getAllEvents,
	} = useGetList('events', { OrderBy: eventTab === 'all' ? 'Index' : 'NoOfMembers', ...filters }, true, false)
	const {
		isLoading: isLoadingDiscussions,
		isLoadingMore: isLoadingMoreDiscussions,
		isPageDisabled: isPageDisabledDiscussions,
		data: discussions,
		setData: setDiscussions,
		getList: getAllDiscussions,
	} = useGetList(apiEndpointForDiscussions, { ...filters }, true, false)
	const {
		isLoading: isLoadingArticles,
		isLoadingMore: isLoadingMoreArticles,
		isPageDisabled: isPageDisabledArticles,
		data: articles,
		setData: setArticles,
		getList: getAllArticles,
	} = useGetList('articles', { ...filters }, true, false)

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const onKeyChanged = (value) => {
		setFilters({ ...filters, Keyword: value })
	}

	const fetchData = () => {
		switch (activeTab) {
			case 0:
				getAllMembers([])
				getAllPosts([])
				getAllEvents([])
				getAllDiscussions([])
				getAllArticles([])
				break
			case 1:
				getAllMembers([])
				break
			case 2:
				getAllPosts([])
				break
			case 3:
				getAllEvents([])
				break
			case 4:
				getAllDiscussions([])
				break
			case 5:
				getAllArticles([])
				break
			default:
				break
		}
	}

	useEffect(() => {
		getAllEvents([])
	}, [eventTab])

	useEffect(() => {
		getAllDiscussions([])
	}, [discussionTab])

	useEffect(() => {
		fetchData()
	}, [activeTab])

	const tabs = () => [
		{
			key: 0,
			title: 'All',
			render: () => (
				<div className='bg-system-secondary-bg'>
					<AllMembersSearchTab
						getConnectionCount={() => {}}
						data={members}
						getAllData={() => getAllMembers([])}
						isLoading={isLoadingMembers}
						setData={setMembers}
						fetchMore={() => getAllMembers(members, false)}
						isLoadingMore={isLoadingMoreMembers}
						pageDisabled={true}
					/>
					<div className='border-b border-system-file-border m-4'></div>
					<PostsSearchTab
						data={posts}
						getAllData={() => getAllPosts([])}
						isLoading={isLoadingPosts}
						setData={setPosts}
						fetchMore={() => getAllPosts(posts, false)}
						isLoadingMore={isLoadingMorePosts}
						pageDisabled={true}
					/>
					<div className='border-b border-system-file-border m-4'></div>
					<EventsSearchTab
						data={events}
						getAllData={() => getAllEvents([])}
						isLoading={isLoadingEvents}
						setData={setEvents}
						fetchMore={() => getAllEvents(events, false)}
						isLoadingMore={isLoadingMoreEvents}
						pageDisabled={true}
						eventTab={eventTab}
						setEventTab={setEventTab}
					/>
					<div className='border-b border-system-file-border m-4'></div>

					<DiscussionsSearchTab
						data={discussions}
						getAllData={() => getAllDiscussions([])}
						isLoading={isLoadingDiscussions}
						setData={setDiscussions}
						fetchMore={() => getAllDiscussions(discussions, false)}
						isLoadingMore={isLoadingMoreDiscussions}
						pageDisabled={true}
						discussionTab={discussionTab}
						setDiscussionTab={setDiscussionTab}
					/>
					<div className='border-b border-system-file-border m-4'></div>
					<InsightsSearchTab
						data={articles}
						getAllData={() => getAllArticles([])}
						isLoading={isLoadingArticles}
						setData={setArticles}
						fetchMore={() => getAllArticles(articles, false)}
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
					getAllData={() => getAllMembers([])}
					isLoading={isLoadingMembers}
					setData={setMembers}
					fetchMore={() => getAllMembers(members, false)}
					isLoadingMore={isLoadingMoreMembers}
					pageDisabled={isPageDisabledMembers}
				/>
			),
		},
		{
			key: 2,
			title: 'Posts',
			render: () => (
				<PostsSearchTab
					data={posts}
					getAllData={() => getAllPosts([])}
					isLoading={isLoadingPosts}
					setData={setPosts}
					fetchMore={() => getAllPosts(posts, false)}
					isLoadingMore={isLoadingMorePosts}
					pageDisabled={isPageDisabledPosts}
				/>
			),
		},
		{
			key: 3,
			title: 'Events',
			render: () => (
				<EventsSearchTab
					data={events}
					getAllData={() => getAllEvents([])}
					isLoading={isLoadingEvents}
					setData={setEvents}
					fetchMore={() => getAllEvents(events, [])}
					isLoadingMore={isLoadingMoreEvents}
					pageDisabled={isPageDisabledEvents}
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
					getAllData={() => getAllDiscussions([])}
					isLoading={isLoadingDiscussions}
					setData={setDiscussions}
					fetchMore={() => getAllDiscussions(discussions, false)}
					isLoadingMore={isLoadingMoreDiscussions}
					pageDisabled={isPageDisabledDiscussions}
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
					data={articles}
					getAllData={() => getAllArticles([])}
					isLoading={isLoadingArticles}
					setData={setArticles}
					fetchMore={() => getAllArticles(articles, false)}
					isLoadingMore={isLoadingMoreArticles}
					pageDisabled={isPageDisabledArticles}
				/>
			),
		},
	]

	return (
		<>
			<div className='mb-4 lg:mb-5 w-11/12 md:w-full lg:w-3/4'>
				<SearchBar value={filters.Keyword} onChange={onKeyChanged} onClickSearch={fetchData} />
			</div>

			<Tab name='connections' activeTab={activeTab} onTabChange={onTabChange} tabs={tabs()} />
		</>
	)
}

export default UniversalSearchSection
