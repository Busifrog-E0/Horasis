import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../../utils/AuthProvider'

const DiscussionSearchSectionTab = ({ lastElement, insight, updateList, whichTime, updatingId, tabName }) => {
	const { currentUserData } = useContext(AuthContext)
	const navigate = useNavigate()
	const goToPost = () => {
		// if (profile) {
		// 	if (profile.DocId === currentUserData.CurrentUser.UserId) {
		// 		navigate(`/MyProfile`)
		// 	} else {
		// 		navigate(`/ViewProfile/${profile.DocId}`)
		// 	}
		// }
	}

	const whichTimeAgo = {
		member: 'CreatedIndex',
		followed: 'FollowedIndex',
		following: 'FollowingIndex',
		connection: 'ConnectionIndex',
	}

	return (
		<>

		</>
	)
}

export default DiscussionSearchSectionTab
