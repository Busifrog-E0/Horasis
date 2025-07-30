import { createContext, useContext } from 'react'
const ChatPopupContext = createContext()
export const useChatPopup = () => useContext(ChatPopupContext)
export default ChatPopupContext
