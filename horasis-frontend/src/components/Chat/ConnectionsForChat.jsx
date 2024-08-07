import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { getItem } from '../../constants/operations'
import { getNextId } from '../../utils/URLParams'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import EmptyMembers from '../Common/EmptyMembers'
import Spinner from '../ui/Spinner'
import ChatDetailsItem from './ChatDetailsItem'
import { useSocket } from '../../context/Socket/SocketService'
import { useNavigate } from 'react-router-dom'
import { useChatPopup } from '../../context/ChatPopup/ChatPopupService'

const ConnectionsForChat = ({ connectionsForChat, isLoading, isLoadingMore, pageDisabled, fetchMore, setIsOpen }) => {
	const { currentUserData } = useContext(AuthContext)
	const { addUser,setActiveChat } = useChatPopup()
	const navigate = useNavigate()
	const navigateToChat = (userId) => {
		// navigate(`/Chat/${userId}`)
		addUser(userId)
		setActiveChat(userId)
		setIsOpen(false)
	}
	if (isLoading) {
		return <Spinner />
	}
	return (
		<div className='max-h-96 overflow-y-auto' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
			{connectionsForChat ? (
				<>
					{connectionsForChat.length > 0 ? (
						<>
							{connectionsForChat.map((item, index) => {
								let lastElement = connectionsForChat.length === index + 1
								const receiver = item.UserDetails.find((item) => item.DocId !== currentUserData.CurrentUser.UserId)
								return (
									<ChatDetailsItem user={receiver} conversation={item} key={item.DocId} onChatClick={navigateToChat} />
								)
							})}
						</>
					) : (
						<>
							<EmptyMembers emptyText={'No recent chats'} />
						</>
					)}
				</>
			) : (
				<></>
			)}

			{isLoadingMore && (
				<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
					<Spinner />
				</div>
			)}
			{!pageDisabled && (
				<div
					onClick={() => {
						fetchMore()
					}}
					className='flex flex-row justify-center mt-2 mb-2'>
					<div className='cursor-pointer flex items-center gap-2'>
						<h4 className='text-sm font-medium text-system-primary-accent'>Load more messages</h4>
					</div>
				</div>
			)}
		</div>
	)
}

export default ConnectionsForChat
