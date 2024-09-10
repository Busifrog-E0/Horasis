import { useIsConnected, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRTCClient } from 'agora-rtc-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../components/Toast/ToastService'
import { getItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import AgoraRTM from 'agora-rtm-sdk'
import Button from '../components/ui/Button'
import StreamParticipantList from '../components/Streaming/StreamParticipantList'
import StreamUsersList from '../components/Streaming/StreamUsersList'
import NewStreamParticipantList from '../components/NewStreaming/NewStreamParticipantList'
import JoinToStream from '../components/Streaming/JoinToStream'
import NewStreamUsersList from '../components/NewStreaming/NewStreamUsersList'

const NewStreaming = () => {
	// context and params
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const { eventid } = useParams()
	const navigate = useNavigate()

	// join parameters
	const [appId, setAppId] = useState('206c8a92da8d4676aabfb8314a21fa17')
	const [channel, setChannel] = useState(eventid)
	const [rtcToken, setRtcToken] = useState('')
	const [rtmToken, setRtmToken] = useState('')

	// roles and user and event
	const [role, setRole] = useState('Member')
	const [user, setUser] = useState({})
	const [event, setEvent] = useState({})
	const [participants, setParticipants] = useState([])
	const [messages, setMessages] = useState([])
	// clients
	const rtcClient = useRTCClient()
	const [rtmClient, setRtmClient] = useState(null)
	const [isCalling, setIsCalling] = useState(false)
	const isConnected = useIsConnected()

	// loading
	const [isLoadingToken, setIsLoadingToken] = useState(true)
	const [isLoadingUser, setIsLoadingUser] = useState(true)
	const [isLoadingEvent, setIsLoadingEvent] = useState(true)

	// mic and camera
	const [micOn, setMic] = useState(true)
	const [cameraOn, setCamera] = useState(true)
	const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn)
	const { localCameraTrack } = useLocalCameraTrack(cameraOn)
	usePublish([localMicrophoneTrack, localCameraTrack])

	// fetch  token from backend
	const getUser = () => {
		setIsLoadingUser(true)
		getItem(
			`users/${currentUserData.CurrentUser.UserId}`,
			(result) => {
				setIsLoadingUser(false)
				setUser(result)
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
		getEvent()
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
				setParticipants(parts)
			}
			if (action === 'REMOTE_LEAVE') {
				await handleGetUsers(newRtmClient)
			}

			if (action === 'REMOTE_STATE_CHANGED') {
				if (states.UserName !== undefined && states.UserAvatar !== undefined && states.UserRtcUid !== undefined && states.UserId !== undefined) {
					setParticipants((prev) => [...prev, states])
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
				setMessages((prev) => [...prev, messageData])
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
			setParticipants(parts)
			console.log(parts)
		} catch (status) {
			console.log(status)
		}
	}

	const handleUserJoinPresence = async (rtmClient) => {
		var newState = { UserId: currentUserData?.CurrentUser?.UserId, UserName: user?.FullName, UserRtcUid: currentUserData?.CurrentUser?.UserId, UserAvatar: user?.ProfilePicture }

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
			console.log(result)
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
	}

	const handleSendMessage = async (messagePayload) => {
		try {
			const result = await rtmClient.publish(eventid, messagePayload)
			console.log(result)
		} catch (status) {
			console.log(status)
		}
	}

	// initialize rtc
	const {} = useJoin({ uid: currentUserData.CurrentUser.UserId, appid: appId, channel: channel, token: rtcToken ? rtcToken : null }, isCalling, rtcClient ? rtcClient : null)
	useEffect(() => {
		if (isConnected) {
			if (role === 'Speaker') rtcClient.setClientRole('host')
			else rtcClient.setClientRole('audience')
		}
	}, [isConnected])
	// getChannelMembers
	// const getChannelMembers = async (rtmChannel, rtmClient) => {
	// 	let members = await rtmClient.storage.getChannelMetadata(eventid, 'MESSAGE')
	// 	let parts = Object.keys(members.metadata).map((id) => JSON.parse(members.metadata[id].value))
	// 	setParticipants(parts)
	// }
	// leave rtc and rtm channel
	return (
		<>
			{isLoadingEvent || isLoadingToken || isLoadingUser ? (
				<>
					<div className='flex items-center justify-center h-full'>
						<div className='text-xl font-semibold text-gray-700'>Loading...</div>
					</div>
				</>
			) : isConnected ? (
				<>
					<div className='bg-system-primary-darker-accent h-full overflow-hidden'>
						<div className='h-full grid grid-cols-4'>
							<div className='col-span-3 p-4 overflow-hidden h-full'>
								<NewStreamUsersList event={event} cameraOn={cameraOn} micOn={micOn} localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack} setCamera={setCamera} isConnected={isConnected} calling={isCalling} setMic={setMic} setCalling={handleLeave} role={role} currentUser={user} participants={participants} />
							</div>

							<div className=' h-full col-span-1 p-4 '>
								<NewStreamParticipantList participants={participants} currentUser={user} leaveEvent={handleLeave} sendMessage={handleSendMessage} messages={messages} setMessages={setMessages} />
							</div>
						</div>
						{/* */}
					</div>
				</>
			) : (
				<>
					<div className='h-full overflow-hidden relative'>
						<JoinToStream event={event} appId={appId} channel={channel} token={rtcToken} setAppId={setAppId} setCalling={rtmConnect} setChannel={setChannel} setToken={setRtcToken} />
					</div>
				</>
			)}
		</>
	)
}

export default NewStreaming
