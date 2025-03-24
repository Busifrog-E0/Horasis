import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import altmail from '../assets/icons/altmail.svg'
import arrowback from '../assets/icons/arrowback.svg'
import avatar from '../assets/icons/avatar.svg'
import company from '../assets/icons/company.svg'
import cover from '../assets/icons/cover.svg'
import globe from '../assets/icons/globe.svg'
import job from '../assets/icons/job.svg'
import AboutProfile, { extractLinkedInUsername } from '../components/Profile/AboutProfile'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Tab from '../components/ui/Tab'
import { useChatPopup } from '../context/ChatPopup/ChatPopupService'
import { useFollow } from '../context/Follow/FollowService'
import useDeleteData from '../hooks/useDeleteData'
import useGetData from '../hooks/useGetData'
import usePostData from '../hooks/usePostData'
import useUpdateData from '../hooks/useUpdateData'
import useWindowSize from '../hooks/useWindowSize'
import { useAuth } from '../utils/AuthProvider'
import TimeLineTab from '../components/Activities/TimeLineTab'
import AboutTab from '../components/Profile/Tabs/AboutTab'
import MyConnectionsTab from '../components/Connections/MyConnectionsTab'
import VideosTab from '../components/Profile/Tabs/VideosTab'
import ImagesTab from '../components/Profile/Tabs/ImagesTab'
import DiscussionsTab from '../components/Profile/Tabs/DiscussionsTab'
import DocumentTab from '../components/Profile/Tabs/DocumentTab'
import MyArticlesTab from '../components/Profile/Tabs/MyArticlesTab'

const UserProfileConnectComponent = ({ profile, connectCallback = () => {} }) => {
	const navigate = useNavigate()
	const { addUser } = useChatPopup()
	const { width } = useWindowSize()
	const goToChat = () => {
		if (width > 767) {
			addUser(profile.DocId)
		} else {
			navigate(`/Chat/${profile.DocId}`)
		}
	}
	const { isLoading: isPostLoading, postData } = usePostData({
		onSuccess: (result) => {
			if (result === true) {
				connectCallback()
			}
		},
	})
	const { isLoading: isUpdateLoading, updateData } = useUpdateData({
		onSuccess: (result) => {
			if (result === true) {
				connectCallback()
			}
		},
	})
	const { isLoading: isDeleteLoading, deleteData } = useDeleteData('', {
		onSuccess: (result) => {
			if (result === true) {
				connectCallback()
			}
		},
	})

	const sendConnectionRequest = () => {
		return postData({
			endpoint: `connections/${profile.DocId}/send`,
			payload: {},
		})
	}
	const acceptConnectionRequest = () => {
		return updateData({
			endpoint: `connections/${profile.DocId}/accept`,
			payload: {},
		})
	}
	const rejectConnectionRequest = () => {
		return deleteData({
			endPoint: `connections/${profile.DocId}/reject`,
		})
	}
	const cancelConnectionRequest = () => {
		return deleteData({
			endPoint: `connections/${profile.DocId}/cancel`,
		})
	}
	const deleteConnection = () => {
		return deleteData({
			endPoint: `connections/${profile.DocId}`,
		})
	}

	const renderButtons = () => {
		switch (profile.ConnectionStatus) {
			case 'No Connection':
				return (
					<Button
						variant='outline'
						width='full'
						className='rounded-full font-semibold'
						size='md'
						onClick={sendConnectionRequest}>
						Connect
					</Button>
				)

			case 'Connected':
				return (
					<>
						<Button
							variant='white'
							width='full'
							className='rounded-full font-semibold shadow-sm text-system-primary-accent bg-system-secondary-accent'
							size='md'
							onClick={deleteConnection}>
							Remove Connection
						</Button>
						<Button
							variant='white'
							width='full'
							className='rounded-full font-semibold shadow-sm text-system-primary-accent bg-system-secondary-accent'
							size='md'
							onClick={goToChat}>
							Chat
						</Button>
					</>
				)

			case 'Connection Received':
				return (
					<>
						<Button
							variant='black'
							width='full'
							className='rounded-full font-semibold'
							size='md'
							onClick={acceptConnectionRequest}>
							Accept
						</Button>
						<Button
							variant='white'
							width='full'
							className='rounded-full font-semibold text-system-primary-accent border-none hover:bg-system-secondary-accent shadow-sm'
							size='md'
							onClick={rejectConnectionRequest}>
							Reject
						</Button>
					</>
				)

			case 'Connection Requested':
				return (
					<Button
						variant='white'
						width='full'
						className='rounded-full font-semibold shadow-sm text-system-primary-accent border-none hover:bg-system-secondary-accent'
						size='md'
						onClick={cancelConnectionRequest}>
						Cancel Request
					</Button>
				)

			default:
				return null
		}
	}
	if (isPostLoading || isUpdateLoading || isDeleteLoading) return <Spinner />
	return <>{renderButtons()}</>
}

