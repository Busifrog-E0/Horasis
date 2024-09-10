import { useState, useEffect } from 'react'
import AgoraRTM from 'agora-rtm-sdk'
import { useRTMClient } from './AgoraRTMProvider' // Import RTM client context

export const useRTMJoin = ({ appId, uid, token, channelName }) => {
	const { client, setClient } = useRTMClient() // Access client from context
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [channel, setChannel] = useState(null)
	const [isJoined, setIsJoined] = useState(false)

	useEffect(() => {
		const initializeAndLogin = async () => {
			try {
				if (!client) {
					const newClient = AgoraRTM.createInstance(appId)
					setClient(newClient)
				}
// 206c8a92da8d4676aabfb8314a21fa17
				if (client) {
					await client.login({ token, uid })
					setIsLoggedIn(true)
					console.log('RTM login successful!')

					// Join the channel after logging in
					if (channelName) {
						const newChannel = client.createChannel(channelName)
						await newChannel.join()
						setChannel(newChannel)
						setIsJoined(true)
						console.log(`Joined RTM channel: ${channelName}`)
					}
				}
			} catch (error) {
				console.error('RTM login or channel join failed:', error)
			}
		}

		if (!isLoggedIn) {
			initializeAndLogin()
		}

		return () => {
			if (channel) {
				channel.leave().then(() => {
					console.log(`Left RTM channel: ${channelName}`)
					setIsJoined(false)
				})
			}

			if (client && isLoggedIn) {
				client.logout().then(() => console.log('Logged out of RTM'))
			}
		}
	}, [appId, uid, token, channelName, client, setClient, isLoggedIn, channel])

	return { isLoggedIn, channel, isJoined }
}
