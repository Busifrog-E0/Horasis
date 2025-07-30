import { createContext, useContext } from 'react'
const FollowContext = createContext()
export const useFollow = () => useContext(FollowContext)
export default FollowContext
