import useDeleteData from './useDeleteData'
import usePostData from './usePostData'

const useEntityLikeManager = ({ EntityId, Type, successCallback, errorCallback }) => {
	const onsuccess = (result) => {
		if (result === true) successCallback()
	}
	const onerror = (err) => errorCallback(err)

	const { isLoading: isLiking, postData } = usePostData({
		onSuccess: onsuccess,
		onError: onerror,
	})

	const { isLoading: isUnliking, deleteData } = useDeleteData(`likes/${EntityId}`, {
		onSuccess: onsuccess,
		onError: onerror,
	})

	const likeEntity = () => postData({ endpoint: `likes`, payload: { EntityId, Type } })

	const unlikeEntity = () => deleteData({})

	return {
		isLiking,
		isUnliking,
		likeEntity,
		unlikeEntity,
	}
}

export default useEntityLikeManager
