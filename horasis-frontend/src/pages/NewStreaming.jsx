import {
	useIsConnected,
	useJoin,
	useLocalCameraTrack,
	useLocalMicrophoneTrack,
	usePublish,
	useRTCClient,
} from 'agora-rtc-react'
import AgoraRTM from 'agora-rtm-sdk'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import close from '../assets/icons/closewhite.svg'
import NewStreamParticipantList from '../components/NewStreaming/NewStreamParticipantList'
import NewStreamUsersList from '../components/NewStreaming/NewStreamUsersList'
import JoinToStream from '../components/Streaming/JoinToStream'
import { useToast } from '../components/Toast/ToastService'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import { getItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { AGORA_APP_ID } from '../utils/enums'

const NewStreaming = () => {
	const location = useLocation()
	// context and params
	const { updateCurrentUser, currentUserData, logout } = useAuth()
	const toast = useToast()
	const { eventid } = useParams()
	const navigate = useNavigate()

	// join parameters
	const [appId, setAppId] = useState(AGORA_APP_ID)
	const [channel, setChannel] = useState(eventid)
	const [rtcToken, setRtcToken] = useState('')
	const [rtmToken, setRtmToken] = useState('')

	// roles and user and event
	const [role, setRole] = useState('Member')
	const [user, setUser] = useState({})
	const [event, setEvent] = useState(location?.state ? location?.state?.Event : null)
	const [participants, setParticipants] = useState([])
	const [speakers, setSpeakers] = useState([])
	const [messages, setMessages] = useState([])
	// clients
	const rtcClient = useRTCClient()
	const [rtmClient, setRtmClient] = useState(null)
	const [isCalling, setIsCalling] = useState(false)
	const isConnected = useIsConnected()

	// loading
	const [isLoadingToken, setIsLoadingToken] = useState(true)
	const [isLoadingUser, setIsLoadingUser] = useState(true)
	const [isLoadingEvent, setIsLoadingEvent] = useState(false)

	// mic and camera
	const [blocked, setBlocked] = useState(false)
	const [micOn, setMic] = useState(false)
	const [cameraOn, setCamera] = useState(false)
	const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn)
	const { localCameraTrack } = useLocalCameraTrack(cameraOn)
	usePublish([localMicrophoneTrack, localCameraTrack]) // fetch  token from backend
	// `events/${eventid}/videoCall/participants/${currentUserData.CurrentUser.UserId}`
	const getUser = () => {
		setIsLoadingUser(true)
		getItem(
			`events/${eventid}/videoCall/participants/${currentUserData.CurrentUser.UserId}`,
			// `users/${currentUserData.CurrentUser.UserId}`,
			(result) => {
				setIsLoadingUser(false)
				setUser(result)
				console.log(result, 'single user')
			},
			(err) => {
				setIsLoadingUser(false)
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getRoleAndTokens = async () => {
		setIsLoadingToken(true)
		getItem(
			`event/${eventid}/videoCall/join`,
			(result) => {
				if (result && result.RtcToken && result.RtmToken && result.Role) {
					setRtcToken(result.RtcToken)
					setRtmToken(result.RtmToken)
					setRole(result.Role)
				}
				setIsLoadingToken(false)
			},
			(err) => {
				setIsLoadingToken(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getEvent = () => {
		setIsLoadingEvent(true)
		getItem(
			`events/${eventid}`,
			(result) => {
				setIsLoadingEvent(false)
				setEvent(result)
			},
			(err) => {
				setIsLoadingEvent(false)
				navigate(`/NotFound`, { replace: true })
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getUser()
		if (!event) {
			getEvent()
		}
		getRoleAndTokens()
	}, [])

	// initialize rtm
	// initialize rtm
	const rtmConnect = async () => {
		if (!rtmToken || !user || rtmClient) {
			console.log('Token is not available or RTM client already initialized')
			return
		}

		const newRtmClient = new AgoraRTM.RTM(appId, currentUserData.CurrentUser.UserId, { token: rtmToken })
		setRtmClient(newRtmClient) // Set the client here to prevent multiple logins

		newRtmClient.addEventListener('presence', async (event) => {
			const action = event.eventType // The event type, should be one of 'SNAPSHOT', 'INTERVAL', 'JOIN', 'LEAVE', 'TIMEOUT、'STATE_CHANGED', 'OUT_OF_SERVICE'.
			const channelType = event.channelType // The channel type, should be 'STREAM' or 'MESSAGE'
			const channelName = event.channelName // The name of the channel this event came from
			const publisher = event.publisher // The user who triggered this event
			const states = event.stateChanged // User state payload, only for the stateChanged event
			const interval = event.interval // Interval payload, only for the interval event
			const snapshot = event.snapshot // Snapshot payload, only for the snapshot event
			// console.log(event)
			if (action === 'SNAPSHOT') {
				const parts = snapshot.map((item) => item.states)
				const filteredSpeakers = parts.filter((part) => part.Role === 'Speaker')
				const filteredMembers = parts.filter((part) => part.Role === 'Member')
				setParticipants(filteredMembers)
				setSpeakers(filteredSpeakers)
			}
			if (action === 'REMOTE_LEAVE') {
				await handleGetUsers(newRtmClient)
			}

			if (action === 'REMOTE_STATE_CHANGED') {
				if (
					states.UserName !== undefined &&
					states.UserAvatar !== undefined &&
					states.UserRtcUid !== undefined &&
					states.UserId !== undefined &&
					states.Role !== undefined
				) {
					if (states.Role === 'Speaker') {
						setSpeakers((prev) => [...prev, states])
					} else {
						setParticipants((prev) => [...prev, states])
					}
				}
			}
		})

		newRtmClient.addEventListener('message', async (event) => {
			const channelType = event.channelType // Which channel type it is, Should be "STREAM", "MESSAGE" or "USER" .
			const channelName = event.channelName // Which channel does this message come from
			const topic = event.topicName // Which Topic does this message come from, it is valid when the channelType is "STREAM".
			const messageType = event.messageType // Which message type it is, Should be "STRING" or "BINARY" .
			const customType = event.customType // User defined type
			const publisher = event.publisher // Message publisher
			const message = event.message // Message payload
			const timestamp = event.timestamp // Message timestamp

			if (channelName === eventid) {
				const messageData = JSON.parse(message)
				if (messageData?.UserId === currentUserData?.CurrentUser?.UserId) {
					if (messageData.action === 'MICTOGGLE') {
						setMic(false)
					} else if (messageData.action === 'CAMERATOGGLE') {
						setCamera(false)
					} else if (messageData.action === 'BLOCK') {
						setMic(false)
						setCamera(false)
						setBlocked(true)
						toast.open(
							'info',
							'Camera and microphone muted',
							'Your camera and microphone has been permanently muted by the moderator.'
						)
					}
				} else {
					setMessages((prev) => [...prev, messageData])
				}
			}
		})

		await handleRtmLogin(newRtmClient)
		// Handle presence event
		await handleUserJoinPresence(newRtmClient)
		await handleSubcribeChannel(newRtmClient)
		setIsCalling(true)

		// await handleGetUsers(newRtmClient)
	}

	const handleRtmLogin = async (rtmClient) => {
		try {
			const result = await rtmClient.login()
			// console.log(result)
		} catch (status) {
			console.log(status)
		}
	}

	const handleRtmLogout = async () => {
		try {
			const result = await rtmClient.logout()
			// console.log(result)
		} catch (status) {
			console.log(status)
		}
	}

	const handleSubcribeChannel = async (rtmClient) => {
		const options = {
			withMessage: true,
			withPresence: true,
			withMetadata: false,
			withLock: false,
		}
		try {
			const result = await rtmClient.subscribe(eventid, options)

			// console.log(result)
		} catch (status) {
			console.log(status)
		}
	}

	const handleUnsubscribeChannel = async () => {
		try {
			const result = await rtmClient.unsubscribe(eventid)
			// console.log(result)
		} catch (status) {
			console.log(status)
		}
	}

	const handleGetUsers = async (rtmClient) => {
		const options = {
			includedUserId: true,
			includedState: true,
		}
		try {
			const result = await rtmClient.presence.getOnlineUsers(eventid, 'MESSAGE', options)
			const parts = result.occupants.map((item) => item.states)
			const filteredSpeakers = parts.filter((part) => part.Role === 'Speaker')
			const filteredMembers = parts.filter((part) => part.Role === 'Member')
			setParticipants(filteredMembers)
			setSpeakers(filteredSpeakers)
		} catch (status) {
			console.log(status)
		}
	}

	const handleUserJoinPresence = async (rtmClient) => {
		var newState = {
			UserId: currentUserData?.CurrentUser?.UserId,
			UserName: user?.FullName,
			UserRtcUid: currentUserData?.CurrentUser?.UserId,
			UserAvatar: user?.ProfilePicture,
			Role: role,
		}
		try {
			const result = await rtmClient.presence.setState(eventid, 'MESSAGE', newState)
			// console.log(result)
		} catch (status) {
			console.log(status)
		}
	}

	const handleRemovePresence = async () => {
		const options = {
			states: ['UserId', 'UserName', 'UserRtcUid', 'UserAvatar'],
		}
		try {
			const result = await rtmClient.presence.removeState(eventid, 'MESSAGE', options)
			// console.log(result)
		} catch (status) {
			console.log(status)
		}
	}

	const handleLeave = async () => {
		await handleRemovePresence()
		await handleUnsubscribeChannel()
		rtmClient.removeEventListener('presence', async (event) => {
			const action = event.eventType // The event type, should be one of 'SNAPSHOT', 'INTERVAL', 'JOIN', 'LEAVE', 'TIMEOUT、'STATE_CHANGED', 'OUT_OF_SERVICE'.
			const channelType = event.channelType // The channel type, should be 'STREAM' or 'MESSAGE'
			const channelName = event.channelName // The name of the channel this event came from
			const publisher = event.publisher // The user who triggered this event
			const states = event.stateChanged // User state payload, only for the stateChanged event
			const interval = event.interval // Interval payload, only for the interval event
			const snapshot = event.snapshot // Snapshot payload, only for the snapshot event
		})
		await handleRtmLogout()
		setIsCalling((a) => !a)
		setRtmClient(null)
		if (currentUserData.CurrentUser.Role.includes('Guest')) {
			logout()
			navigate('/home')
		}
	}

	const handleSendMessage = async (messagePayload) => {
		try {
			const result = await rtmClient.publish(eventid, messagePayload)
			// console.log(result)
		} catch (status) {
			console.log(status)
		}
	}

	// Function to send a mute command to a specific user
	const sendMuteMessage = async (userId, action) => {
		const muteMessage = JSON.stringify({ action: action, UserId: userId })
		try {
			const result = await rtmClient.publish(eventid, muteMessage) // Send the message to the specific user
		} catch (error) {
			console.error('Error sending mute message:', error)
		}
	}

	const onMuteUserClick = (userId, action) => {
		sendMuteMessage(userId, action)
	}

	// initialize rtc
	const {} = useJoin(
		{ uid: currentUserData.CurrentUser.UserId, appid: appId, channel: channel, token: rtcToken ? rtcToken : null },
		isCalling,
		rtcClient ? rtcClient : null
	)
	useEffect(() => {
		if (isConnected) {
			if (role === 'Speaker') rtcClient.setClientRole('host')
			else rtcClient.setClientRole('audience')
		}
	}, [isConnected])

	const [modalOpen, setModalOpen] = useState(false)

	return (
		<>
			{isLoadingEvent || isLoadingToken || isLoadingUser ? (
				<>
					<div className='flex items-center justify-center h-full'>
						<Spinner />
						{/* <div className='text-xl font-semibold text-gray-700'>Loading...</div> */}
					</div>
				</>
			) : isConnected ? (
				<div className='h-screen overflow-hidden relative'>
					<div className='bg-system-primary-darker-accent h-full overflow-hidden max-h-screen max-w-screen'>
						<div className='h-full grid grid-cols-4 '>
							<div className='col-span-4 md:col-span-2 lg:col-span-3 p-4 overflow-hidden h-full '>
								<NewStreamUsersList
									event={event}
									cameraOn={cameraOn}
									micOn={micOn}
									localCameraTrack={localCameraTrack}
									localMicrophoneTrack={localMicrophoneTrack}
									setCamera={setCamera}
									isConnected={isConnected}
									calling={isCalling}
									setMic={setMic}
									setCalling={handleLeave}
									role={role}
									currentUser={user}
									participants={participants}
									setModalOpen={setModalOpen}
									speakers={speakers}
									muteUser={onMuteUserClick}
									isPermitted={currentUserData.CurrentUser.Role.includes('Admin')}
									blocked={blocked}
								/>
							</div>

							<div className=' hidden md:block h-full md:col-span-2 lg:col-span-1 p-4 '>
								<NewStreamParticipantList
									participants={participants}
									currentUser={user}
									leaveEvent={handleLeave}
									sendMessage={handleSendMessage}
									messages={messages}
									setMessages={setMessages}
									speakers={speakers}
									role={role}
								/>
							</div>

							<Modal isOpen={modalOpen}>
								<Modal.Header bgColor='bg-system-primary-accent-dim'>
									<div className='flex w-full items-center justify-end'>
										<button
											onClick={() => {
												setModalOpen(false)
											}}>
											<img src={close} className='h-6  cursor-pointer' alt='' />
										</button>
									</div>
								</Modal.Header>
								<Modal.Body bgColor='bg-system-primary-accent-dim'>
									<NewStreamParticipantList
										participants={participants}
										currentUser={user}
										leaveEvent={handleLeave}
										sendMessage={handleSendMessage}
										messages={messages}
										setMessages={setMessages}
										speakers={speakers}
										role={role}
									/>
								</Modal.Body>
							</Modal>
						</div>
						{/* */}
					</div>
				</div>
			) : (
				<>
					<div className='h-full overflow-hidden relative '>
						<JoinToStream
							event={event}
							appId={appId}
							channel={channel}
							token={rtcToken}
							setAppId={setAppId}
							setCalling={rtmConnect}
							setChannel={setChannel}
							setToken={setRtcToken}
						/>
					</div>
				</>
			)}
		</>
	)
}

export default NewStreaming
