import { useContext } from 'react'
import { AuthContext } from '../utils/AuthProvider'
import DashboardHeader from '../components/DashboardHeader'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
	const navigate = useNavigate()
	const { currentUserData } = useContext(AuthContext)

	return (
		<div className='flex flex-col h-[100svh] bg-system-secondary-bg'>
			{currentUserData && <DashboardHeader />}
			<div className='flex-1 flex flex-col items-center justify-center'>
				<p className='text-[10rem] md:text-[16rem] font-bold text-system-primary-accent flex items-center'>
					4<span className='h-32 w-32 md:h-48 md:w-48 rounded-full bg-system-primary-accent flex'></span>4
				</p>
				<p className='text-center text-lg p-10 font-medium text-system-secondary-text'>
					You didn't break the internet, but we can't find what you are looking for.
				</p>
				<Button variant='black' className='px-10 py-4' onClick={() => navigate(-1)}>
					Let's go back
				</Button>
			</div>
		</div>
	)
}

export default NotFoundPage
