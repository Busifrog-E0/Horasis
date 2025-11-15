import { useToast } from '../components/Toast/ToastService'
import { postItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { useState } from 'react'
import { runOnce } from '../utils/runOnce'

export default function usePostData({ onSuccess = () => {}, onError = () => {}, initialLoading = false } = {}) {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(initialLoading)

	const postData = runOnce(({ endpoint, payload, onsuccess = () => {}, onerror = () => {} }) => {
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
	})

	return {
		isLoading,
		postData,
		setIsLoading,
	}
}
