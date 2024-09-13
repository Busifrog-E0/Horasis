import { useContext } from 'react'
import { createContext } from 'react'

const SuperAuthContext = createContext()
export const useSuperAuth = () => useContext(SuperAuthContext)
export default SuperAuthContext
