import { useContext, useEffect, useState } from 'react'
import SocketContext from './SocketService'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../../components/Toast/ToastService'
import { io } from 'socket.io-client'
import { useChatPopup } from '../ChatPopup/ChatPopupService'

const URL = 'https://deploy.busifrog.com'
const SocketProvider = ({ children }) => {
	// context
	const { currentUserData } = useContext(AuthContext)
	const { convList } = useChatPopup()

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
			reconnectionAttempts: Infinity, // Number of reconnection attempts
			reconnectionDelay: 1000, // Delay between reconnection attempts
			reconnectionDelayMax: 5000,
			randomizationFactor: 0.5,
		})

		setSocket(newSocket)

		newSocket.on('connect', () => {
			// console.log('Socket connected')
			convList.map((conv) => {
				newSocket.emit('JoinRoom', { ConversationId: conv })
			})
		})

		newSocket.on('connect_error', (err) => {
			// console.log(err)
		})

		newSocket.on('disconnect', (reason) => {
			// console.log('Socket disconnected')
			// console.warn('Socket disconnected', reason)
			if (reason === 'io server disconnect') {
				newSocket.connect()
			}
		})

		newSocket.on('reconnect_attempt', (attemptNumber) => {
			console.log(`Reconnection attempt #${attemptNumber}`)
		})

		return () => {
			newSocket.disconnect()
		}
	}

	useEffect(() => {
		const cleanup = connectSocket()
		return cleanup
	}, [currentUserData?.Token, convList])

	return <SocketContext.Provider value={{ socket, setSocket, connectSocket }}>{children}</SocketContext.Provider>
}

export default SocketProvider
