import { useEffect, useState } from 'react'
import ChatPopupContext from './ChatPopupService'

const ChatPopupProvider = ({ children }) => {
	const [userIds, setUserIds] = useState([])
	const [convList, setConvList] = useState([])

	const addConversation = (convId) => {
		if (!convList.includes(convId)) {
			if (convList.length > 2) {
				removeConversation(convList[0])
			}
		}
		setConvList((prev) => [...prev, convId])
	}

	const removeConversation = (convId) => {
		const newConvList = convList.filter((conv) => conv !== convId)
		setConvList(newConvList)
	}
	const addUser = (userId) => {
		if (!userIds.includes(userId)) {
			if (userIds.length > 2) {
				removeUser(userIds[0],'')
			}
			setUserIds((prev) => [...prev, userId])
		}
	}

	const removeUser = (userId,convId) => {
		const newList = userIds.filter((user) => user !== userId)
		setUserIds(newList)
		removeConversation(convId)
	}

	return (
		<ChatPopupContext.Provider
			value={{ userIds, setUserIds, addUser, removeUser, convList, setConvList, addConversation, removeConversation }}>
			{children}
		</ChatPopupContext.Provider>
	)
}

export default ChatPopupProvider
