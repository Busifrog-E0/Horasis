import { useState } from 'react'
import ChatPopupContext from './ChatPopupService'

const ChatPopupProvider = ({ children }) => {
	const [userIds, setUserIds] = useState([])
  const [activeChat, setActiveChat] = useState(null)
	const addUser = (userId) => {
		if (!userIds.includes(userId)) {
			if (userIds.length > 2) {
				removeUser(userIds[0])
			}
			setUserIds((prev) => [...prev, userId])
		}
		setActiveChat(userId) // Set the newly added chat as the active chat on mobile
	}

	const removeUser = (userId) => {
		const newList = userIds.filter((user) => user !== userId)
		setUserIds(newList)
		if (activeChat === userId) {
			setActiveChat(null) // Clear active chat if it is being removed
		}
	}
	return (
		<ChatPopupContext.Provider value={{ userIds, setUserIds, addUser, removeUser,activeChat,setActiveChat }}>
			{children}
		</ChatPopupContext.Provider>
	)
}

export default ChatPopupProvider
