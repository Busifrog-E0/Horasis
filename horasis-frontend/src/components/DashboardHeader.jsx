import { useContext } from 'react'
import { AuthContext } from '../utils/AuthProvider'
import Logo from './Common/Logo'
import ChatList from './Chat/ChatList'
import AlertList from './Alert/AlertList'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const logoText = {
	fontSize: '1.7rem',
	fontWeight: '700',
	margin: 0,
	marginLeft: '10px',
}
const headerWrapper = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '12px 0px',
}
const branding = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
}
const postJobButton = { fontWeight: 600, border: '2px solid ' }
const completeProfileButton = {
	display: 'flex',
	alignItems: 'center',
	gap: '5px',
	fontWeight: 600,
	fontSize: '16px',
}

const DashboardHeader = () => {
	const { logout, currentUserData, scrollToTop } = useContext(AuthContext)
	const location = useLocation()
	const navigate = useNavigate()
	const OnClickItem = (path) => {
		scrollToTop()
		navigate(path)
	}
	return (
		<div className='bg-system-secondary-bg py-3 px-5 lg:px-10 shadow border-b border-system-file-border'>
			<div className='flex flex-row justify-between items-center'>
				<h1 className='text-4xl font-bold text-brand-violet'>
					<Logo />
				</h1>
				<div className='px-5 hidden lg:flex flex-row flex-wrap gap-3 flex-1'>
					<div className='w-max flex flex-col items-center'>
						<a
							className={`cursor-pointer  font-medium text-lg  ${
								location.pathname === '/Activities' || location.pathname === '/' ? 'text-system-primary-accent' : 'text-system-primary-text'
							}`}
							onClick={() => OnClickItem('/Activities')}>
							Activities
						</a>
						<div
							className={`h-1 w-1/2 rounded-full ${
								location.pathname === '/Activities' || location.pathname === '/' ? 'bg-system-primary-accent' : 'bg-transparent'
							}`}></div>
					</div>
          {/* <div className='w-max flex flex-col items-center'>
						<a
							className={`cursor-pointer  font-medium text-lg  ${
								location.pathname === '/Events' ? 'text-system-primary-accent' : 'text-system-primary-text'
							}`}
							onClick={() => OnClickItem('/Events')}>
							Events
						</a>
						<div
							className={`h-1 w-1/2 rounded-full ${
								location.pathname === '/Events' ? 'bg-system-primary-accent' : 'bg-transparent'
							}`}></div>
					</div> */}
          {/* <div className='w-max flex flex-col items-center'>
						<a
							className={`cursor-pointer  font-medium text-lg  ${
								location.pathname === '/Discussions' ? 'text-system-primary-accent' : 'text-system-primary-text'
							}`}
							onClick={() => OnClickItem('/Discussions')}>
							Discussions
						</a>
						<div
							className={`h-1 w-1/2 rounded-full ${
								location.pathname === '/Discussions' ? 'bg-system-primary-accent' : 'bg-transparent'
							}`}></div>
					</div> */}
          <div className='w-max flex flex-col items-center'>
						<a
							className={`cursor-pointer  font-medium text-lg  ${
								location.pathname === '/Connections' ? 'text-system-primary-accent' : 'text-system-primary-text'
							}`}
							onClick={() => OnClickItem('/Connections')}>
							Connections
						</a>
						<div
							className={`h-1 w-1/2 rounded-full ${
								location.pathname === '/Connections' ? 'bg-system-primary-accent' : 'bg-transparent'
							}`}></div>
					</div>
          {/* <div className='w-max flex flex-col items-center'>
						<a
							className={`cursor-pointer  font-medium text-lg  ${
								location.pathname === '/Analytics' ? 'text-system-primary-accent' : 'text-system-primary-text'
							}`}
							onClick={() => OnClickItem('/Analytics')}>
							Analytics
						</a>
						<div
							className={`h-1 w-1/2 rounded-full ${
								location.pathname === '/Analytics' ? 'bg-system-primary-accent' : 'bg-transparent'
							}`}></div>
					</div> */}
			
				</div>
				<div className='flex flex-row flex-wrap gap-2'>
					{/* <button
            type="button"
            className="inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim"
            onClick={() => OnClickItem("/universal/search")}
          >
            Search
          </button>
          <ChatList />
          <AlertList /> */}
					<button
						type='button'
						className='inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-red'
						onClick={logout}>
						Logout
					</button>
				</div>
			</div>
		</div>
	)
}

export default DashboardHeader
