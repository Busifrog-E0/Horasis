import { Navigate, useSearchParams } from 'react-router-dom'
import Spinner from '../components/ui/Spinner'
import { useEffect, useState } from 'react'
import Logo from '../components/Common/Logo'

export default function RegisterProtected({ children }) {
	const [searchParams] = useSearchParams()
	const [isPermitted, setIsPermitted] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const paramCode = searchParams.get('code')
		setIsLoading(true)
		setTimeout(() => {
			setIsPermitted(Boolean(paramCode))
			setIsLoading(false)
		}, 3000)
	}, [])

	if (isLoading) {
		return (
			<div className='flex flex-col gap-6 items-center justify-center h-[100svh] w-full'>
				<Logo />
				<Spinner />
			</div>
		)
	}

	return isPermitted ? children : <Navigate to='/login' />
}
