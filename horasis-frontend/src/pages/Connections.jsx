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
import { useToast } from '../components/Toast/ToastService'

const SearchComponent = ({ searchKey, setSearchKey }) => {
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
  const { updateCurrentUser, currentUserData } = useContext(AuthContext)
  const toast = useToast()
  const [searchKey, setSearchKey] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [pageDisabled, setPageDisabled] = useState(true)
  const [members, setMembers] = useState([])
  const [connections, setConnections] = useState([])
  const [followers, setFollowers] = useState([])
  const [followings, setFollowings] = useState([])
  const [connectionsReceived, setConnectionsRecieved] = useState([])
  const [connectionsSend, setConnectionsSend] = useState([])
  const [filters, setFilters] = useState({
    OrderBy: 'Index',
    Keyword: '',
    Limit: 2,
    Keyword: '',
  })
  const [activeTab, setActiveTab] = useState(
    _retrieveData(MAINTAB) && _retrieveData(MAINTAB)['connections'] ? Number(_retrieveData(MAINTAB)['connections']) : 0
  )

  const setLoadingCom = (tempArr, value) => {
    if (tempArr.length > 0) {
      setIsLoadingMore(value)
    }
    else {
      setIsLoading(value)
    }
  }


  const onTabChange = (item) => {
    setActiveTab(item.key)
    _storeData(MAINTAB, { connections: item.key })
  }

  const tabs = () => [
    {
      key: 0,
      title: 'All Members',
      render: () => <AllMembersTab data={members} getAllData={getAllMembers} isLoading={isLoading} setData={setMembers} setIsLoading={setIsLoading}
        fetchMore={fetchMore} isLoadingMore={isLoadingMore} pageDisabled={pageDisabled}
      />,
    },
    {
      key: 1,
      title: 'Connections',
      render: () => <ConnectionsTab data={connections} getAllData={getConnections} isLoading={isLoading} setData={setConnections} setIsLoading={setIsLoading}
        fetchMore={fetchMore} isLoadingMore={isLoadingMore} pageDisabled={pageDisabled} />,
    },
    {
      key: 2,
      title: 'Recieved',
      render: () => <RecievedConnectionTab data={connectionsReceived} getAllData={getConnectionRecieved} isLoading={isLoading} setData={setConnectionsRecieved} setIsLoading={setIsLoading}
        fetchMore={fetchMore} isLoadingMore={isLoadingMore} pageDisabled={pageDisabled} />,
    },
    {
      key: 3,
      title: 'Send',
      render: () => <SendConnectionTab data={connectionsSend} getAllData={getConnectionsSend} isLoading={isLoading} setData={setConnectionsSend} setIsLoading={setIsLoading}
        fetchMore={fetchMore} isLoadingMore={isLoadingMore} pageDisabled={pageDisabled} />,
    },
    {
      key: 4,
      title: 'Following',
      render: () => <FollowingsTab data={followings} getAllData={getFollowing} isLoading={isLoading} setData={setFollowings} setIsLoading={setIsLoading}
        fetchMore={fetchMore} isLoadingMore={isLoadingMore} pageDisabled={pageDisabled} />,
    },
    {
      key: 5,
      title: 'Followers',
      render: () => <FollowersTab data={followers} getAllData={getFollowers} isLoading={isLoading} setData={setFollowers} setIsLoading={setIsLoading}
        fetchMore={fetchMore} isLoadingMore={isLoadingMore} pageDisabled={pageDisabled} />,
    },
  ]


  const getAllMembers = (tempMembers) => {
    getData(`users?&${jsonToQuery(filters)}`, tempMembers, setMembers);
  }
  const getConnections = (tempConnections) => {
    getData(`users/${currentUserData.CurrentUser.UserId}/connections?${jsonToQuery(filters)}`, tempConnections, setConnections);
  }
  const getFollowers = (tempFollowers) => {
    getData(`users/${currentUserData.CurrentUser.UserId}/followers?${jsonToQuery(filters)}`, tempFollowers, setFollowers);
  }
  const getFollowing = (tempFollowing) => {
    getData(`users/${currentUserData.CurrentUser.UserId}/followings?${jsonToQuery(filters)}`, tempFollowing, setFollowings);
  }
  const getConnectionRecieved = (tempConnectionsReceived) => {
    getData(`users/${currentUserData.CurrentUser.UserId}/connections/received?${jsonToQuery(filters)}`, tempConnectionsReceived, setConnectionsRecieved);
  }
  const getConnectionsSend = (tempConnectionSend) => {
    getData(`users/${currentUserData.CurrentUser.UserId}/connections/sent?${jsonToQuery(filters)}`, tempConnectionSend, setConnectionsSend);
  }

  const getData = (endpoint, tempData, setData) => {
    setLoadingCom(tempData, true)
    getItem(
      `${endpoint}&NextId=${getNextId(tempData)}`,
      (data) => {
        setData([...tempData, ...data]);
        setLoadingCom(tempData, false)
      },
      (err) => {
        setLoadingCom(tempData, false)
        // console.log(err)
      },
      updateCurrentUser,
      currentUserData,
      toast
    );
  }

  const hasAnyLeft = (endpoint, tempData) => {
    getItem(
      `${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1 })}`,
      (data) => {
        if (data?.length > 0) {
          setPageDisabled(false)
        }
        else {
          setPageDisabled(true)
        }
      },
      (err) => {
        setPageDisabled(true)
      },
      updateCurrentUser,
      currentUserData,
      toast
    );
  }
  const fetchData = (initialRender = false) => {
    switch (activeTab) {
      case 0:
        getAllMembers(initialRender ? [] : members);
        break;
      case 1:
        getConnections(initialRender ? [] : connections);
        break;
      case 2:
        getConnectionRecieved(initialRender ? [] : connectionsReceived);
        break;
      case 3:
        getConnectionsSend(initialRender ? [] : connectionsSend);
        break;
      case 4:
        getFollowing(initialRender ? [] : followings);
        break;
      case 5:
        getFollowers(initialRender ? [] : followers);
        break;
      default:
        break;
    }
  }

  const fetch = () => fetchData(true);
  const fetchMore = () => fetchData(false);

  useEffect(() => {
    switch (activeTab) {
      case 0:
        if (members.length > 0)
          hasAnyLeft(`users`, members);
        break;
      case 1:
        if (connections.length > 0)
          hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/connections`, connections);
        break;
      case 2:
        if (connectionsReceived.length > 0)
          hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/connections/received`, connectionsReceived);
        break;
      case 3:
        if (connectionsSend.length > 0)
          hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/connections/sent`, connectionsSend);
        break;
      case 4:
        if (followings.length > 0)
          hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/followings`, followings);
        break;
      case 5:
        if (followers.length > 0)
          hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/followers`, followers);
        break;
      default:
        break;
    }
  }, [members, connections, followers, followings, connectionsReceived, connectionsSend])

  useEffect(() => {
    fetch()
  }, [filters, activeTab])

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
            <SearchComponent searchKey={filters.Keyword} setSearchKey={value => setFilters({ ...filters, Keyword: value })} />
            <h4 className='font-medium text-2xl text-system-primary-accent mt-4 mb-3 lg:mb-6'>Connections</h4>
            {/* <Tabs tabs={tabs} /> */}
            <Tab name='connections' activeTab={activeTab} onTabChange={onTabChange} tabs={tabs()} />

          </div>
          <div>
            <div className='p-5 bg-system-secondary-bg rounded-lg'>
              <div className='flex items-center justify-between gap-2 mb-5'>
                <h4 className='font-medium text-2xl text-system-primary-text'>Suggestions</h4>
                {/* arrow cursor-pointer */}
              </div>
              <div className='flex flex-col gap-4'>
                <SuggestionsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Connections
