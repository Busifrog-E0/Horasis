import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import arrowback from '../assets/icons/arrowback.svg'
import calendar from '../assets/icons/calendar.svg'
import camera from '../assets/icons/camera.svg'
import closeIcon from '../assets/icons/close.svg'
import clock from '../assets/icons/clock.svg'
import cover from '../assets/icons/cover.svg'
import TimeLineTab from '../components/Activities/TimeLineTab'
import EmptyMembers from '../components/Common/EmptyMembers'
import Settings from '../components/Common/PermissionsManagement/Settings'
import CreateEventStep5 from '../components/Events/CreateEvent/CreateEventSteps/CreateEventStep5'
import EventsAgenda from '../components/Events/EventsAgenda'
import EventJoinRequest from '../components/Events/EventsTabs/EventJoinRequest'
import EventParticipantsTab from '../components/Events/EventsTabs/EventParticipantsTab'
import InviteSpeakers from '../components/Events/InviteSpeakers'
import SpeakerProfileTab from '../components/Events/SpeakerProfileTab'
import Button from '../components/ui/Button'
import MiniTab from '../components/ui/MiniTab'
import Spinner from '../components/ui/Spinner'
import Tab from '../components/ui/Tab'
import useEntityMembershipManager from '../hooks/useEntityMembershipManager'
import useGetData from '../hooks/useGetData'
import useTranslation from '../hooks/useTranslation'
import { useAuth } from '../utils/AuthProvider'
import { getDateInWordsFormat, gettimenow } from '../utils/date'
import TagsList from '../components/Tags/TagsList'
import Modal from '../components/ui/Modal'
import PictureUpload from '../components/Profile/EditProfile/PictureUpload'
import usePostData from '../hooks/usePostData'
import useUpdateData from '../hooks/useUpdateData'
import EventsAgendaBig from '../components/Events/EventAgendaBig'
import ShowMoreText from '../components/Common/ShowMoreText'

