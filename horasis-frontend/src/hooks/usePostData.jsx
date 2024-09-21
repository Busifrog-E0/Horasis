import { useToast } from '../components/Toast/ToastService'
import { postItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { useState } from 'react'

export default function usePostData({ onSuccess = () => {}, onError = () => {} } = {}) {
	const { updateCurrentUser, currentUserData } = useAuth()
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
			toast
		)
	}

	return {
		isLoading,
		postData,
	}
}
