import { useState } from 'react'
import { useAuth } from '../utils/AuthProvider'
import usePostData from './usePostData'
import { useToast } from '../components/Toast/ToastService'

const useEntityReportManager = ({ EntityId, Type, successCallback, errorCallback }) => {
	const { currentUserData } = useAuth()
	const toast = useToast()

	const [reportData, setReportData] = useState({ Content: '', ReportType: '' })

	const handleChange = (key, value) => {
		setReportData({ ...reportData, [key]: value })
	}
	const resetState = () => setReportData({ Content: '', ReportType: '' })

	const onsuccess = (result) => {
		if (result === true) {
			toast.open('success', 'Reported', 'The content has been reported')
			successCallback()
		}
	}

	const onerror = (err) => errorCallback(err)

	const { isLoading: isReporting, postData } = usePostData({ onSuccess: onsuccess, onError: onerror })

	const reportEntity = () =>
		postData({
			endpoint: `reports`,
			payload: {
				EntityId,
				Type,
				UserId: currentUserData.CurrentUser.UserId,
				...reportData,
			},
		})

	return { isReporting, reportEntity, reportData, handleChange, resetState }
}

export default useEntityReportManager
