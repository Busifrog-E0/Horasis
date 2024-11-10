import { useState } from 'react'
import { deleteItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { useToast } from '../components/Toast/ToastService'

export default function useDeleteData(endpoint = '', { onSuccess = () => {}, onError = () => {} } = {}) {
	const { updateCurrentUser, currentUserData } = useAuth()
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
			toast
		)
	}
	return {
		isLoading,
		deleteData,
	}
}
