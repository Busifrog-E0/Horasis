import { Navigate, useSearchParams } from 'react-router-dom'
import Spinner from '../components/ui/Spinner'
import { useEffect, useState } from 'react'
import Logo from '../components/Common/Logo'
import usePostData from '../hooks/usePostData'

export default function RegisterProtected({ children }) {
	const [searchParams] = useSearchParams()
	const [isPermitted, setIsPermitted] = useState(false)
	const { postData, isLoading,setIsLoading } = usePostData({initialLoading:true})

	const verifyRegister = () => {
		const paramCode = searchParams.get('code')
		if (paramCode) {
			postData({
				endpoint: 'users/verifyCode',
				payload: {
					RegisterCode: paramCode,
				},
				onsuccess: (result) => {
					if (result) {
						setIsPermitted(true)
					} else {
						setIsPermitted(false)
					}
				},
			})
		} else {
			setIsPermitted(false)
			setIsLoading(false)
		}
	}

	useEffect(verifyRegister, [])

	if (isLoading) {
		return (
			<div className='flex flex-col gap-6 items-center justify-center h-[100svh] w-full'>
				{/* <Logo /> */}
				<Spinner />
			</div>
		)
	}

	return isPermitted ? children : <Navigate to='/login' />
}
