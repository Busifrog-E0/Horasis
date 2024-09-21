import { useState } from 'react'
import { deleteItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'

export default function useDeleteItem(endpoint, callback = () => {}) {
	const { updateCurrentUser, currentUserData } = useAuth()
	const [isLoading, setIsLoading] = useState(false)

	const deleteData = () => {
		setIsLoading(true)
		deleteItem(
			`${endpoint}`,
			(result) => {
				callback()
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from delete single item')
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData
		)
	}
	return {
		isLoading,
		deleteData,
	}
}