const UserProfileFollowComponent = ({ profile, followCallback = () => {}, setIsLoading }) => {
	const { followUser, unFollowUser } = useFollow()
	return (
		<Button
			variant={profile.IsFollowing ? 'white' : 'black'}
			width='full'
			className={`rounded-full font-semibold shadow-sm ${
				profile.IsFollowing ? 'bg-system-secondary-accent text-system-primary-accent' : ''
			}`}
			size='md'
			onClick={() => {
				profile.IsFollowing
					? unFollowUser(profile, followCallback, setIsLoading)
					: followUser(profile, followCallback, setIsLoading)
			}}>
			{profile.IsFollowing ? 'Unfollow' : 'Follow'}
		</Button>
	)
}

const ShowUserProfile = () => {
	const navigate = useNavigate()
	const { currentUserData } = useAuth()
	const { userid } = useParams()
	const {
		isLoading,
		data: user,
		getData: getUser,
		setIsLoading,
	} = useGetData(`users/${userid}`, { onError: (err) => navigate('/NotFound', { replace: true }) }, false)
	const [activeTab, setActiveTab] = useState(0)

	const { scrollToTop } = useAuth()

	const tabs = () => {
		if (user?.ConnectionStatus === 'Connected' || user?.IsFollowing === true) {
			return [
				{
					key: 0,
					title: 'Timeline',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<TimeLineTab
								api={`user/${user?.DocId}/activities`}
								gapBnTabs='gap-7'
								classNameForPost='py-5'
								bordered={true}
								showPostComponent={false}
							/>
						</div>
					),
				},
				{
					key: 1,
					title: 'About',
					render: () => <AboutProfile user={user} getUserDetails={getUser} isCurrentUser={false} />,
				},
				{
					key: 2,
					title: 'Connections',
					render: () => <MyConnectionsTab showOther={true} userId={user.DocId} />,
				},
				{
					key: 3,
					title: 'Videos',
					render: () => <VideosTab showOther={true} userId={user.DocId} />,
				},
				{
					key: 4,
					title: 'Photos',
					render: () => <ImagesTab showOther={true} userId={user.DocId} />,
				},
				{
					key: 5,
					title: 'Discussions',
					render: () => <DiscussionsTab showOther={true} userId={user.DocId} />,
				},
				{
					key: 6,
					title: 'Documents',
					render: () => <DocumentTab showOther={true} userId={user.DocId} />,
				},
				{
					key: 7,
					title: 'Articles',
					render: () => <MyArticlesTab showOther={true} userId={user.DocId} />,
				},
			]
		} else {
			return [
				{
					key: 0,
					title: 'About',
					render: () => <AboutProfile user={user} getUserDetails={getUser} isCurrentUser={false} />,
				},
			]
		}
	}

	useEffect(() => {
		setActiveTab(0)
	}, [user])

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	useEffect(() => {
		scrollToTop()
		getUser()
	}, [userid])

	return (
		<>
			<div className='p-2 lg:px-10 lg:py-6'>
				<div className='rounded-lg z-20  h-40 lg:h-80 relative'>
					{user ? (
						<>
							{user.CoverPicture ? (
								<img src={user.CoverPicture} className='object-cover h-full w-full rounded-lg' />
							) : (
								<div className='w-full h-full rounded-lg flex items-center justify-center  bg-slate-100'>
									<img src={cover} className='object-cover h-full w-full rounded-lg' />
								</div>
							)}
						</>
					) : (
						<>
							<div className='w-full h-full rounded-lg flex items-center justify-center bg-slate-100'>
								{isLoading ? <Spinner /> : <></>}
							</div>
						</>
					)}
					<div className='absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 h-100 overflow-hidden rounded-lg'>
						<div className='flex w-full items-start justify-between'>
							<div
								className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
								onClick={() => navigate(-1)}>
								<img src={arrowback} alt='' className='h-6 cursor-pointer' />
							</div>
						</div>
					</div>
					<div className='flex justify-center items-center cursor-pointer absolute left-5 -bottom-3 lg:left-20 lg:-bottom-8 z-30'>
						{user ? (
							<>
								{user.ProfilePicture ? (
									<div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center bg-black'>
										<img
											className='w-24 lg:w-60 h-24 lg:h-60 rounded-full object-cover'
											src={user.ProfilePicture}
											alt='Rounded avatar'
											onClick={() => {}}
										/>
									</div>
								) : (
									<div
										className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-brand-light-gray'
										onClick={() => {}}>
										<img src={avatar} className='object-cover h-full w-full rounded-lg' />
									</div>
								)}
							</>
						) : (
							<div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-slate-100'>
								{isLoading ? <Spinner /> : <></>}
							</div>
						)}
					</div>
				</div>
			</div>
			<div className='p-2 lg:px-10 lg:py-6 pt-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12 '>
					<div className='py-5 lg:py-8 px-8 lg:px-12 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8 h-max max-w-screen overflow-auto'>
						{isLoading ? (
							<Spinner />
						) : (
							<>
								<h4 className='font-medium text-2xl lg:text-center text-system-primary-text'>
									{user && user.FullName}
								</h4>
								<h4 className='font-medium text-xl text-brand-gray-dim lg:text-center'>@{user && user.Username}</h4>
								<div className='flex justify-center items-center mt-2 lg:mt-6 flex-wrap sm:flex-nowrap  lg:flex-wrap gap-2'>
									{user && user.ConnectionStatus && (
										<UserProfileConnectComponent profile={user} connectCallback={getUser} setIsLoading={setIsLoading} />
									)}
									{user && (
										<UserProfileFollowComponent profile={user} followCallback={getUser} setIsLoading={setIsLoading} />
									)}
								</div>
								<h4 className='font-semibold text-xl text-system-primary-text mt-3 lg:mt-6'>About</h4>
								<div className='mt-4 flex  flex-col gap-4'>
									{currentUserData.CurrentUser.UserId === userid ? (
										<div className='flex items-center gap-2'>
											<div className='justify-end text-system-primary-accent'>
												<img src={altmail} alt='' className='h-6 cursor-pointer' />
											</div>
											<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.Email}</h4>
										</div>
									) : (
										<>
											{user && (
												<>
													{user?.IsPrivate === false ? (
														<>
															<div className='flex items-center gap-2'>
																<div className='justify-end text-system-primary-accent'>
																	<img src={altmail} alt='' className='h-6 cursor-pointer' />
																</div>
																<h4 className='font-medium text-xl text-brand-gray-dim truncate'>
																	{user && user.Email}
																</h4>
															</div>
														</>
													) : (
														<></>
													)}
												</>
											)}
										</>
									)}
									{currentUserData.CurrentUser.UserId === userid ? (
										<div className='flex items-center gap-2'>
											<div className='justify-end text-system-primary-accent'>
												<img src={globe} alt='' className='h-6 cursor-pointer' />
											</div>
											<h4 className='font-medium text-xl text-brand-gray-dim truncate'>
												{user && (user.City || user.Country) && (
													<>
														{user.City && <span>{user.City}, </span>}
														{user.Country && <span>{user.Country}</span>}
													</>
												)}
											</h4>
										</div>
									) : (
										<>
											{user && (
												<>
													{user?.IsPrivate === false ? (
														<>
															<div className='flex items-center gap-2'>
																<div className='justify-end text-system-primary-accent'>
																	<img src={globe} alt='' className='h-6 cursor-pointer' />
																</div>
																<h4 className='font-medium text-xl text-brand-gray-dim truncate'>
																	{user && (user.City || user.Country) && (
																		<>
																			{user.City && <span>{user.City}, </span>}
																			{user.Country && <span>{user.Country}</span>}
																		</>
																	)}
																</h4>
															</div>
														</>
													) : (
														<></>
													)}
												</>
											)}
										</>
									)}

									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<img src={job} alt='' className='h-6 cursor-pointer' />
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.JobTitle}</h4>
									</div>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<img src={company} alt='' className='h-6 cursor-pointer' />
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.CompanyName}</h4>
									</div>
									{user && user?.LinkedIn && (
										<div className='flex items-center gap-2'>
											<div className='justify-end text-system-primary-accent'>
												{/* <img src={globe} alt='' className='h-6 cursor-pointer' /> */}
												<p className='text-system-primary-accent font-bold'>in</p>
											</div>
											<h4
												className='font-semibold text-xl text-brand-gray-dim truncate cursor-pointer hover:text-sky-600'
												onClick={() => window.open('https://' + user.LinkedIn, '_blank')}>
												{user && extractLinkedInUsername(user.LinkedIn)}
											</h4>
										</div>
									)}
								</div>
							</>
						)}
					</div>

					<div className='lg:col-span-3'>
						<Tab
							onTabChange={onTabChange}
							activeTab={activeTab}
							name='MyProfile'
							tabs={tabs()}
							alignment='justify-start'
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default ShowUserProfile
