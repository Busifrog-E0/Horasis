import { useState } from 'react'
import { deleteItem } from '../constants/operations'
import { useSuperAuth } from '../context/SuperAdmin/SuperAuthService'
import { useToast } from '../components/Toast/ToastService'

export default function useDeleteDataSuperadmin(endpoint = '', { onSuccess = () => {}, onError = () => {} } = {}) {
	const { updateCurrentUser, currentUserData } = useSuperAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)

	const deleteData = ({ endPoint = '', onsuccess = () => {}, onerror = () => {} } = {}) => {
		const api = endPoint ? endPoint : endpoint
		setIsLoading(true)
		deleteItem(
			`${api}`,
			(result) => {
				onsuccess(result)
				onSuccess(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from delete single item')
				onerror(err)
				onError(err)
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast,
      'admin'
		)
	}
	return {
		isLoading,
		deleteData,
	}
}
