import { useToast } from '../components/Toast/ToastService'
import { postItem } from '../constants/operations'
import { useSuperAuth } from '../context/SuperAdmin/SuperAuthService'
import { useState } from 'react'

export default function usePostDataSuperadmin({ onSuccess = () => {}, onError = () => {} } = {}) {
	const { updateCurrentUser, currentUserData } = useSuperAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)

	const postData = ({ endpoint, payload, onsuccess = () => {}, onerror = () => {} }) => {
		setIsLoading(true)
		postItem(
			`${endpoint}`,
			payload,
			(result) => {
				onsuccess(result)
				onSuccess(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from post single item')
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
		postData,
	}
}
