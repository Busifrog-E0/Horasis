import { useContext, useEffect, useState } from 'react'
import SocketContext from './SocketService'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../../components/Toast/ToastService'
import { io } from 'socket.io-client'

const URL = 'https://deploy.busifrog.com'
const SocketProvider = ({ children }) => {
	// context
	const { currentUserData } = useContext(AuthContext)

	// socket
	const [socket, setSocket] = useState(null)

	// socket connection function
	const connectSocket = () => {
		if (!currentUserData?.Token) {
			console.error('Token is not available')
			return
		}
		const newSocket = io(URL, {
			auth: {
				token: `Bearer ${currentUserData.Token}`,
			},
			reconnection: true, // Enable reconnection
			reconnectionAttempts: 3, // Number of reconnection attempts
			reconnectionDelay: 1000, // Delay between reconnection attempts
		})

		setSocket(newSocket)

		newSocket.on('connect', () => {
			// console.log('Socket connected')
		})

		newSocket.on('connect_error', (err) => {
			// console.log(err)
		})

		newSocket.on('disconnect', () => {
			// console.log('Socket disconnected')
			const newSocket = io(URL, {
				auth: {
					token: `Bearer ${currentUserData.Token}`,
				},
				reconnection: true, // Enable reconnection
				reconnectionAttempts: 3, // Number of reconnection attempts
				reconnectionDelay: 1000, // Delay between reconnection attempts
			})
	
			setSocket(newSocket)
		})

		return () => {
			newSocket.disconnect()
		}
	}

	useEffect(() => {
		const cleanup = connectSocket()
		return cleanup
	}, [currentUserData?.Token])

	return <SocketContext.Provider value={{ socket, setSocket, connectSocket }}>{children}</SocketContext.Provider>
}

export default SocketProvider
