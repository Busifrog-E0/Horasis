import { useState } from 'react'
import { useAuth } from '../utils/AuthProvider'
import { patchItem } from '../constants/operations'

export default function usePatchItem(callback = () => {}) {
	const { updateCurrentUser, currentUserData } = useAuth()
	const [isLoading, setIsLoading] = useState(false)

	const updateData = ({ endpoint, payload }) => {
		setIsLoading(true)
		patchItem(
			`${endpoint}`,
			payload,
			(result) => {
				callback(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from patch single item')
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData
		)
	}

	return {
		isLoading,
		updateData,
	}
}
