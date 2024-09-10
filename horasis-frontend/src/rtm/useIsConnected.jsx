// useIsConnected.js
import { useState, useEffect } from 'react'
import { useRTMClient } from './AgoraRTMProvider' // Import RTM client context

export const useIsConnected = () => {
	const { client } = useRTMClient()
	const [isConnected, setIsConnected] = useState(false)

	useEffect(() => {
		if (!client) return

		// Function to handle connection status
		const handleConnectionStateChange = (state) => {
			setIsConnected(state === 'CONNECTED')
		}

		// Set initial connection state
		handleConnectionStateChange(client.getConnectionState())

		// Subscribe to connection state changes
		client.on('ConnectionStateChanged', handleConnectionStateChange)

		// Clean up: unsubscribe from connection state changes on component unmount
		return () => {
			client.off('ConnectionStateChanged', handleConnectionStateChange)
		}
	}, [client])

	return isConnected
}
