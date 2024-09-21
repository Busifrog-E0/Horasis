import { useToast } from '../components/Toast/ToastService'
import { postItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { useState } from 'react'

export default function usePostData({ onSuccess = () => {}, onError = () => {} }) {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)

	const postData = ({ endpoint, payload }) => {
		setIsLoading(true)
		postItem(
			`${endpoint}`,
			payload,
			(result) => {
				onSuccess(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from post single item')
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
