import { useContext, useEffect, useState } from 'react'
import { AuthContext, useAuth } from '../utils/AuthProvider'
import { useNavigate, useParams } from 'react-router-dom'
import MiniTab from '../components/ui/MiniTab'
import SpeakerProfileTab from '../components/Events/SpeakerProfileTab'
import DropdownMenu from '../components/ui/DropdownMenu'
import { getDateInWordsFormat, gettimenow, relativeTime } from '../utils/date'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/Toast/ToastService'
import { deleteItem, getItem, patchItem, postItem } from '../constants/operations'
import cover from '../assets/icons/cover.svg'
import arrowback from '../assets/icons/arrowback.svg'
import camera from '../assets/icons/camera.svg'
import calendar from '../assets/icons/calendar.svg'
import clock from '../assets/icons/clock.svg'
import close from '../assets/icons/close.svg'
import edit from '../assets/icons/edit.svg'
import Tab from '../components/ui/Tab'
import EventParticipantsTab from '../components/Events/EventsTabs/EventParticipantsTab'
import CreateEventStep5 from '../components/Events/CreateEvent/CreateEventSteps/CreateEventStep5'
import EventSettings from '../components/Events/EventsTabs/EventSettings'
import EventsAgenda from '../components/Events/EventsAgenda'
import TimeLineTab from '../components/Activities/TimeLineTab'
import EventJoinRequest from '../components/Events/EventsTabs/EventJoinRequest'

