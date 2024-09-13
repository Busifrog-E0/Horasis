import { useContext, useState } from 'react'
import FollowContext from './FollowService'
import { AuthContext } from '../../utils/AuthProvider'
import { deleteItem, getItem, postItem } from '../../constants/operations'
import { useToast } from '../../components/Toast/ToastService'

const FollowProvider = ({ children }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()

	const [followCount, setFollowCount] = useState()
	const followUser = (profile, followCallback = () => {}, setLoading = () => {}) => {
		setLoading(true)
		postItem(
			'follow',
			{ FolloweeId: profile.DocId },
			(result) => {
				if (result === true) {
					followCallback()
					getFollowCount()
					toast.open('success', 'Started following', `You have started following ${profile.FullName}`)
				}
				setLoading(false)
			},
			(err) => {
				// toast.open('error','Follow',`Some error happened while following`)
				setLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const unFollowUser = (profile, unFollowCallback = () => {}, setLoading = () => {}) => {
		setLoading(true)
		deleteItem(
			`users/${currentUserData.CurrentUser.UserId}/follow/${profile.DocId}`,
			(result) => {
				if (result === true) {
					unFollowCallback()
					getFollowCount()
					toast.open('info', 'Unfollowed', `You have unfollowed ${profile.FullName}`)
				}
				setLoading(false)
			},
			(err) => {
				// toast.open('error','Unfollow',`Some error happened while unfollowing`)
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