const SingleEvent = () => {
	const { eventid } = useParams()
	const navigate = useNavigate()
	const { currentUserData } = useAuth()

	const [activeTab, setActiveTab] = useState(0)
	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const {
		isLoading: isLoadingEvent,
		data: event,
		getData: getEvent,
		setData: setEvent,
	} = useGetData(`events/${eventid}`)
	const handleGoBack = () => {
		navigate(-1)
	}

	const tabs = (event) => {
		const { Privacy, IsMember, Permissions, HasDiscussion, DocId, Date: EventDate } = event // Assuming EventDate is part of the event object
		const isPrivate = Privacy === 'Private'
		const isAdmin = Permissions?.IsAdmin
		const canInvite = Permissions?.CanInviteOthers

		// Convert EventDate to a Date object

		const eventDate = new Date(EventDate)
		const currentDate = new Date() // Current date at the time of execution
		const tenDaysBefore = new Date(eventDate)
		const tenDaysAfter = new Date(eventDate)

		tenDaysBefore.setDate(eventDate.getDate() - 10)
		tenDaysAfter.setDate(eventDate.getDate() + 10)

		const isWithinTenDays = currentDate >= tenDaysBefore && currentDate <= tenDaysAfter

		const getEventAgendaTab = (key) => ({
			key: key,
			title: 'Event Agenda',
			render: () => {
				return (
					<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
						<EventsAgendaBig event={event} />
					</div>
				)
			},
		})

		const getParticipantsTab = (key) => ({
			key: key,
			title: 'Participants',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					{canInvite && (
						<div>
							<CreateEventStep5 event={event} eventId={DocId} from='tab' IsAdmin={isAdmin} />
						</div>
					)}
					<div className='my-4 flex flex-col gap-2'>
						<h1 className='text-system-primary-text font-medium text-lg'>Current Participants</h1>
						<EventParticipantsTab eventId={DocId} />
					</div>
				</div>
			),
		})

		const getInviteSpeakersTab = (key) => ({
			key: key,
			title: 'Invite Speakers',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<InviteSpeakers eventId={DocId} event={event} />
				</div>
			),
		})

		const getSettingsTab = (key) => ({
			key: key,
			title: 'Settings',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<Settings
						from='settings'
						EntityId={DocId}
						Entity={event}
						permissionsToShow={{
							Invitation: true,
							Activity: event?.HasDiscussion,
							Photo: event?.HasDiscussion,
							Video: event?.HasDiscussion,
							Album: event?.HasDiscussion,
							Admin: true,
						}}
						Type='Event'
					/>
				</div>
			),
		})

		const getActivityTab = (key) => ({
			key: key,
			title: 'Updates & Discussions',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<TimeLineTab
						api={`activities`}
						gapBnTabs='gap-7'
						classNameForPost='py-5'
						bordered={true}
						permissions={Permissions}
						entId={DocId}
						type='Event'
					/>
				</div>
			),
		})

		const getRegistrationTab = (key) => ({
			key: key,
			title: 'Registration Requests',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<EventJoinRequest eventId={DocId} />
				</div>
			),
		})

		const getDicussionNotStarted = (key) => ({
			key: key,
			title: 'Updates & Discussions',
			render: () => (
				<>
					<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden h-96'>
						<div className={`rounded-lg  max-h-96 overflow-hidden relative   h-full`}>
							<div className='absolute top-0 right-0 left-0 bottom-0 p-4 lg:px-10 lg:py-6 bg-system-primary-accent-light h-100 overflow-hidden overflow-y-auto z-10'>
								<div className='flex flex-col justify-center items-center mt-6'>
									<h4 className='font-bold text-center text-3xl text-system-primary-accent mb-3'>
										Join the Discussions
									</h4>
									<h4 className='text-md text-center text-system-primary-accent'>
										Get ready for insightful conversations! Our discussions platform will be active 10 days
										before,during and 10 days after the event?. Check in closer to the date to connect with peers, share
										perspectives and share most of your event experience.
									</h4>
									<h4 className='text-md text-center text-system-primary-accent mt-4 mb-6'>
										Let the anticipation build - meaningful discussions await!
									</h4>
								</div>
							</div>
						</div>
					</div>
				</>
			),
		})

		const getSpeakersTab = (key) => ({
			key: key,
			title: 'Speakers',
			render: () => (
				<>
					<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg'>
						<div className=''>
							{event?.Speakers?.length > 0 ? (
								<div className='grid grid-cols-1  gap-6'>
									{event?.Speakers.map((speaker) => (
										<SpeakerProfileTab
											key={speaker.UserDetails.id}
											profile={speaker.UserDetails}
											agenda={speaker.Agenda}
										/>
									))}
								</div>
							) : (
								<EmptyMembers emptyText='No speakers registered yet.' />
							)}
						</div>
					</div>
				</>
			),
		})

		// Start with key 0
		let tabsArray = []

		tabsArray.push(getEventAgendaTab(0))
		// Add activity tab if within the specified date range and has discussion
		if (isWithinTenDays && HasDiscussion && IsMember) {
			tabsArray.push(getActivityTab(tabsArray.length)) // Key for Activity tab is 0
		} else if (!isWithinTenDays && HasDiscussion && IsMember) {
			tabsArray.push(getDicussionNotStarted(tabsArray.length))
		}

		// Add other tabs, incrementing keys accordingly
		tabsArray.push(getSpeakersTab(tabsArray.length))
		if (IsMember) {
			tabsArray.push(getParticipantsTab(tabsArray.length)) // Participants tab key will be 1
		}

		if (isAdmin && isPrivate) {
			tabsArray.push(getRegistrationTab(tabsArray.length)) // Registration Requests key will be 2
		}

		// Add invite speakers tab and settings tab
		if (isAdmin) {
			tabsArray.push(getInviteSpeakersTab(tabsArray.length)) // Invite Speakers key will be 3
			tabsArray.push(getSettingsTab(tabsArray.length)) // Settings key will be 4
		}

		// For non-admins or non-private events
		if (!isPrivate || IsMember) {
			// Add only the necessary tabs for members or public events
			return tabsArray
		} else {
			// If user is not a member and the event is private
			return []
			// return [
			// 	{
			// 		key: 0,
			// 		title: 'Join the event',
			// 		render: () => (
			// 			<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'></div>
			// 		),
			// 	},
			// ]
		}
	}

	const miniEventTabs = (event) => [
		{
			title: "Speakers' Profile",
			render: () => (
				<div className='py-3 pt-6 flex flex-col gap-8'>
					{event?.Speakers?.length > 0 ? (
						event?.Speakers.map((speaker) => (
							<SpeakerProfileTab key={speaker.UserDetails.id} profile={speaker.UserDetails} agenda={speaker.Agenda} />
						))
					) : (
						<EmptyMembers emptyText='No speakers registered yet.' />
					)}
				</div>
			),
		},
		// {
		// 	title: 'Event Agenda',
		// 	render: () => (
		// 		<div className='py-3 pt-6'>
		// 			<EventsAgenda event={event} />
		// 		</div>
		// 	),
		// },
	]

	const successCallback = () => {
		getEvent()
		onTabChange(tabs(event)[0])
	}

	const {
		isLoading,
		subscribeEntityMembership: joinEvent,
		unsubscribeEntityMembership: unRegisterEvent,
		cancelEntityMembershipSubscription: cancelRegistrationRequest,
		acceptEntityMembershipInvitation: acceptInvite,
		rejectEntityMembershipInvitation: rejectInvite,
	} = useEntityMembershipManager({
		EntityId: event?.DocId,
		Type: 'Event',
		successCallback: successCallback,
		errorCallback: () => {},
	})

	const {
		isTranslated: translated,
		translate: translateEvent,
		showOriginal,
		homeLanguage,
	} = useTranslation({ data: event, setData: setEvent, Type: 'Event' })

	// cover photo upload logic
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const [isCoverPictureOpen, setIsCoverPictureOpen] = useState(false)

	const { isLoading: isCoverUploading, postData: postCoverUpload } = usePostData({
		onSuccess: (result) => {
			onCoverImageSet(result.FileUrl)
		},
	})
	const { isLoading: isCoverPatching, updateData: updateCoverUpload } = useUpdateData({
		onSuccess: (result) => {
			if (result === true) {
				setIsCoverPictureOpen(false)
				getEvent()
			}
		},
	})

	const onCoverImageSelect = (imageData) => {
		setCoverImageToUpload({ ...imageData, Type: 'Events' })
		const tempUrl = URL.createObjectURL(new Blob([new Uint8Array(imageData.FileData)]))
		setSelectedCoverImage(tempUrl)
	}
	const onCoverImageDelete = () => {
		setCoverImageToUpload(null)
		setSelectedCoverImage(null)
	}

	const onCoverImageSet = (url) => {
		return updateCoverUpload({
			endpoint: `events/${eventid}/coverPicture`,
			payload: { CoverPicture: url },
		})
	}
	const onCoverImageUpload = (imageToUpload) => {
		if (imageToUpload) {
			postCoverUpload({
				endpoint: 'files/users',
				payload: imageToUpload,
			})
		} else if (coverImageToUpload) {
			postCoverUpload({
				endpoint: 'files/users',
				payload: coverImageToUpload,
			})
		} else {
			onCoverImageSet('')
		}
	}

	if (isLoadingEvent || isLoading) return <Spinner />
	return (
		<>
			<Modal isOpen={isCoverPictureOpen} maxWidth='max-w-4xl'>
				<Modal.Header>
					<div className='p-2 flex items-center justify-between w-full'>
						<p className='text-lg font-medium'>Cover Photo</p>
						<button
							onClick={() => {
								setIsCoverPictureOpen(false)
							}}
							disabled={isCoverPatching || isCoverUploading}>
							<img src={closeIcon} className='h-6  cursor-pointer' alt='' />
						</button>
					</div>
				</Modal.Header>
				<Modal.Body>
					<p className='text-lg font-medium text-center'>
						Your cover photo will be used to customize the header of your profile.
					</p>
					<div className=' flex flex-col items-center justify-center pt-10'>
						<PictureUpload
							altTitle='Cover Picture'
							selectedImage={selectedCoverImage}
							setSelectedImage={setSelectedCoverImage}
							onImageSelect={onCoverImageSelect}
							onImageDelete={onCoverImageDelete}
							onUploadImage={onCoverImageUpload}
							fileFieldName={'CoverPicture'}
							isUploading={isCoverPatching || isCoverUploading}
						/>
					</div>
				</Modal.Body>
			</Modal>
			<div className='p-2 lg:px-20 '>
				<div className='overflow-hidden bg-system-primary-bg h-48 rounded-t-lg relative'>
					{event?.CoverPicture ? (
						<img src={event?.CoverPicture} className='object-cover h-full w-full' />
					) : (
						<img src={cover} className='object-cover h-full w-full' />
					)}
					<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 bg-black/30 h-100 overflow-hidden overflow-y-auto'>
						<div className='flex w-full items-start justify-between'>
							<div
								className={`inline-flex items-center justify-center w-6 h-6 md:w-12 md:h-12 md:p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
								onClick={handleGoBack}>
								<img src={arrowback} alt='' className='h-3 md:h-6 cursor-pointer' />
							</div>
							{/* NEED UPADTE FROM BACKEND API */}
							{/* {event?.Permissions?.IsAdmin && (
							<div
								onClick={() => {
									setIsCoverPictureOpen(true)
									if (event?.CoverPicture) {
										setSelectedCoverImage(event?.CoverPicture)
									} else {
										setSelectedCoverImage(null)
									}
								}}
								className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
								<img src={camera} alt='' className='h-6 cursor-pointer' />
							</div>
						)} */}
						</div>
					</div>
				</div>
				<div className='bg-system-secondary-bg rounded-b-2xl p-6 '>
					<div className='pb-4'>
						<h4 className='font-bold text-system-primary-accent mb-2 text-3xl '>{event?.EventName}</h4>

						<div className='flex flex-row flex-wrap gap-3'>
							<h4 className='text-md text-system-primary-accent'>{event?.Type} Event</h4>
							<h4 className='text-md text-system-primary-accent'>•</h4>
							<h4 className='text-md text-system-primary-accent'>{event?.NoOfMembers} Participants</h4>
							<h4 className='text-md text-system-primary-accent'>•</h4>
							<h4 className='text-md text-system-primary-accent'>{event?.Privacy}</h4>
							<h4 className='text-md text-system-primary-accent'>•</h4>
							{event?.Location && (
								<>
									<h4 className='text-md text-system-primary-accent'>{event?.Location},</h4>
								</>
							)}

							<h4 className='text-md text-system-primary-accent'>{event?.Country}</h4>
						</div>
					</div>
					<div className='flex flex-col md:flex-row md:gap-10'>
						<div className='flex-1'>
							<h4 className='font-semibold text-xl text-system-primary-text'>About</h4>
							<ShowMoreText text={event?.Description} />
							{event.Tags && event.Tags.length > 0 && (
								<div className='flex my-4 gap-2 flex-wrap'>
									<TagsList tags={event?.Tags} />
								</div>
							)}
							{event?.OriginalLanguage !== homeLanguage && (
								<div className='mt-4'>
									{translated ? (
										<p className='text-sm text-system-secondary-text cursor-pointer' onClick={showOriginal}>
											Show Original
										</p>
									) : (
										<p className='text-sm text-system-secondary-text cursor-pointer' onClick={translateEvent}>
											Translate Event Details
										</p>
									)}
								</div>
							)}
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2'>
							<div className='flex items-center gap-4 mt-6 md:col-span-2'>
								<img
									className='w-14 h-14 rounded-full object-cover'
									src={event?.UserDetails?.ProfilePicture}
									alt='Rounded avatar'
								/>
								<div className='flex-1'>
									<p className='text-xs text-brand-gray-dim'>Organizer</p>
									<h4 className='font-semibold text-lg text-system-primary-accent'>{event?.UserDetails?.FullName}</h4>
								</div>
							</div>

							<div className='grid grid-cols-2  gap-4 mt-6'>
								<div className='flex items-center gap-3'>
									<img src={calendar} alt='' className='h-7' />
									<div>
										<p className='text-xs text-brand-gray-dim mb-1'>When</p>
										<p className='text-sm text-system-primary-text leading-6'>
											{getDateInWordsFormat(new Date(event?.Date))}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<img src={clock} alt='' className='h-7' />
									<div>
										<p className='text-xs text-brand-gray-dim mb-1'>Time</p>
										<p className='text-sm text-system-primary-text leading-6'>
											{gettimenow(new Date(event?.StartTime))}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='flex gap-2 mt-10  max-w-lg justify-self-end w-full justify-end'>
						<ShowJoinButton event={event} />
						{event?.IsMember ? (
							<>
								{currentUserData.CurrentUser.UserId !== event?.OrganiserId && (
									<Button variant='outline' onClick={() => unRegisterEvent()}>
										Leave Event
									</Button>
								)}
							</>
						) : event?.MembershipStatus === undefined ? (
							<Button width='full' variant='black' onClick={() => joinEvent()}>
								Register
							</Button>
						) : event?.MembershipStatus === 'Requested' ? (
							<Button variant='outline' onClick={() => cancelRegistrationRequest()}>
								Cancel Registration
							</Button>
						) : event?.MembershipStatus === 'Invited' ? (
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
			</div>
			<div className='p-2 lg:px-20 '>
				<div className='grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-12 '>
					<div className='lg:col-span-4'>
						{event && (
							<Tab
								onTabChange={onTabChange}
								activeTab={activeTab}
								name='SingleEvent'
								tabs={tabs(event)}
								alignment='justify-start'
							/>
						)}
						{event && !event?.IsMember && (
							<div
								className={`rounded-lg ${
									!event?.IsMember &&
									'max-h-96 overflow-hidden relative h-max  my-8 border border-system-primary-accent'
								}`}>
								{!event?.IsMember && (
									<div className=' top-0 right-0 left-0 bottom-0 p-4 lg:px-10 lg:py-6 bg-system-primary-accent-light h-100 overflow-hidden overflow-y-auto z-10'>
										<div className='flex flex-col justify-center items-center mt-6'>
											<h4 className='font-bold text-center text-3xl text-system-primary-accent mb-3'>Join the Event</h4>
											<h4 className='text-md text-center text-system-primary-accent'>
												Get ready for insightful conversations! Our discussions platform will be active 10 days
												before,during and 10 days after the event?. Check in closer to the date to connect with peers,
												share perspectives and share most of your event experience.
											</h4>
											<h4 className='text-md text-center text-system-primary-accent mt-4 mb-6'>
												Let the anticipation build - meaningful discussions await!
											</h4>
											{event?.MembershipStatus === 'Requested' && (
												<p className='text-system-secondary-text'>Registration request has been sent</p>
											)}
											<div>
												{event?.IsMember ? (
													<>
														{currentUserData.CurrentUser.UserId !== event?.OrganiserId && (
															<Button variant='outline' onClick={() => unRegisterEvent()}>
																Leave Event
															</Button>
														)}
													</>
												) : event?.MembershipStatus === undefined ? (
													<Button width='full' variant='black' onClick={() => joinEvent()}>
														Register
													</Button>
												) : event?.MembershipStatus === 'Requested' ? (
													<Button variant='outline' onClick={() => cancelRegistrationRequest()}>
														Cancel Registration
													</Button>
												) : event?.MembershipStatus === 'Invited' ? (
													<div className='flex flex-col items-center gap-2'>
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
									</div>
								)}
							</div>
						)}
					</div>
					{/* <ShowJoinButton event={event} /> */}
					{/* <div className='flex flex-col gap-2'>
						<ShowJoinButton event={event} />
						<div className='p-5 bg-system-secondary-bg rounded-lg'>
							<div className='lg:mt-1'>
								<MiniTab
									gap='gap-8'
									fontSize='text-md xl:text-md'
									alignment='justify-center'
									tabs={miniEventTabs(event)}
								/>
							</div>
						</div>
					</div> */}
				</div>
			</div>
		</>
	)
}

const ShowJoinButton = ({ event }) => {
	// Assuming you have event.StartTime available and it's in a valid date format
	const { IsMember, StartTime } = event
	const navigate = useNavigate()

	// Convert StartTime to a Date object
	const eventStartTime = new Date(StartTime) // Ensure StartTime is in a valid format

	// Get current date and time
	const currentDateTime = new Date()

	// Calculate the time limit for showing the Join button (30 minutes before the event)
	const thirtyMinutesBefore = new Date(eventStartTime)
	thirtyMinutesBefore.setMinutes(eventStartTime.getMinutes() - 30)

	// Check if the button should be shown
	const shouldShowJoinButton = event?.IsMember && currentDateTime >= thirtyMinutesBefore

	return (
		<div className='flex-1'>
			{/* Other components */}
			{shouldShowJoinButton && (
				<Button width='full' variant='danger' onClick={() => navigate('join')}>
					Join
				</Button>
			)}
		</div>
	)
}

export default SingleEvent
