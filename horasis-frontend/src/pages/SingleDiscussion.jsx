import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/AuthProvider'
import { useNavigate, useParams } from 'react-router-dom'
import MiniTab from '../components/ui/MiniTab'
import SpeakerProfileTab from '../components/Events/SpeakerProfileTab'
import DropdownMenu from '../components/ui/DropdownMenu'
import { relativeTime } from '../utils/date'
import Button from '../components/ui/Button'
import { useToast } from '../components/Toast/ToastService'
import { getItem, patchItem, postItem } from '../constants/operations'
import cover from '../assets/icons/cover.svg'
import { _retrieveData, _storeData, MAINTAB } from '../utils/LocalStorage'
import Tab from '../components/ui/Tab'
import Spinner from '../components/ui/Spinner'
import DiscussionActivities from '../components/Discussions/SingleDiscussionTabs/DiscussionActivities'
import TimeLineTab from '../components/Activities/TimeLineTab'
import DiscussionMembers from '../components/Discussions/SingleDiscussionTabs/DiscussionMembers'

const SingleDiscussion = () => {
	const [activeTab, setActiveTab] = useState(0)
	const { updateCurrentUser, currentUserData, scrollToTop } = useContext(AuthContext)
	const toast = useToast()
	const { discussionid } = useParams()
	const [discussion, setDiscussion] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const OnClickFollow = () => {}
	const handleGoBack = () => {
		navigate(-1)
	}

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const getDiscussion = () => {
		setIsLoading(true)
		getItem(
			`discussions/${discussionid}`,
			(result) => {
				setDiscussion(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err)
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getDiscussion()
	}, [])

	const tabs = (discussion) => {
		const isPrivate = discussion.Privacy === 'Private'
		const isMember = discussion.IsMember
		const isAccepted = discussion.Status === 'Accepted'
		const isAdmin = discussion?.Permissions?.IsAdmin
		if (isAdmin) {
			return [
				{
					key: 0,
					title: 'About',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<div className='flex flex-row justify-between text-system-primary-accent'>
								<h4 className='font-semibold text-2xl text-system-primary-text'>Description</h4>
								<svg
									className='w-6 h-6 cursor-pointer'
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
							<h4 className='text-xl text-brand-gray mt-2 lg:mt-6 mb-6 leading-8'>{discussion.Description}</h4>
						</div>
					),
				},
				{
					key: 1,
					title: 'Activities',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<TimeLineTab
								api={`discussions/${discussion?.DocId}/activities`}
								gapBnTabs='gap-7'
								classNameForPost='py-5'
								bordered={true}
							/>
						</div>
					),
				},
				{
					key: 2,
					title: 'Members',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<DiscussionMembers discussionId={discussion.DocId} />
						</div>
					),
				},
				{
					key: 3,
					title: 'Invitation Requests',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							Invitation Requests
						</div>
					),
				},

				{
					key: 4,
					title: 'Settings',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>Settings</div>
					),
				},
			]
		} else if (!isPrivate || (isMember && isAccepted)) {
			return [
				{
					key: 0,
					title: 'About',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<div className='flex flex-row justify-between text-system-primary-accent'>
								<h4 className='font-semibold text-2xl text-system-primary-text'>Description</h4>
								<svg
									className='w-6 h-6 cursor-pointer'
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
							<h4 className='text-xl text-brand-gray mt-2 lg:mt-6 mb-6 leading-8'>{discussion.Description}</h4>
						</div>
					),
				},
				{
					key: 1,
					title: 'Activities',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<TimeLineTab
								api={`discussions/${discussion?.DocId}/activities`}
								gapBnTabs='gap-7'
								classNameForPost='py-5'
								bordered={true}
								permissions={discussion.Permissions}
							/>
						</div>
					),
				},
				{
					key: 2,
					title: 'Members',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<DiscussionMembers discussionId={discussion.DocId} />
						</div>
					),
				},
			]
		} else {
			return [
				{
					key: 0,
					title: 'About',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<div className='flex flex-row justify-between text-system-primary-accent'>
								<h4 className='font-semibold text-2xl text-system-primary-text'>Description</h4>
								<svg
									className='w-6 h-6 cursor-pointer'
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
							<h4 className='text-xl text-brand-gray mt-2 lg:mt-6 mb-6 leading-8'>{discussion.Description}</h4>
						</div>
					),
				},
			]
		}
	}

	const acceptInvite = () => {
		patchItem(
			`discussions/${discussion.DocId}/invite/accept`,
			{},
			(result) => {
				if (result === true) {
					getDiscussion()
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const joinDiscussion = () => {
		postItem(
			`discussions/${discussion.DocId}/join`,
			{},
			(result) => {
				if (result === true) {
					getDiscussion()
				}
			},
			(err) => console.log(err),
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const unFollowDiscussion = () => {}

	return (
		<>
			<div className='overflow-hidden h-80 lg:h-96 relative'>
				{discussion.CoverPicture ? (
					<>
						<img src={discussion.CoverPicture} className='object-cover h-full w-full' />
					</>
				) : (
					<>
						<img src={cover} className='object-cover h-full w-full' />
					</>
				)}

				<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 bg-brand-blue-transparent h-100 overflow-hidden overflow-y-auto'>
					<div className='flex w-full items-start justify-between'>
						<div className='flex items-center cursor-pointer' onClick={handleGoBack}>
							{/* back arrow */}
							<h4 className='font-medium text-xl text-brand-secondary'>Back</h4>
						</div>
						<div
							className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
							<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
								/>
							</svg>
						</div>
					</div>
					<div>
						<h4 className='font-medium shadow-lg text-4xl text-white mb-3'>{discussion.DiscussionName}</h4>
						<div className='flex flex-row flex-wrap gap-3'>
							{/* <h4 className='text-2xl text-white'>Virtual Event</h4>
							<h4 className='text-2xl text-white'>•</h4> */}
							<h4 className='text-2xl text-white'>{discussion.NoOfMembers} Participants</h4>
							<h4 className='text-2xl text-white'>•</h4>
							<h4 className='text-2xl text-white'>{discussion.Privacy}</h4>
						</div>
					</div>
				</div>
			</div>
			<div>
				{isLoading ? (
					<div className='h-20 w-full flex items-center justify-center'>
						<Spinner />
					</div>
				) : (
					<div className='grid lg:grid-cols-4 gap-2 bg-system-primary-bg p-2'>
						<div className=''>
							<div className='p-5 lg:px-12 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8'>
								<div className='flex flex-row justify-between mt-1 lg:mt-3'>
									<h4 className='font-semibold text-2xl text-system-primary-text'>Brief</h4>
								</div>
								<h4 className='text-xl text-brand-gray mt-2 mb-12 leading-8'>{discussion.Brief}</h4>
								{discussion.Privacy === 'Private' ? (
									<>
										{discussion.Status === 'Invited' ? (
											<>
												<Button onClick={() => acceptInvite()} width='full' variant='black'>
													Accept invite
												</Button>
											</>
										) : (
											<>
												<Button
													onClick={() => unFollowDiscussion()}
													width='full'
													variant='black'
													className='bg-system-secondary-text border-system-secondary-text'>
													Unfollow
												</Button>
											</>
										)}
									</>
								) : (
									<>
										{!discussion.IsMember ? (
											<Button onClick={() => joinDiscussion()} width='full' variant='black'>
												Follow
											</Button>
										) : (
											<Button
												onClick={() => unFollowDiscussion()}
												width='full'
												variant='black'
												className='bg-system-secondary-text border-system-secondary-text'>
												Unfollow
											</Button>
										)}
									</>
								)}
							</div>
						</div>
						<div className='lg:col-span-3'>
							{discussion && (
								<Tab
									onTabChange={onTabChange}
									activeTab={activeTab}
									name='SingleDiscussion'
									tabs={tabs(discussion)}
									alignment='justify-start'
								/>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default SingleDiscussion

// UNUSED PREVIOUS CODE

// const miniEventTabs = () => [
// 	{
// 		title: "Speakers' Profile",
// 		render: () => (
// 			<div className='py-3 pt-6 flex flex-col gap-8'>
// 				<SpeakerProfileTab />
// 				<SpeakerProfileTab />
// 			</div>
// 		),
// 	},
// 	{
// 		title: 'Event Agenda',
// 		render: () => <div className='py-3 pt-6'></div>,
// 	},
// ]
