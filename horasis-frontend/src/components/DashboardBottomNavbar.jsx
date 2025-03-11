import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../utils/AuthProvider'
import activity from '../assets/icons/activity.svg'
import event from '../assets/icons/event.svg'
import discussion from '../assets/icons/discussion.svg'
import connections from '../assets/icons/connections.svg'
import analytics from '../assets/icons/analytics.svg'
import podcast from '../assets/icons/podcast.svg'

const DashboardBottomNavbar = () => {
	const { currentUserData, scrollToTop } = useContext(AuthContext)

	const navigate = useNavigate()
	const location = useLocation()

	const OnClickMenu = (path) => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
		scrollToTop()
		navigate(path)
	}
	const isPermitted = currentUserData.CurrentUser.Role.includes('Admin')

	return (
		<div className='bg-system-secondary-bg w-full block lg:hidden border-t border-system-file-border'>
			<div className={`grid grid-cols-5 gap-3 p-2 `}>
				<button
					onClick={() => {
						OnClickMenu('/Activities')
					}}
					type='button'
					className={`py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium ${
						location.pathname.includes('/Activities') ? 'bg-system-primary-accent-light rounded-md' : ''
					}`}>
					<img src={activity} alt='' className='h-8 cursor-pointer' />

					<span className='text-xs -mb-1 text-system-primary-accent '>Activities</span>
				</button>
				<button
					onClick={() => {
						OnClickMenu('/Events')
					}}
					type='button'
					className={`py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium 
            ${
							location.pathname.includes('/Events') ||
							location.pathname.includes('/events') ||
							location.pathname === '/'
								? 'bg-system-primary-accent-light rounded-md'
								: ''
						}
          `}>
					<img src={event} alt='' className='h-8 cursor-pointer' />

					<span className='text-xs -mb-1 text-system-primary-accent '>Events</span>
				</button>

				<button
					onClick={() => {
						OnClickMenu('/Discussions')
					}}
					type='button'
					className={`py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium 
            ${location.pathname.includes('/Discussions') ? 'bg-system-primary-accent-light rounded-md' : ''}
          `}>
					<img src={discussion} alt='' className='h-8 cursor-pointer' />

					<span className='text-xs -mb-1 text-system-primary-accent '>Discussions</span>
				</button>
				<button
					onClick={() => {
						OnClickMenu('/Connections')
					}}
					type='button'
					className={`py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium
            ${location.pathname.includes('/Connections') ? 'bg-system-primary-accent-light rounded-md' : ''}
          `}>
					<img src={connections} alt='' className='h-8 cursor-pointer' />

					<span className='text-xs -mb-1 text-system-primary-accent '>Connections</span>
				</button>
				<button
					onClick={() => {
						OnClickMenu('/Podcasts')
					}}
					type='button'
					className={`py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium
            ${location.pathname.includes('/Podcasts') ? 'bg-system-primary-accent-light rounded-md' : ''}
          `}>
					<img src={podcast} alt='' className='h-8 cursor-pointer' />

					<span className='text-xs -mb-1 text-system-primary-accent '>Podcasts</span>
				</button>
				{/* {isPermitted && (<button
					onClick={() => {
						OnClickMenu('/Analytics')
					}}
					type='button'
					className={`py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium
            ${location.pathname.includes('/Analytics') ? 'bg-system-primary-accent-light rounded-md' : ''} 
          `}>
					<img src={analytics} alt='' className='h-8 cursor-pointer' />


					<span className='text-xs -mb-1 text-system-primary-accent '>Analytics</span>
				</button>)} */}
			</div>
		</div>
	)
}

export default DashboardBottomNavbar
