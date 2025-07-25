import { useContext, useEffect, useState } from 'react'
import { useToast } from '../Toast/ToastService'
import { AuthContext } from '../../utils/AuthProvider'
import { getItem } from '../../constants/operations'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'
import TabItem from '../ui/TabItem'
import DiscussionsList from './DiscussionsList'
import SearchComponent from '../Search/SearchBox/SearchComponent'

const DiscussionSection = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const [activeTab, setActiveTab] = useState('all')
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [discussions, setDiscussions] = useState([])
	const [invitedDiscussions, setInvitedDiscussions] = useState([])
	const [followingDiscussions, setFollowingDiscussions] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
	})
	const api = 'discussions'
	const invitedApi = `user/${currentUserData.CurrentUser.UserId}/discussions/invited`
	const followingApi = `user/${currentUserData.CurrentUser.UserId}/discussions`

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getDiscussions = (tempDiscussions) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempDiscussions, setDiscussions)
	}

	const getInvitedDiscussions = (tempInvitedDiscussions) => {
		getData(`${invitedApi}?&${jsonToQuery(filters)}`, tempInvitedDiscussions, setInvitedDiscussions)
	}
	const getFollowingDiscussions = (tempFollowingDiscussions) => {
		getData(`${followingApi}?&${jsonToQuery(filters)}`, tempFollowingDiscussions, setFollowingDiscussions)
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
			case 'all':
				getDiscussions(initialRender ? [] : discussions)
				break
			case 'following':
				getFollowingDiscussions(initialRender ? [] : followingDiscussions)
				break
			case 'invited':
				getInvitedDiscussions(initialRender ? [] : invitedDiscussions)
		}
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		switch (activeTab) {
			case 'all':
				if (discussions.length > 0) hasAnyLeft(`${api}`, discussions)
				break
			case 'following':
				if (followingDiscussions.length > 0) hasAnyLeft(`${followingApi}`, followingDiscussions)
				break
			case 'invited':
				if (invitedDiscussions.length > 0) hasAnyLeft(`${invitedApi}`, invitedDiscussions)
				break
		}
	}, [discussions, invitedDiscussions, followingDiscussions])

	useEffect(() => {
		fetch()
	}, [filters, activeTab])

	return (
		<>
			{/* <div className='flex-1 rounded-md p-2 px-4 border border-system-file-border flex items-center justify-between bg-system-secondary-bg'>
				<h4 className='font-medium text-lg text-brand-gray-dim italic '>Search Discussions</h4>
			</div> */}
			<SearchComponent
				searchKey={filters.Keyword}
				setSearchKey={(value) => setFilters({ ...filters, Keyword: value })}
				placeholder='Search Discussions'
			/>
			<h4 className='font-bold text-2xl text-system-primary-accent mt-4 mb-2'>Community Discussions</h4>
			<h4 className=' text-base text-system-primary-text mb-2'>
				Find answers, ask questions, and connect with our community around the world.
			</h4>
			<div className='flex gap-6 flex-wrap mt-4 mb-6'>
				<TabItem
					className='rounded-full'
					variant={`${activeTab === 'all' ? 'active' : 'inactive'}`}
					onClick={() => setActiveTab('all')}>
					All Discussions
				</TabItem>
				<TabItem
					className='rounded-full'
					variant={`${activeTab === 'following' ? 'active' : 'inactive'}`}
					onClick={() => setActiveTab('following')}>
					Following
				</TabItem>
				<TabItem
					className='rounded-full'
					variant={`${activeTab === 'invited' ? 'active' : 'inactive'}`}
					onClick={() => setActiveTab('invited')}>
					Invitations
				</TabItem>
			</div>
			{activeTab === 'all' && <h4 className='font-bold mb-3 text-xl text-system-primary-text'>Trending Discussions</h4>}
			{activeTab === 'following' && (
				<h4 className='font-bold mb-3 text-xl text-system-primary-text'>Discussions you are following</h4>
			)}
			{activeTab === 'invited' && (
				<h4 className='font-bold mb-3 text-xl text-system-primary-text'>Discussion Invites</h4>
			)}
			{activeTab === 'all' && (
				<div className='mb-4'>
					{isLoading ? (
						<Spinner />
					) : discussions.length > 0 ? (
						<>
							<DiscussionsList
								data={discussions}
								updateList={setDiscussions}
								emptyText={'No discussions'}
								gap={'gap-2 lg:gap-4'}
								cols={'grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'}
								fetch={fetch}
							/>
							<div className='my-4'>
								{isLoadingMore && (
									<div className='bg-system-primary-bg p-4 rounded-b-lg '>
										<Spinner />
									</div>
								)}
								{!pageDisabled && (
									<div onClick={fetchMore} className='flex flex-row justify-end mt-4 mb-2'>
										<div className='cursor-pointer flex items-center gap-2'>
											<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<EmptyMembers emptyText={"You don't have any discussions available."} />
					)}
				</div>
			)}
			{activeTab === 'following' && (
				<>
					<div className='mb-4'>
						{isLoading ? (
							<Spinner />
						) : followingDiscussions.length > 0 ? (
							<>
								<DiscussionsList
									data={followingDiscussions}
									updateList={setFollowingDiscussions}
									emptyText={'No discussions'}
									gap={'gap-2 lg:gap-4'}
									cols={'grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'}
									fetch={fetch}
								/>
								<div className='my-4'>
									{isLoadingMore && (
										<div className='bg-system-primary-bg p-4 rounded-b-lg '>
											<Spinner />
										</div>
									)}
									{!pageDisabled && (
										<div onClick={fetchMore} className='flex flex-row justify-end mt-4 mb-2'>
											<div className='cursor-pointer flex items-center gap-2'>
												<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<EmptyMembers emptyText={"You don't have any discussions available."} />
						)}
					</div>
				</>
			)}
			{activeTab === 'invited' && (
				<>
					<div className='mb-4'>
						{isLoading ? (
							<Spinner />
						) : invitedDiscussions.length > 0 ? (
							<>
								<DiscussionsList
									data={invitedDiscussions}
									updateList={setInvitedDiscussions}
									emptyText={'No discussions'}
									gap={'gap-2 lg:gap-4'}
									cols={'grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'}
									fetch={fetch}
								/>
								<div className='my-4'>
									{isLoadingMore && (
										<div className='bg-system-primary-bg p-4 rounded-b-lg '>
											<Spinner />
										</div>
									)}
									{!pageDisabled && (
										<div onClick={fetchMore} className='flex flex-row justify-end mt-4 mb-2'>
											<div className='cursor-pointer flex items-center gap-2'>
												<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<EmptyMembers emptyText={"You don't have any discussions available."} />
						)}
					</div>
				</>
			)}
		</>
	)
}

export default DiscussionSection
