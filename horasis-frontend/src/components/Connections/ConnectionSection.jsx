import { useContext, useEffect, useState } from 'react'
import { getItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { _retrieveData, MAINTAB, _storeData } from '../../utils/LocalStorage'
import SearchComponent from '../Search/SearchBox/SearchComponent'
import Tab from '../ui/Tab'
import FollowersTab from './Tabs/FollowersTab'
import FollowingsTab from './Tabs/FollowingsTab'
import SendConnectionTab from './Tabs/SendConnectionTab'
import RecievedConnectionTab from './Tabs/ReceivedConnectionTab'
import ConnectionsTab from './Tabs/ConnectionsTab'
import AllMembersTab from './Tabs/AllMembersTab'
import { getNextId } from '../../utils/URLParams'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'

const ConnectionSection = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [members, setMembers] = useState([])
	const [connections, setConnections] = useState([])
	const [followers, setFollowers] = useState([])
	const [followings, setFollowings] = useState([])
	const [connectionsReceived, setConnectionsRecieved] = useState([])
	const [connectionsSend, setConnectionsSend] = useState([])

	const [connectionCount, setConnectionCount] = useState('')
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
	})
	const [activeTab, setActiveTab] = useState(
		_retrieveData(MAINTAB) && _retrieveData(MAINTAB)['connections'] ? Number(_retrieveData(MAINTAB)['connections']) : 0
	)

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
		_storeData(MAINTAB, { connections: item.key })
	}

	const tabs = () => [
		{
			key: 0,
			title: 'All Members',
			render: () => (
				<AllMembersTab
					getConnectionCount={getConnectionCount}
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
			key: 1,
			title: `${connectionCount} Connections`,
			render: () => (
				<ConnectionsTab
					getConnectionCount={getConnectionCount}
					data={connections}
					getAllData={getConnections}
					isLoading={isLoading}
					setData={setConnections}
					setIsLoading={setIsLoading}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
		{
			key: 2,
			title: 'Recieved',
			render: () => (
				<RecievedConnectionTab
					getConnectionCount={getConnectionCount}
					data={connectionsReceived}
					getAllData={getConnectionRecieved}
					isLoading={isLoading}
					setData={setConnectionsRecieved}
					setIsLoading={setIsLoading}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
		{
			key: 3,
			title: 'Sent',
			render: () => (
				<SendConnectionTab

					data={connectionsSend}
					getAllData={getConnectionsSend}
					isLoading={isLoading}
					setData={setConnectionsSend}
					setIsLoading={setIsLoading}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
		{
			key: 4,
			title: 'Following',
			render: () => (
				<FollowingsTab
					getConnectionCount={getConnectionCount}
					data={followings}
					getAllData={getFollowing}
					isLoading={isLoading}
					setData={setFollowings}
					setIsLoading={setIsLoading}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
		{
			key: 5,
			title: 'Followers',
			render: () => (
				<FollowersTab
					getConnectionCount={getConnectionCount}
					data={followers}
					getAllData={getFollowers}
					isLoading={isLoading}
					setData={setFollowers}
					setIsLoading={setIsLoading}
					fetchMore={fetchMore}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
				/>
			),
		},
	]

	const getConnectionCount = () => {
		getItem(
			`users/${currentUserData.CurrentUser.UserId}/connections/count`,
			(result) => {
				setConnectionCount(result)
			},
			(err) => { },
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getAllMembers = (tempMembers) => {
		getData(`users?&${jsonToQuery(filters)}`, tempMembers, setMembers)
	}
	const getConnections = (tempConnections) => {
		getData(
			`users/${currentUserData.CurrentUser.UserId}/connections?${jsonToQuery(filters)}`,
			tempConnections,
			setConnections
		)
	}
	const getFollowers = (tempFollowers) => {
		getData(
			`users/${currentUserData.CurrentUser.UserId}/followers?${jsonToQuery(filters)}`,
			tempFollowers,
			setFollowers
		)
	}
	const getFollowing = (tempFollowing) => {
		getData(
			`users/${currentUserData.CurrentUser.UserId}/followings?${jsonToQuery(filters)}`,
			tempFollowing,
			setFollowings
		)
	}
	const getConnectionRecieved = (tempConnectionsReceived) => {
		getData(
			`users/${currentUserData.CurrentUser.UserId}/connections/received?${jsonToQuery(filters)}`,
			tempConnectionsReceived,
			setConnectionsRecieved
		)
	}
	const getConnectionsSend = (tempConnectionSend) => {
		getData(
			`users/${currentUserData.CurrentUser.UserId}/connections/sent?${jsonToQuery(filters)}`,
			tempConnectionSend,
			setConnectionsSend
		)
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
				getAllMembers(initialRender ? [] : members)
				break
			case 1:
				// console.log("getConnectionCount")
				getConnectionCount()
				getConnections(initialRender ? [] : connections)
				break
			case 2:
				getConnectionRecieved(initialRender ? [] : connectionsReceived)
				break
			case 3:
				getConnectionsSend(initialRender ? [] : connectionsSend)
				break
			case 4:
				getFollowing(initialRender ? [] : followings)
				break
			case 5:
				getFollowers(initialRender ? [] : followers)
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
				if (members.length > 0) hasAnyLeft(`users`, members)
				break
			case 1:
				if (connections.length > 0) hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/connections`, connections)
				break
			case 2:
				if (connectionsReceived.length > 0)
					hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/connections/received`, connectionsReceived)
				break
			case 3:
				if (connectionsSend.length > 0)
					hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/connections/sent`, connectionsSend)
				break
			case 4:
				if (followings.length > 0) hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/followings`, followings)
				break
			case 5:
				if (followers.length > 0) hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/followers`, followers)
				break
			default:
				break
		}
	}, [members, connections, followers, followings, connectionsReceived, connectionsSend])

	useEffect(() => {
		fetch()
	}, [filters, activeTab])

	useEffect(() => {
		getConnectionCount()
	}, [])
	return (
		<>
			<SearchComponent
				searchKey={filters.Keyword}
				setSearchKey={(value) => setFilters({ ...filters, Keyword: value })}
			/>
			<h4 className='font-medium text-2xl text-system-primary-accent mt-4 mb-3 lg:mb-6'>Connections</h4>
			<Tab name='universalsearch' activeTab={activeTab} onTabChange={onTabChange} tabs={tabs()} />
		</>
	)
}

export default ConnectionSection
