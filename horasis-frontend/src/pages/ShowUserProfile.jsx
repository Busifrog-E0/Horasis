import { useNavigate, useParams } from 'react-router-dom'
import Tab from '../components/ui/Tab'
import EventsList from '../components/Events/EventsList'
import { useContext, useEffect, useState } from 'react'
import { MAINTAB, _retrieveData, _storeData } from '../utils/LocalStorage'
import MembersSection from '../components/Connections/MembersSection'
import { relativeTime } from '../utils/date'
import DropdownMenu from '../components/ui/DropdownMenu'
import StaggeredList from '../components/ui/StaggeredList'
import VideoPlayer from '../components/ui/VideoPlayer'
import { deleteItem, getItem, patchItem, postItem } from '../constants/operations'
import { AuthContext } from '../utils/AuthProvider'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import AboutProfile from '../components/Profile/AboutProfile'
import Button from '../components/ui/Button'
import avatar from '../assets/icons/avatar.svg'
import cover from '../assets/icons/cover.svg'
import { useToast } from '../components/Toast/ToastService'
import { useFollow } from '../context/Follow/FollowService'

const UserProfileConnectComponent = ({ profile, connectCallback = () => { }, setIsLoading }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()

	const navigate = useNavigate()

	const goToChat = () => {
		navigate(`/Chat${profile.DocId}`)
	}

	const sendConnectionRequest = () => {
		setIsLoading(true)
		postItem(
			`connections/${profile.DocId}/send`,
			{},
			(result) => {
				connectCallback()
				console.log(result)
			},
			(err) => {
				setIsLoading(false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const acceptConnectionRequest = () => {
		setIsLoading(true)
		patchItem(
			`connections/${profile.DocId}/accept`,
			{},
			(result) => {
				connectCallback()
				console.log(result)
			},
			(err) => {
				setIsLoading(false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const rejectConnectionRequest = () => {
		setIsLoading(true)
		deleteItem(
			`connections/${profile.DocId}/reject`,
			(result) => {
				connectCallback()
				console.log(result)
			},
			(err) => {
				setIsLoading(false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const cancelConnectionRequest = () => {
		setIsLoading(true)
		deleteItem(
			`connections/${profile.DocId}/cancel`,
			(result) => {
				connectCallback()
				console.log(result)
			},
			(err) => {
				setIsLoading(false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const deleteConnection = () => {
		setIsLoading(true)
		deleteItem(
			`connections/${profile.DocId}`,
			(result) => {
				connectCallback()
				console.log(result)
			},
			(err) => {
				setIsLoading(false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	if (profile.ConnectionStatus === 'No Connection') {
		return (
			<Button
				variant='outline'
				width='full'
				className='rounded-full font-semibold'
				size='md'
				onClick={() => {
					sendConnectionRequest()
				}}>
				Connect
			</Button>
		)
	} else if (profile.ConnectionStatus === 'Connected') {
		return (
			<>
				<Button
					variant='white'
					width='full'
					className='rounded-full font-semibold shadow-sm text-system-primary-accent bg-system-secondary-accent'
					size='md'
					onClick={() => {
						deleteConnection()
					}}>
					Remove Connection
				</Button>
				<Button
					variant='white'
					width='full'
					className='rounded-full font-semibold shadow-sm text-system-primary-accent bg-system-secondary-accent'
					size='md'
					onClick={() => {

					}}>
					Chat
				</Button>
			</>
		)
	} else if (profile.ConnectionStatus === 'Connection Received') {
		return (
			<>
				<Button
					variant='black'
					width='full'
					className='rounded-full font-semibold'
					size='md'
					onClick={() => {
						acceptConnectionRequest()
					}}>
					Accept
				</Button>
				<Button
					variant='white'
					width='full'
					className='rounded-full font-semibold text-system-primary-accent border-none hover:bg-system-secondary-accent shadow-sm'
					size='md'
					onClick={() => {
						rejectConnectionRequest()
					}}>
					Reject
				</Button>
			</>
		)
	} else if (profile.ConnectionStatus === 'Connection Requested') {
		return (
			<Button
				variant='white'
				width='full'
				className='rounded-full font-semibold shadow-sm text-system-primary-accent border-none hover:bg-system-secondary-accent'
				size='md'
				onClick={() => {
					cancelConnectionRequest()
				}}>
				Cancel Request
			</Button>
		)
	} else {
		return <></>
	}
}

const UserProfileFollowComponent = ({ profile, followCallback = () => { }, setIsLoading }) => {
	const { followUser, unFollowUser } = useFollow()

	if (profile.IsFollowing) {
		return (
			<>
				<Button
					variant='white'
					width='full'
					className='rounded-full font-semibold shadow-sm bg-system-secondary-accent text-system-primary-accent'
					size='md'
					onClick={() => {
						unFollowUser(profile, followCallback, setIsLoading)
					}}>
					Unfollow
				</Button>
			</>
		)
	} else if (!profile.IsFollowing) {
		return (
			<>
				<Button
					variant='black'
					width='full'
					className='rounded-full font-semibold'
					size='md'
					onClick={() => {
						followUser(profile, followCallback, setIsLoading)
					}}>
					Follow
				</Button>
			</>
		)
	} else {
		return <></>
	}
}

const ShowUserProfile = () => {
	const { userid } = useParams()
	const [isLoading, setIsLoading] = useState(false)
	const [activeTab, setActiveTab] = useState(0)
	const navigate = useNavigate()
	const handleGoBack = () => {
		navigate(-1)
	}

	const { currentUserData, updateCurrentUser } = useContext(AuthContext)
	const toast = useToast()
	const [user, setUser] = useState()

	const tabs = () => [
		// {
		//   key: 0,
		//   title: 'Timeline',
		//   render: () => (
		//     <div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg '>
		//       <div className='p-5 pr-10 bg-system-secondary-bg rounded-lg mb-3'>
		//         <div className='flex items-center gap-5'>
		//           <img
		//             className='w-16 h-16 rounded-full'
		//             src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
		//             alt='Rounded avatar'
		//           />

		//           <div className='flex-1 rounded-md p-2 px-3 border border-system-file-border flex items-center justify-between bg-system-secondary-bg'>
		//             <h4 className='font-medium text-xl text-brand-gray-dim italic '>
		//               Share what's on your mind, Frank
		//             </h4>
		//           </div>
		//         </div>
		//       </div>
		//       <div className='flex flex-col gap-3'>
		//         <div className='p-5 bg-system-secondary-bg rounded-lg border border-system-file-border'>
		//           <div className='flex items-start gap-2'>
		//             <img
		//               className='w-16 h-16 rounded-full'
		//               src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
		//               alt='Rounded avatar'
		//             />

		//             <div className='flex-1'>
		//               <div className='flex items-start justify-between gap-10'>
		//                 <h4 className='font-semibold text-xl text-system-primary-accent mt-1'>
		//                   Frank-Jurgen Ritcher
		//                 </h4>
		//                 <h4 className='font-medium text-base text-brand-gray-dim'>
		//                   {relativeTime(new Date().getTime())}
		//                 </h4>
		//               </div>
		//               <h4 className='text-system-primary-text mt-1'>updated his profile photo</h4>
		//             </div>
		//           </div>
		//           <div className='flex items-center justify-between gap-10 mt-8'>
		//             <div className='flex flex-wrap items-start justify-between gap-10'>
		//               <div className='flex items-start gap-1 cursor-pointer'>
		//                 <p className='text-brand-gray-dim mt-1'>likes</p>
		//               </div>
		//               <div className='flex items-start gap-1 cursor-pointer'>
		//                 <p className='text-brand-gray-dim mt-1'>replies</p>
		//               </div>
		//             </div>
		//             <DropdownMenu />
		//           </div>
		//         </div>
		//         <div className='p-5 bg-system-secondary-bg rounded-lg border border-system-file-border'>
		//           <div className='flex items-start gap-2'>
		//             <img
		//               className='w-16 h-16 rounded-full'
		//               src='https://flowbite.com/docs/images/people/profile-picture-2.jpg'
		//               alt='Rounded avatar'
		//             />

		//             <div className='flex-1'>
		//               <div className='flex items-start justify-between gap-10'>
		//                 <h4 className='font-semibold text-xl text-system-primary-accent mt-1'>
		//                   Frank-Jurgen Ritcher
		//                 </h4>
		//                 <h4 className='font-medium text-base text-brand-gray-dim'>
		//                   {relativeTime(new Date().getTime())}
		//                 </h4>
		//               </div>
		//             </div>
		//           </div>
		//           <div className='mt-5'>
		//             <h4 className='text-system-primary-text font-medium text-xl'>Have a great day!</h4>
		//           </div>
		//           <div className='flex items-center justify-between gap-10 mt-8'>
		//             <div className='flex flex-wrap items-start justify-between gap-10'>
		//               <div className='flex items-start gap-1 cursor-pointer'>
		//                 <p className='text-brand-gray-dim mt-1'>likes</p>
		//               </div>
		//               <div className='flex items-start gap-1 cursor-pointer'>
		//                 <p className='text-brand-gray-dim mt-1'>replies</p>
		//               </div>
		//             </div>
		//             <DropdownMenu />
		//           </div>
		//         </div>
		//       </div>
		//     </div>
		//   ),
		// },
		{
			key: 0,
			title: 'About',
			render: () => <AboutTab user={user} getUserDetails={getUserDetails} />,
		},
		// {
		//   key: 1,
		//   title: 'Connections',
		//   render: () => (
		//     <div className='bg-system-secondary-bg p-4 lg:p-6 rounded-b-lg '>
		//       <ConnectionsTab/>
		//     </div>
		//   ),
		// },
	]

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const getUserDetails = () => {
		setIsLoading(true)
		getItem(
			`users/${userid}`,
			(result) => {
				setIsLoading(false)
				setUser(result)
			},
			(err) => {
				setIsLoading(false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getUserDetails()
	}, [])

	return (
		<>
			<div className='p-2 lg:px-10 lg:py-6'>
				<div className='rounded-lg z-20  h-40 lg:h-80 relative'>
					{user ? (
						<>
							{user.CoverPicture ? (
								<>
									<img src={user.CoverPicture} className='object-cover h-full w-full rounded-lg' />
								</>
							) : (
								<>
									<div className='w-full h-full rounded-lg flex items-center justify-center  bg-slate-100'>
										<img src={cover} className='object-cover h-full w-full rounded-lg' />
									</div>
								</>
							)}
						</>
					) : (
						<>
							<div className='w-full h-full rounded-lg flex items-center justify-center bg-slate-100'>
								{isLoading ? <Spinner /> : <></>}
							</div>
						</>
					)}
					{/* <img
            src='https://th.bing.com/th/id/OIP.FFchRAWwk-emGNqgImzwaAHaEK?rs=1&pid=ImgDetMain'
            className='object-cover h-full w-full rounded-lg'
          /> */}
					<div className='absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 h-100 overflow-hidden rounded-lg'>
						<div className='flex w-full items-start justify-between'>
							<div className='flex items-center cursor-pointer' onClick={handleGoBack}>
								{/* back arrow */}
								<h4 className='font-medium text-xl text-brand-secondary'>Back</h4>
							</div>
						</div>
					</div>
					<div className='flex justify-center items-center cursor-pointer absolute left-5 -bottom-3 lg:left-20 lg:-bottom-8 z-30'>
						{user ? (
							<>
								{user.ProfilePicture ? (
									<>
										<div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center bg-black'>
											<img
												className='w-24 lg:w-60 h-24 lg:h-60 rounded-full object-cover'
												src={user.ProfilePicture}
												alt='Rounded avatar'
												onClick={() => { }}
											/>
										</div>
									</>
								) : (
									<>
										<div
											className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-brand-light-gray'
											onClick={() => { }}>
											<img src={avatar} className='object-cover h-full w-full rounded-lg' />
										</div>
									</>
								)}
							</>
						) : (
							<>
								<div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-slate-100'>
									{isLoading ? <Spinner /> : <></>}
								</div>
							</>
						)}
						{/* <img
              className='w-24 lg:w-60 h-24 lg:h-60 rounded-full'
              src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
              alt='Rounded avatar'
            /> */}
					</div>
				</div>
			</div>
			<div className='p-2 lg:px-10 lg:py-6 pt-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12 '>
					<div className='py-5 lg:py-8 px-8 lg:px-12 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8 h-max'>
						{isLoading ? (
							<Spinner />
						) : (
							<>
								<h4 className='font-medium text-2xl lg:text-center text-system-primary-text'>{user && user.FullName}</h4>
								<h4 className='font-medium text-xl text-brand-gray-dim lg:text-center'>@{user && user.Username}</h4>
								<div className='flex justify-center items-center mt-2 lg:mt-6 flex-wrap sm:flex-nowrap  lg:flex-wrap gap-2'>
									{user && user.ConnectionStatus && (
										<UserProfileConnectComponent
											profile={user}
											connectCallback={getUserDetails}
											setIsLoading={setIsLoading}
										/>
									)}
									{user && (
										<UserProfileFollowComponent
											profile={user}
											followCallback={getUserDetails}
											setIsLoading={setIsLoading}
										/>
									)}
								</div>
								<h4 className='font-semibold text-xl text-system-primary-text mt-3 lg:mt-6'>About</h4>
								<div className='mt-4 flex  flex-col gap-4'>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<svg
												className='w-4 h-4 cursor-pointer'
												aria-hidden='true'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 20 20'>
												<path
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
												/>
											</svg>
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.Email}</h4>
									</div>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<svg
												className='w-4 h-4 cursor-pointer'
												aria-hidden='true'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 20 20'>
												<path
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
												/>
											</svg>
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.Country}</h4>
									</div>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<svg
												className='w-4 h-4 cursor-pointer'
												aria-hidden='true'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 20 20'>
												<path
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
												/>
											</svg>
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.JobTitle}</h4>
									</div>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<svg
												className='w-4 h-4 cursor-pointer'
												aria-hidden='true'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 20 20'>
												<path
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
												/>
											</svg>
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.CompanyName}</h4>
									</div>
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
const AboutTab = ({ user, getUserDetails, isCurrentUser = false }) => {
	return (
		<>
			<AboutProfile user={user} getUserDetails={getUserDetails} isCurrentUser={isCurrentUser} />
		</>
	)
}

export default ShowUserProfile
