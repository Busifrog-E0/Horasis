import useDeleteData from './useDeleteData'
import usePostData from './usePostData'
import useUpdateData from './useUpdateData'

const useEntityOrganizationManager = ({ EntityId, UserId, Type, successCallback, errorCallback }) => {
	const onsuccess = (result) => {
		if (result === true || typeof result === 'object') successCallback()
	}

	const onerror = (err) => errorCallback(err)

	const { isLoading: isPostLoading, postData } = usePostData({ onSuccess: onsuccess, onError: onerror })

	const { isLoading: isDeleteLoading, deleteData } = useDeleteData('', { onSuccess: onsuccess, onError: onerror })

	const { isLoading: isUpdateLoading, updateData } = useUpdateData({ onSuccess: onsuccess, onError: onerror })

	const sendEntityMembershipInvitation = () =>
		postData({ endpoint: `members/${EntityId}/invite/${UserId}`, payload: { Type } })

	const cancelEntityMembershipInvitation = () => deleteData({ endPoint: `members/${EntityId}/invite/${UserId}/cancel` })

	const acceptEntityMembershipRequest = () =>
		updateData({ endpoint: `members/${EntityId}/join/${UserId}/accept`, payload: { Type } })

	const rejectEntityMembershipRequest = () => deleteData({ endPoint: `members/${EntityId}/join/${UserId}/reject` })

	return {
		isLoading: isPostLoading || isDeleteLoading || isUpdateLoading,
		sendEntityMembershipInvitation,
		cancelEntityMembershipInvitation,
		acceptEntityMembershipRequest,
		rejectEntityMembershipRequest,
	}
}

export default useEntityOrganizationManager
