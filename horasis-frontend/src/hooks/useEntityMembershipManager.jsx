import { useAuth } from '../utils/AuthProvider'
import useDeleteData from './useDeleteData'
import usePostData from './usePostData'
import useUpdateData from './useUpdateData'

const useEntityMembershipManager = ({ EntityId, Type, successCallback, errorCallback }) => {
	const { currentUserData } = useAuth()
	const onsuccess = (result) => {
		if (result === true || typeof result === 'object') successCallback()
	}
	const onerror = (err) => errorCallback(err)

	const { isLoading: isJoining, postData } = usePostData({ onSuccess: onsuccess, onError: onerror })

	const { isLoading: isLeaving, deleteData } = useDeleteData('', {
		onSuccess: onsuccess,
		onError: onerror,
	})

	const { isLoading: isAccepting, updateData } = useUpdateData({ onSuccess: onsuccess, onError: onerror })

	const subscribeEntityMembership = () => postData({ endpoint: `members/${EntityId}/join`, payload: { Type } })

	const unsubscribeEntityMembership = () => deleteData({ endPoint: `members/${EntityId}/leave` })

	const cancelEntityMembershipSubscription = () =>
		deleteData({ endPoint: `members/${EntityId}/join/${currentUserData.CurrentUser.UserId}/cancel` })

	const acceptEntityMembershipInvitation = () =>
		updateData({ endpoint: `members/${EntityId}/invite/accept`, payload: {Type} })

	const rejectEntityMembershipInvitation = () =>
		deleteData({ endPoint: `members/${EntityId}/invite/${currentUserData.CurrentUser.UserId}/reject` })

	return {
		isLoading: isAccepting || isLeaving || isJoining,
		subscribeEntityMembership,
		unsubscribeEntityMembership,
		cancelEntityMembershipSubscription,
		acceptEntityMembershipInvitation,
		rejectEntityMembershipInvitation,
	}
}

export default useEntityMembershipManager
