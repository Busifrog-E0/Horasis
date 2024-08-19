import { useContext, useState } from 'react'
import { AuthContext } from '../utils/AuthProvider'
import Logo from './Common/Logo'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ChatList from './Chat/ChatList'
import AlertList from './Alert/AlertList'
import logoutIcon from '../assets/icons/logout.svg'
import Modal from './ui/Modal'
import close from '../assets/icons/close.svg'
import Button from './ui/Button'

const DashboardHeader = () => {
	const { logout, currentUserData, scrollToTop } = useContext(AuthContext)
	const location = useLocation()
	const navigate = useNavigate()
	const OnClickItem = (path) => {
		scrollToTop()
		navigate(path)
	}

	const [isModalOpen, setIsModalOpen] = useState(false)

	const openLogoutModal = () => setIsModalOpen(true)

	const closeLogoutModal = () => setIsModalOpen(false)

	return (
		<>
			<Modal isOpen={isModalOpen}>
				<Modal.Header>
					<p className='text-lg font-medium'>Are you sure you want to logout?</p>
					<button onClick={closeLogoutModal}>{/* <img src={close} className='h-6  cursor-pointer' alt='' /> */}</button>
				</Modal.Header>
				<Modal.Body padding={0}>
					<div className='flex items-end justify-end gap-4 px-4'>
						<Button variant='outline' className='px-8 py-3' onClick={closeLogoutModal}>
							Cancel
						</Button>
						<Button variant='black' className='px-8  py-3' onClick={logout}>
							Logout
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<div className='bg-system-secondary-bg py-3 px-5 lg:px-10 shadow border-b border-system-file-border'>
				<div className='flex flex-row justify-between items-center'>
					<h1 className='text-4xl font-bold text-brand-violet' onClick={() => OnClickItem('/home')}>
						<Logo />
					</h1>
					<div className='px-10 hidden lg:flex flex-row flex-wrap gap-8 flex-1'>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-xl  ${
									location.pathname === '/Activities' || location.pathname === '/'
										? 'text-system-primary-accent'
										: 'text-system-primary-text'
								}`}
								onClick={() => OnClickItem('/Activities')}>
								Activities
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname === '/Activities' || location.pathname === '/'
										? 'bg-system-primary-accent'
										: 'bg-transparent'
								}`}></div>
						</div>
						{/* <div className='w-max flex flex-col items-center'>
						<a
							className={`cursor-pointer  font-medium text-xl  ${
								location.pathname === '/Events' ? 'text-system-primary-accent' : 'text-system-primary-text'
							}`}
							onClick={() => OnClickItem('/Events')}>
							Events
						</a>
						<div
							className={`h-1 w-10 rounded-full ${
								location.pathname === '/Events' ? 'bg-system-primary-accent' : 'bg-transparent'
							}`}></div>
					</div> */}
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-xl  ${
									location.pathname === '/Discussions' ? 'text-system-primary-accent' : 'text-system-primary-text'
								}`}
								onClick={() => OnClickItem('/Discussions')}>
								Discussions
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname === '/Discussions' ? 'bg-system-primary-accent' : 'bg-transparent'
								}`}></div>
						</div>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-xl  ${
									location.pathname === '/Connections' ? 'text-system-primary-accent' : 'text-system-primary-text'
								}`}
								onClick={() => OnClickItem('/Connections')}>
								Connections
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname === '/Connections' ? 'bg-system-primary-accent' : 'bg-transparent'
								}`}></div>
						</div>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-xl  ${
									location.pathname === '/Articles' ? 'text-system-primary-accent' : 'text-system-primary-text'
								}`}
								onClick={() => OnClickItem('/Articles')}>
								Articles
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname === '/Articles' ? 'bg-system-primary-accent' : 'bg-transparent'
								}`}></div>
						</div>
						{/* <div className='w-max flex flex-col items-center'>
						<a
							className={`cursor-pointer  font-medium text-xl  ${location.pathname === '/Analytics' ? 'text-system-primary-accent' : 'text-system-primary-text'
								}`}
							onClick={() => OnClickItem('/Analytics')}>
							Analytics
						</a>
						<div
							className={`h-1 w-10 rounded-full ${location.pathname === '/Analytics' ? 'bg-system-primary-accent' : 'bg-transparent'
								}`}></div>
					</div> */}
					</div>
					<div className='flex flex-row flex-wrap items-center gap-4 md:gap-4'>
						{/* <button
            type="button"
            className="inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim"
            onClick={() => OnClickItem("/universal/search")}
          >
            Search
          </button> */}
						<ChatList />
						<AlertList />
						<button
							type='button'
							className='inline-flex justify-center rounded-full border-2 border-system-error bg-system-secondary-bg text-md px-6 py-1 font-medium text-brand-red'
							onClick={openLogoutModal}>
							Logout
							{/* <img src={logoutIcon} alt='' className='h-7' /> */}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default DashboardHeader
