import { useState } from 'react'
import { useToast } from '../components/Toast/ToastService'
import { patchItem } from '../constants/operations'
import { useSuperAuth } from '../context/SuperAdmin/SuperAuthService'

export default function useUpdateDataSuperadmin({ onSuccess = () => {}, onError = () => {} } = {}) {
	const { updateCurrentUser, currentUserData } = useSuperAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)

	const updateData = ({ endpoint, payload, onsuccess = () => {}, onerror = () => {} }) => {
		setIsLoading(true)
		patchItem(
			`${endpoint}`,
			payload,
			(result) => {
				onsuccess(result)
				onSuccess(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from patch single item')
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
		updateData,
	}
}
