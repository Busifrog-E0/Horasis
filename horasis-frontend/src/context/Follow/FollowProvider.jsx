import { useContext, useState } from 'react'
import FollowContext from './FollowService'
import { AuthContext } from '../../utils/AuthProvider'
import { deleteItem, getItem, postItem } from '../../constants/operations'
import { useToast } from '../../components/Toast/ToastService'

const FollowProvider = ({ children }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()

	const [followCount, setFollowCount] = useState()
	const followUser = (userId, followCallback = () => {}, setLoading = () => {}) => {
		setLoading(true)
		postItem(
			'follow',
			{ FolloweeId: userId },
			(result) => {
				if (result === true) {
					followCallback()
					getFollowCount()
					toast.open('success', 'Followed', `Followed user`)
				}
				setLoading(false)
			},
			(err) => {
				setLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const unFollowUser = (userId, unFollowCallback = () => {}, setLoading = () => {}) => {
		setLoading(true)
		deleteItem(
			`users/${currentUserData.CurrentUser.UserId}/follow/${userId}`,
			(result) => {
				if (result === true) {
					unFollowCallback()
					getFollowCount()
					toast.open('info', 'Unfollowed', `Unfollowed user`)
				}
				setLoading(false)
			},
			(err) => {
				setLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getFollowCount = (setLoading = () => {}) => {
		setLoading(true)
		getItem(
			`users/${currentUserData.CurrentUser.UserId}/follow/count`,
			(result) => {
				setLoading(false)
				setFollowCount(result)
			},
			(err) => {
				setLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<FollowContext.Provider value={{ followCount, getFollowCount, followUser, unFollowUser }}>
			{children}
		</FollowContext.Provider>
	)
}

export default FollowProvider
