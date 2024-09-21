import { useToast } from '../components/Toast/ToastService'
import { postItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { useState } from 'react'

export default function usePostData(callback = () => {}) {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)

	const postData = ({ endpoint, payload }) => {
		setIsLoading(true)
		postItem(
			`${endpoint}`,
			payload,
			(result) => {
				callback(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from post single item')
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
