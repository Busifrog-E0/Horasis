import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import arrowback from '../assets/icons/arrowback.svg'
import calendar from '../assets/icons/calendar.svg'
import camera from '../assets/icons/camera.svg'
import clock from '../assets/icons/clock.svg'
import cover from '../assets/icons/cover.svg'
import TimeLineTab from '../components/Activities/TimeLineTab'
import EmptyMembers from '../components/Common/EmptyMembers'
import CreateEventStep5 from '../components/Events/CreateEvent/CreateEventSteps/CreateEventStep5'
import EventsAgenda from '../components/Events/EventsAgenda'
import EventJoinRequest from '../components/Events/EventsTabs/EventJoinRequest'
import EventParticipantsTab from '../components/Events/EventsTabs/EventParticipantsTab'
import EventSettings from '../components/Events/EventsTabs/EventSettings'
import InviteSpeakers from '../components/Events/InviteSpeakers'
import SpeakerProfileTab from '../components/Events/SpeakerProfileTab'
import Button from '../components/ui/Button'
import MiniTab from '../components/ui/MiniTab'
import Spinner from '../components/ui/Spinner'
import Tab from '../components/ui/Tab'
import useDeleteData from '../hooks/useDeleteData'
import useGetData from '../hooks/useGetData'
import usePostData from '../hooks/usePostData'
import useTranslation from '../hooks/useTranslation'
import useUpdateData from '../hooks/useUpdateData'
import { useAuth } from '../utils/AuthProvider'
import { getDateInWordsFormat, gettimenow } from '../utils/date'

