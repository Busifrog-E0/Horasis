import { useEffect, useState } from 'react'
import { useToast } from '../components/Toast/ToastService'
import { getItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'

export default function useGetData(endpoint) {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [data, setData] = useState()
	const [isLoading, setIsLoading] = useState(true)

	const getData = () => {
		const query = endpoint
		setIsLoading(true)
		getItem(
			query,
			(result) => {
				setData(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from get list')
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getData()
	}, [])

	return {
		data,
		isLoading,
		getData,
	}
}
