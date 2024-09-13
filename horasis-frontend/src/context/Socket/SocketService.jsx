import { useContext } from 'react'
import { createContext } from 'react'

const SocketContext = createContext()
export const useSocket = () => useContext(SocketContext)
export default SocketContext
