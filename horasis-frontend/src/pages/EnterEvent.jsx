import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/ui/Spinner'
import usePostData from '../hooks/usePostData'
import { useEffect } from 'react'
import { useAuth } from '../utils/AuthProvider'

const EnterEvent = () => {
	const navigate = useNavigate()
	const { updateCurrentUser } = useAuth()

	const { DocumentID } = useParams()

	const { isLoading, postData } = usePostData({
		onSuccess: (result) => {
			updateCurrentUser(result.TokenData)
			navigate(`/EnterEvent/Events/${result.EventId}/join`, { state: { Event: result.Event } })
		},
	})

	useEffect(() => {
		postData({
			endpoint: `guest/speaker/${DocumentID}`,
			payload: {},
		})
	}, [])
	return (
		<div className='flex flex-col items-center justify-center h-[100svh] gap-2'>
			<Spinner />
			<p className='font-medium text-2xl text-system-primary-accent'>Connecting the Horasis Event...</p>
		</div>
	)
}

export default EnterEvent