const SingleEvent = () => {
	const [activeTab, setActiveTab] = useState(0)
	const { updateCurrentUser, currentUserData, scrollToTop } = useAuth()
	const toast = useToast()
	const { eventid } = useParams()
	const [event, setEvent] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const handleGoBack = () => {
		navigate(-1)
	}

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const getEvent = () => {
		setIsLoading(true)
		getItem(
			`events/${eventid}`,
			(result) => {
				console.log(result)
				setEvent(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err)
				navigate('/NotFound', { replace: true })
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getEvent()
	}, [])

	const tabs = (event) => {
		const isPrivate = event.Privacy === 'Private'
		const isParticipant = event.IsMember
		const isAdmin = event?.Permissions?.IsAdmin
		const hasDiscussion = event?.HasDiscussion

		if (isAdmin && isPrivate) {
			if (hasDiscussion) {
				return [
					{
						key: 0,
						title: 'Activities',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<TimeLineTab
									api={`events/${event.DocId}/activities`}
									gapBnTabs='gap-7'
									classNameForPost='py-5'
									bordered={true}
									permissions={event.Permissions}
								/>
							</div>
						),
					},
					{
						key: 1,
						title: 'Participants',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								{event?.Permissions?.CanInviteOthers && (
									<div>
										<CreateEventStep5 eventId={event.DocId} from='tab' IsAdmin={event?.Permissions?.IsAdmin} />
									</div>
								)}
								<div className='my-4 flex flex-col gap-2'>
									<h1 className='text-system-primary-text font-medium text-lg'>Current Participants</h1>
									<EventParticipantsTab eventId={event.DocId} />
								</div>
							</div>
						),
					},
					{
						key: 2,
						title: 'Registration Requests',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<EventJoinRequest eventId={event.DocId} />
							</div>
						),
					},
					{
						key: 3,
						title: 'Settings',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<EventSettings eventId={event.DocId} event={event} />
							</div>
						),
					},
				]
			} else {
				return [
					{
						key: 0,
						title: 'Participants',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								{event?.Permissions?.CanInviteOthers && (
									<div>
										<CreateEventStep5 eventId={event.DocId} from='tab' IsAdmin={event?.Permissions?.IsAdmin} />
									</div>
								)}
								<div className='my-4 flex flex-col gap-2'>
									<h1 className='text-system-primary-text font-medium text-lg'>Current Participants</h1>
									<EventParticipantsTab eventId={event.DocId} />
								</div>
							</div>
						),
					},
					{
						key: 1,
						title: 'Registration Requests',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<EventJoinRequest eventId={event.DocId} />
							</div>
						),
					},
					{
						key: 2,
						title: 'Settings',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<EventSettings eventId={event.DocId} event={event} />
							</div>
						),
					},
				]
			}
		} else if (isAdmin && !isPrivate) {
			if (hasDiscussion) {
				return [
					{
						key: 0,
						title: 'Activities',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<TimeLineTab
									api={`events/${event.DocId}/activities`}
									gapBnTabs='gap-7'
									classNameForPost='py-5'
									bordered={true}
									permissions={event.Permissions}
								/>
							</div>
						),
					},
					{
						key: 1,
						title: 'Participants',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								{event?.Permissions?.CanInviteOthers && (
									<div>
										<CreateEventStep5 eventId={event.DocId} from='tab' IsAdmin={event?.Permissions?.IsAdmin} />
									</div>
								)}
								<div className='my-4 flex flex-col gap-2'>
									<h1 className='text-system-primary-text font-medium text-lg'>Current Participants</h1>
									<EventParticipantsTab eventId={event.DocId} />
								</div>
							</div>
						),
					},

					{
						key: 2,
						title: 'Settings',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<EventSettings eventId={event.DocId} event={event} />
							</div>
						),
					},
				]
			} else {
				return [
					{
						key: 0,
						title: 'Participants',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								{event?.Permissions?.CanInviteOthers && (
									<div>
										<CreateEventStep5 eventId={event.DocId} from='tab' IsAdmin={event?.Permissions?.IsAdmin} />
									</div>
								)}
								<div className='my-4 flex flex-col gap-2'>
									<h1 className='text-system-primary-text font-medium text-lg'>Current Participants</h1>
									<EventParticipantsTab eventId={event.DocId} />
								</div>
							</div>
						),
					},

					{
						key: 1,
						title: 'Settings',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<EventSettings eventId={event.DocId} event={event} />
							</div>
						),
					},
				]
			}
		} else if (!isPrivate || isParticipant) {
			if (hasDiscussion) {
				return [
					{
						key: 0,
						title: 'Activities',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								<TimeLineTab
									api={`events/${event.DocId}/activities`}
									gapBnTabs='gap-7'
									classNameForPost='py-5'
									bordered={true}
									permissions={event.Permissions}
								/>
							</div>
						),
					},
					{
						key: 1,
						title: 'Participants',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								{event?.Permissions?.CanInviteOthers && (
									<div>
										<CreateEventStep5 eventId={event.DocId} from='tab' IsAdmin={event?.Permissions?.IsAdmin} />
									</div>
								)}
								<div className='my-4 flex flex-col gap-2'>
									<h1 className='text-system-primary-text font-medium text-lg'>Current Participants</h1>
									<EventParticipantsTab eventId={event.DocId} />
								</div>
							</div>
						),
					},
				]
			} else {
				return [
					{
						key: 0,
						title: 'Participants',
						render: () => (
							<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
								{event?.Permissions?.CanInviteOthers && (
									<div>
										<CreateEventStep5 eventId={event.DocId} from='tab' IsAdmin={event?.Permissions?.IsAdmin} />
									</div>
								)}
								<div className='my-4 flex flex-col gap-2'>
									<h1 className='text-system-primary-text font-medium text-lg'>Current Participants</h1>
									<EventParticipantsTab eventId={event.DocId} />
								</div>
							</div>
						),
					},
				]
			}
		} else {
			return [
				{
					key: 0,
					title: 'Join the event',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'></div>
					),
				},
			]
		}
	}

	const [joined, setJoined] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isRegistered, setIsRegistered] = useState(false)

	const OnClickRegister = () => {
		OnModalOpen()
	}
	const goToGome = () => {
		OnModalClose()
		navigate('/events')
	}
	const miniEventTabs = (event) => [
		{
			title: "Speakers' Profile",
			render: () => (
				<div className='py-3 pt-6 flex flex-col gap-8'>
					<SpeakerProfileTab />
					<SpeakerProfileTab />
				</div>
			),
		},
		{
			title: 'Event Agenda',
			render: () => (
				<div className='py-3 pt-6'>
					<EventsAgenda event={event} />
				</div>
			),
		},
	]

	const onConfirmRegister = () => {
		setIsRegistered(true)
	}

	const OnModalClose = () => {
		setIsModalOpen(false)
	}

	const OnModalOpen = () => {
		setIsRegistered(false)
		setIsModalOpen(true)
	}

	const acceptInvite = () => {
		patchItem(
			`events/${event.DocId}/invite/accept`,
			{},
			(result) => {
				if (result === true) {
					getEvent()
					onTabChange(tabs(event)[0])
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const joinEvent = () => {
		postItem(
			`events/${event.DocId}/join`,
			{},
			(result) => {
				if (result === true) {
					getEvent()
					onTabChange(tabs(event)[0])
				} else if (typeof result === 'object') {
					getEvent()
					onTabChange(tabs(event)[0])
				}
			},
			(err) => console.log(err),
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const unRegisterEvent = () => {
		deleteItem(
			`events/${event.DocId}/leave`,
			(result) => {
				if (result === true) {
					getEvent()
					onTabChange(tabs(event)[0])
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const rejectInvite = () => {
		deleteItem(
			`events/${event.DocId}/invite/${currentUserData.CurrentUser.UserId}/reject`,
			(result) => {
				if (result === true) {
					getEvent()
					onTabChange(tabs(event)[0])
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const cancelRegistrationRequest = () => {
		deleteItem(
			`events/${event.DocId}/join/${currentUserData.CurrentUser.UserId}/cancel`,
			(result) => {
				if (result === true) {
					getEvent()
					onTabChange(tabs(event)[0])
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<>
			<Modal isOpen={isModalOpen}>
				{isRegistered && (
					<Modal.Header className='border-none'>
						<p></p>
						<img src={close} onClick={OnModalClose} alt='' className='h-6 cursor-pointer' />
					</Modal.Header>
				)}
				<Modal.Body>
					<div className='p-8'>
						{isRegistered ? (
							<>
								<h1 className='text-system-primary-accent text-4xl font-bold text-center mb-6'>Registration Done!</h1>
								<h1 className='text-system-primary-text text-2xl font-medium text-center leading-9 mb-6'>
									Thanks for registering for '{event.EventName}'. Details will be sent to your email address
									'purvaa@email.com'
								</h1>
								<div className='px-8'>
									<Button type='button' onClick={goToGome} width='full' variant='black' className='mt-4'>
										Home
									</Button>
								</div>
							</>
						) : (
							<>
								<h1 className='text-system-primary-text text-2xl font-medium text-center leading-9'>
									Do you want to register for '{event.EventName}'?
								</h1>
								<div className='grid grid-cols-2 gap-2 px-4'>
									<Button type='button' onClick={OnModalClose} width='full' variant='outline' className='mt-4'>
										No
									</Button>
									<Button type='button' onClick={onConfirmRegister} width='full' variant='black' className='mt-4'>
										Yes
									</Button>
								</div>
							</>
						)}
					</div>
				</Modal.Body>
			</Modal>
			<div className='overflow-hidden bg-red-400 h-80 lg:h-96 relative'>
				{event.CoverPicture ? (
					<>
						<img src={event.CoverPicture} className='object-cover h-full w-full' />
					</>
				) : (
					<>
						<img src={cover} className='object-cover h-full w-full' />
					</>
				)}

				<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 bg-black/30 h-100 overflow-hidden overflow-y-auto'>
					<div className='flex w-full items-start justify-between'>
						<div
							className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
							onClick={handleGoBack}>
							{/* back arrow */}
							<img src={arrowback} alt='' className='h-6 cursor-pointer' />

							{/* <h4 className='font-medium text-lg text-brand-secondary'>Back</h4> */}
						</div>
						{event?.Permissions?.IsAdmin && (
							<div
								// onClick={() => {
								// 	setIsCoverPictureOpen(true)
								// 	if (event.CoverPicture) {
								// 		setSelectedCoverImage(event.CoverPicture)
								// 	} else {
								// 		setSelectedCoverImage(null)
								// 	}
								// }}
								className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
								<img src={camera} alt='' className='h-6 cursor-pointer' />
							</div>
						)}
					</div>
					<div>
						<h4 className='font-bold text-4xl text-white mb-2'>{event.EventName}</h4>
						<div className='flex flex-row flex-wrap gap-3'>
							<h4 className='text-xl text-white'>{event.Type} Event</h4>
							<h4 className='text-xl text-white'>•</h4>
							<h4 className='text-xl text-white'>{event.NoOfMembers} Participants</h4>
							<h4 className='text-xl text-white'>•</h4>
							<h4 className='text-xl text-white'>{event.Privacy}</h4>
						</div>
					</div>
				</div>
			</div>
			<div className='p-2 lg:px-10 lg:py-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12 '>
					<div>
						<div className='p-5 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8'>
							<h4 className='font-semibold text-xl text-system-primary-text mt-1 lg:mt-3'>About</h4>
							<h4 className='font-semibold text-md text-system-primary-text mt-2.5 lg:mt-5 leading-8'>
								{event.Description}
							</h4>
							<div className='flex items-start gap-4 mt-3'>
								<img className='w-14 h-14 rounded-full' src={event?.UserDetails?.ProfilePicture} alt='Rounded avatar' />
								<div className='flex-1'>
									<h4 className='text-xs text-brand-gray-dim mt-1'>Organizer</h4>
									<h4 className='font-semibold text-lg text-system-primary-accent mt-1'>
										{event?.UserDetails?.FullName}
									</h4>
								</div>
							</div>
							<div className='flex items-start gap-4 mt-4 lg:mb-6'>
								<div className='flex items-center flex-1 gap-3'>
									{/* icon goes here */}
									<img src={calendar} alt='' className='h-7' />

									<div>
										<h4 className='text-xs text-brand-gray-dim mb-1'>When</h4>
										<h4 className='text-sm text-system-primary-text leading-6'>
											{getDateInWordsFormat(new Date(event.Date))}
										</h4>
									</div>
								</div>
								<div className='flex items-center flex-1 gap-3'>
									{/* icon goes here */}
									<img src={clock} alt='' className='h-7' />

									<div>
										<h4 className='text-xs text-brand-gray-dim mb-1'>Time</h4>
										<h4 className='text-sm text-system-primary-text leading-6'>
											{gettimenow(new Date(event.StartTime))}
										</h4>
									</div>
								</div>
							</div>
						</div>
						{/* <Button onClick={() => OnClickRegister()} width='full' variant='black'>
							Register
						</Button> */}
						<div className='flex gap-2'>
							{event.IsMember ? (
								<>
									{currentUserData.CurrentUser.UserId !== event.OrganiserId && (
										<Button width='full' variant='outline' onClick={() => unRegisterEvent()}>
											Leave Event
										</Button>
									)}
								</>
							) : event.MembershipStatus === undefined ? (
								<Button width='full' variant='black' onClick={() => joinEvent()}>
									Register
								</Button>
							) : event.MembershipStatus === 'Requested' ? (
								<Button width='full' variant='outline' onClick={() => cancelRegistrationRequest()}>
									Cancel Registration
								</Button>
							) : event.MembershipStatus === 'Invited' ? (
								<div className='flex flex-col items-start gap-2'>
									<p className='text-system-secondary-text'>You have been invited to this event</p>
									<div className='flex gap-2'>
										<Button width='full' variant='outline' onClick={() => rejectInvite()}>
											Reject
										</Button>
										<Button width='full' variant='black' onClick={() => acceptInvite()}>
											Accept
										</Button>
									</div>
								</div>
							) : null}
						</div>
					</div>

					<div className='lg:col-span-2'>
						{event && event.IsMember && (
							<Tab
								onTabChange={onTabChange}
								activeTab={activeTab}
								name='SingleEvent'
								tabs={tabs(event)}
								alignment='justify-start'
							/>
						)}
						{event && !event.IsMember && (
							<>
								<div className={`rounded-lg ${!joined && 'max-h-96 overflow-hidden relative '}`}>
									{!event.IsMember && (
										<div className='absolute top-0 right-0 left-0 bottom-0 p-4 lg:px-10 lg:py-6 bg-system-primary-accent-light h-100 overflow-hidden overflow-y-auto z-10'>
											{/* <div className='flex w-full items-start justify-end'>
											<img src={edit} alt='' className='h-8 cursor-pointer' />
										</div> */}
											<div className='flex flex-col justify-center items-center mt-6'>
												<h4 className='font-bold text-center text-3xl text-system-primary-accent mb-3'>
													Join the Event
												</h4>
												<h4 className='text-md text-center text-system-primary-accent'>
													Get ready for insightful conversations! Our discussions platform will be active 10 days
													before,during and 10 days after the event. Check in closer to the date to connect with peers,
													share perspectives and share most of your event experience.
												</h4>
												<h4 className='text-md text-center text-system-primary-accent mt-4 mb-6'>
													Let the anticipation build - meaningful discussions await!
												</h4>
												{event.MembershipStatus === undefined && (
													<Button width='full' variant='black' onClick={() => joinEvent()}>
														Register
													</Button>
												)}
												{event.MembershipStatus === 'Requested' && (
													<p className='text-system-secondary-text'>Registration request has been sent</p>
												)}
											</div>
										</div>
									)}
									<div className={`flex flex-col gap-2 ${!event.IsMember && 'blur-lg'}`}>
										<div className='p-5 bg-system-secondary-bg rounded-lg shadow-md'>
											<div className='flex items-start gap-2'>
												<img
													className='w-12 h-12 rounded-full'
													src='https://flowbite.com/docs/images/people/profile-picture-2.jpg'
													alt='Rounded avatar'
												/>

												<div className='flex-1'>
													<div className='flex items-start justify-between gap-10'>
														<h4 className='font-semibold text-md text-system-primary-accent mt-1'>
															Tejeswara Rao Pedada
														</h4>
														<h4 className='font-medium text-xs text-brand-gray-dim'>
															{relativeTime(new Date().getTime())}
														</h4>
													</div>
												</div>
											</div>
											<div className='mt-5'>
												<h4 className='text-system-primary-text font-medium text-md'>Have a great day!</h4>
											</div>
											<div className='flex items-center justify-between gap-10 mt-4'>
												<div className='flex flex-wrap items-start justify-between gap-10'>
													<div className='flex items-start gap-1 cursor-pointer'>
														<p className='text-brand-gray-dim text-base mt-1'>likes</p>
													</div>
													<div className='flex items-start gap-1 cursor-pointer'>
														<p className='text-brand-gray-dim text-base mt-1'>replies</p>
													</div>
												</div>
												<DropdownMenu />
											</div>
										</div>
										<div className='p-5 bg-system-secondary-bg rounded-lg shadow-md'>
											<div className='flex items-start gap-2'>
												<img
													className='w-12 h-12 rounded-full'
													src='https://flowbite.com/docs/images/people/profile-picture-3.jpg'
													alt='Rounded avatar'
												/>

												<div className='flex-1'>
													<div className='flex items-start justify-between gap-10'>
														<h4 className='font-semibold text-md text-system-primary-accent mt-1'>Lee Wen De</h4>
														<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(1706194651000)}</h4>
													</div>
												</div>
											</div>
											<div className='mt-5'>
												<h4 className='text-system-primary-text font-medium text-md'>
													Any interesting events coming up?
												</h4>
											</div>
											<div className='flex items-center justify-between gap-10 mt-8'>
												<div className='flex flex-wrap items-start justify-between gap-10'>
													<div className='flex items-start gap-1 cursor-pointer'>
														<p className='text-brand-gray-dim text-base mt-1'>likes</p>
													</div>
													<div className='flex items-start gap-1 cursor-pointer'>
														<p className='text-brand-gray-dim text-base mt-1'>replies</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</div>

					<div>
						<div className='p-5 bg-system-secondary-bg rounded-lg'>
							<div className='lg:mt-1'>
								<MiniTab
									gap='gap-8'
									fontSize='text-md xl:text-xl'
									alignment='justify-center'
									tabs={miniEventTabs(event)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default SingleEvent
