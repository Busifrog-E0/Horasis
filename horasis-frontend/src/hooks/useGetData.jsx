import { useEffect, useState } from 'react'
import { useToast } from '../components/Toast/ToastService'
import { getItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'

export default function useGetData(endpoint, { onSuccess = () => {}, onError = () => {} } = {}, fetchOnRender = true) {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [data, setData] = useState()
	const [isLoading, setIsLoading] = useState(fetchOnRender)

	const getData = (endPoint = '',onsuccess=()=>{},onerror=()=>{}) => {
		const query = endPoint !== '' ? endPoint : endpoint
		setIsLoading(true)
		getItem(
			query,
			(result) => {
				setData(result)
				onsuccess(result)
				onSuccess(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err, 'error from get list')
				onError(err)
				onerror(err)
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		if (fetchOnRender === true) {
			getData()
		}
	}, [])

	return {
		data,
		isLoading,
		getData,
		setData,
		setIsLoading,
	}
}
