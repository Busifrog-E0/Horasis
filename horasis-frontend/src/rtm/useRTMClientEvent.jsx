// useRTMClientEvent.js
import { useEffect } from 'react'
import { useRTMClient } from './AgoraRTMProvider' // Import RTM client context

export const useRTMClientEvent = (eventName, callback) => {
	const { client } = useRTMClient()
	useEffect(() => {
		if (!client) return

		// Subscribe to the RTM client event
		client.on(eventName, callback)

		// Clean up: unsubscribe from the event on component unmount
		return () => {
			client.off(eventName, callback)
		}
	}, [client, eventName, callback])
}
