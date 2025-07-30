import useDeleteData from './useDeleteData'
import usePostData from './usePostData'

const useEntitySaveManager = ({ EntityId, Type, successCallback, errorCallback }) => {
	const onsuccess = (result) => {
		if (result === true) successCallback()
	}
	const onerror = (err) => errorCallback(err)

	const { isLoading: isSaving, postData } = usePostData({
		onSuccess: onsuccess,
		onError: onerror,
	})

	const { isLoading: isUnsaving, deleteData } = useDeleteData(`saves/${EntityId}`, {
		onSuccess: onsuccess,
		onError: onerror,
	})

	const saveEntity = () => postData({ endpoint: `saves`, payload: { EntityId, Type } })

	const unsaveEntity = () => deleteData({})

	return { isSaving, isUnsaving, saveEntity, unsaveEntity }
}

export default useEntitySaveManager
