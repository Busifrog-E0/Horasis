import { useState, useEffect } from 'react'
import { useRTMClient } from './AgoraRTMProvider'

export const useRTMChannel = (channelName) => {
	const { client } = useRTMClient()
	const [channel, setChannel] = useState(null)
	const [isJoined, setIsJoined] = useState(false)

	useEffect(() => {
		const joinChannel = async () => {
			try {
				if (client) {
					const newChannel = client.createChannel(channelName)
					await newChannel.join()
					setChannel(newChannel)
					setIsJoined(true)
					console.log(`Joined RTM channel: ${channelName}`)
				}
			} catch (error) {
				console.error('Failed to join channel:', error)
			}
		}

		if (channelName && !isJoined) {
			joinChannel()
		}

		return () => {
			if (channel) {
				channel.leave().then(() => {
					console.log(`Left RTM channel: ${channelName}`)
					setIsJoined(false)
				})
			}
		}
	}, [client, channelName, channel, isJoined])

	return { channel, isJoined }
}
