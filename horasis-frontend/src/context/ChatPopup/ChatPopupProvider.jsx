import { useState } from 'react'
import ChatPopupContext from './ChatPopupService'

const ChatPopupProvider = ({ children }) => {
	const [userIds, setUserIds] = useState([])
	const addUser = (userId) => {
		if (!userIds.includes(userId)) {
			if (userIds.length > 2) {
				removeUser(userIds[0])
			}
			setUserIds((prev) => [...prev, userId])
		}
	}

	const removeUser = (userId) => {
		const newList = userIds.filter((user) => user !== userId)
		setUserIds(newList)
	}
	return (
		<ChatPopupContext.Provider value={{ userIds, setUserIds, addUser, removeUser }}>
			{children}
		</ChatPopupContext.Provider>
	)
}

export default ChatPopupProvider
