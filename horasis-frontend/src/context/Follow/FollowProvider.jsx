import { useToast } from '../../components/Toast/ToastService'
import useDeleteData from '../../hooks/useDeleteData'
import useGetData from '../../hooks/useGetData'
import usePostData from '../../hooks/usePostData'
import { useAuth } from '../../utils/AuthProvider'
import FollowContext from './FollowService'

const FollowProvider = ({ children }) => {
	const { currentUserData } = useAuth()
	const toast = useToast()

	const {
		isLoading: isCountLoading,
		data: followCount,
		getData: getFollowCount,
	} = useGetData(`users/${currentUserData?.CurrentUser?.UserId}/follow/count`, {}, false)

	const { isLoading: isFollowLoading, postData: postFollow } = usePostData()
	const { isLoading: isUnfollowLoading, deleteData: deleteUnfollow } = useDeleteData()

	const followUser = (profile, followCallback = () => {}, setLoading = () => {}) => {
		setLoading(true)
		postFollow({
			endpoint: `follow`,
			payload: { FolloweeId: profile.DocId },
			onsuccess: (result) => {
				if (result === true) {
					setLoading(false)
					followCallback()
					getFollowCount()
					toast.open('success', 'Started following', `You have started following ${profile.FullName}`)
				}
			},
			onerror: (err) => {
				setLoading(false)
			},
		})
	}

	const unFollowUser = (profile, unFollowCallback = () => {}, setLoading = () => {}) => {
		setLoading(true)
		deleteUnfollow({
			endPoint: `users/${currentUserData?.CurrentUser?.UserId}/follow/${profile.DocId}`,
			onsuccess: (result) => {
				if (result === true) {
					unFollowCallback()
					getFollowCount()
					toast.open('info', 'Unfollowed', `You have unfollowed ${profile.FullName}`)
				}
				setLoading(false)
			},
			onerror: (err) => {
				setLoading(false)
			},
		})
	}

	return (
		<FollowContext.Provider
			value={{
				followCount,
				getFollowCount,
				followUser,
				unFollowUser,
				isCountLoading,
				isFollowLoading,
				isUnfollowLoading,
			}}>
			{children}
		</FollowContext.Provider>
	)
}

export default FollowProvider