const SingleEvent = () => {
	const { eventid } = useParams()
	const [activeTab, setActiveTab] = useState(0)
	const { currentUserData } = useAuth()

	const { isLoading, data: event, getData: getEvent, setData: setEvent } = useGetData(`events/${eventid}`)
	const navigate = useNavigate()
	const handleGoBack = () => {
		navigate(-1)
	}

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}
	const [joined, setJoined] = useState(false)
	const tabs = (event) => {
		const { Privacy, IsMember, Permissions, HasDiscussion, DocId } = event
		const isPrivate = Privacy === 'Private'
		const isAdmin = Permissions?.IsAdmin
		const canInvite = Permissions?.CanInviteOthers

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
					<EventSettings eventId={DocId} event={event} />
				</div>
			),
		})

		const getActivityTab = (key) => ({
			key: key,
			title: 'Activities',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<TimeLineTab
						api={`events/${DocId}/activities`}
						gapBnTabs='gap-7'
						classNameForPost='py-5'
						bordered={true}
						permissions={Permissions}
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

		if (isAdmin && isPrivate) {
			return HasDiscussion
				? [getActivityTab(0), getParticipantsTab(1), getRegistrationTab(2), getInviteSpeakersTab(3), getSettingsTab(4)]
				: [getParticipantsTab(0), getRegistrationTab(1), getInviteSpeakersTab(2), getSettingsTab(3)]
		} else if (isAdmin && !isPrivate) {
			return HasDiscussion
				? [getActivityTab(0), getParticipantsTab(1), getInviteSpeakersTab(2), getSettingsTab(3)]
				: [getParticipantsTab(0), getInviteSpeakersTab(1), getSettingsTab(2)]
		} else if (!isPrivate || IsMember) {
			return HasDiscussion ? [getActivityTab(0), getParticipantsTab(1)] : [getParticipantsTab(2)]
		} else {
			return [
				{
					key: 0,
					title: 'Join the event',
					render: () => (
						<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'></div>
					),
				},
			]
		}
	}

	const miniEventTabs = (event) => [
		{
			title: "Speakers' Profile",
			render: () => (
				<div className='py-3 pt-6 flex flex-col gap-8'>
					{event?.Speakers?.length > 0 ? (
						event.Speakers.map((speaker) => (
							<SpeakerProfileTab key={speaker.UserDetails.id} profile={speaker.UserDetails} agenda={speaker.Agenda} />
						))
					) : (
						<EmptyMembers emptyText='No speakers registered yet.' />
					)}
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

	const successCallback = (result) => {
		if (result === true || typeof result === 'object') {
			getEvent()
			onTabChange(tabs(event)[0])
		}
	}

	const { updateData: updateAcceptInvite } = useUpdateData({ onSuccess: successCallback })
	const { postData: postJoinEvent } = usePostData({ onSuccess: successCallback })
	const { deleteData } = useDeleteData('', { onSuccess: successCallback })

	const acceptInvite = () => {
		return updateAcceptInvite({
			endpoint: `events/${event.DocId}/invite/accept`,
			payload: {},
		})
	}
	const joinEvent = () => {
		return postJoinEvent({
			endpoint: `events/${event.DocId}/join`,
			payload: {},
		})
	}
	const unRegisterEvent = () => {
		return deleteData({ endPoint: `events/${event.DocId}/leave` })
	}
	const rejectInvite = () => {
		return deleteData({ endPoint: `events/${event.DocId}/invite/${currentUserData.CurrentUser.UserId}/reject` })
	}

	const cancelRegistrationRequest = () => {
		return deleteData({ endPoint: `events/${event.DocId}/join/${currentUserData.CurrentUser.UserId}/cancel` })
	}

	const {
		isTranslated: translated,
		translate: translateEvent,
		showOriginal,
		homeLanguage,
	} = useTranslation({ data: event, setData: setEvent, Type: 'Event' })

	if (isLoading) return <Spinner />
	return (
		<>
			<div className='overflow-hidden bg-system-primary-bg h-80 lg:h-96 relative'>
				{event.CoverPicture ? (
					<img src={event.CoverPicture} className='object-cover h-full w-full' />
				) : (
					<img src={cover} className='object-cover h-full w-full' />
				)}
				<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 bg-black/30 h-100 overflow-hidden overflow-y-auto'>
					<div className='flex w-full items-start justify-between'>
						<div
							className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
							onClick={handleGoBack}>
							<img src={arrowback} alt='' className='h-6 cursor-pointer' />
						</div>
						{event?.Permissions?.IsAdmin && (
							<div
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
							<h4 className='font-medium text-md  text-system-secondary-text my-2 lg:my-2 leading-relaxed'>
								{event.Description}
							</h4>
							{event.OriginalLanguage !== homeLanguage && (
								<>
									{translated ? (
										<p className='text-sm mt-4 text-system-secondary-text cursor-pointer' onClick={showOriginal}>
											Show Original
										</p>
									) : (
										<p className='text-sm mt-4 text-system-secondary-text cursor-pointer' onClick={translateEvent}>
											Translate Event Details
										</p>
									)}
								</>
							)}
							<div className='flex items-start gap-4 mt-3'>
								<img
									className='w-14 h-14 rounded-full object-cover'
									src={event?.UserDetails?.ProfilePicture}
									alt='Rounded avatar'
								/>
								<div className='flex-1'>
									<h4 className='text-xs text-brand-gray-dim mt-1'>Organizer</h4>
									<h4 className='font-semibold text-lg text-system-primary-accent mt-1'>
										{event?.UserDetails?.FullName}
									</h4>
								</div>
							</div>
							<div className='flex items-start gap-4 mt-4 lg:mb-6'>
								<div className='flex items-center flex-1 gap-3'>
									<img src={calendar} alt='' className='h-7' />
									<div>
										<h4 className='text-xs text-brand-gray-dim mb-1'>When</h4>
										<h4 className='text-sm text-system-primary-text leading-6'>
											{getDateInWordsFormat(new Date(event.Date))}
										</h4>
									</div>
								</div>
								<div className='flex items-center flex-1 gap-3'>
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
						<div className='flex gap-2'>
							{event.IsMember ? (
								<>
									<Button width='full' variant='black' onClick={() => navigate('join')}>
										Join
									</Button>
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
							<div className={`rounded-lg ${!joined && 'max-h-96 overflow-hidden relative h-full'}`}>
								{!event.IsMember && (
									<div className='absolute top-0 right-0 left-0 bottom-0 p-4 lg:px-10 lg:py-6 bg-system-primary-accent-light h-100 overflow-hidden overflow-y-auto z-10'>
										<div className='flex flex-col justify-center items-center mt-6'>
											<h4 className='font-bold text-center text-3xl text-system-primary-accent mb-3'>Join the Event</h4>
											<h4 className='text-md text-center text-system-primary-accent'>
												Get ready for insightful conversations! Our discussions platform will be active 10 days
												before,during and 10 days after the event. Check in closer to the date to connect with peers,
												share perspectives and share most of your event experience.
											</h4>
											<h4 className='text-md text-center text-system-primary-accent mt-4 mb-6'>
												Let the anticipation build - meaningful discussions await!
											</h4>
											{event.MembershipStatus === 'Requested' && (
												<p className='text-system-secondary-text'>Registration request has been sent</p>
											)}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
					<div>
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
					</div>
				</div>
			</div>
		</>
	)
}

export default SingleEvent
