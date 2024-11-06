import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import avatar from '../assets/icons/avatar.svg'
import logoutIcon from '../assets/icons/logout.svg'
import searchIcon from '../assets/icons/search-icon.svg'
import useGetData from '../hooks/useGetData'
import { useAuth } from '../utils/AuthProvider'
import AlertList from './Alert/AlertList'
import ChatList from './Chat/ChatList'
import Logo from './Common/Logo'
import Button from './ui/Button'
import Modal from './ui/Modal'

const DashboardHeader = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { logout, currentUserData, scrollToTop } = useAuth()
	const { isLoading, data: user } = useGetData(`users/${currentUserData.CurrentUser.UserId}`)

	const [isModalOpen, setIsModalOpen] = useState(false)

	const isPermitted = currentUserData.CurrentUser.Role.includes('Admin')

	const onClickItem = (path) => {
		scrollToTop()
		navigate(path)
	}

	const openLogoutModal = () => setIsModalOpen(true)
	const closeLogoutModal = () => setIsModalOpen(false)
	const navigateToProfile = () => onClickItem('/MyProfile')

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
			<div className='bg-system-secondary-bg py-2 md:py-3 px-2 lg:px-10  border-b border-system-file-border w-full flex justify-center'>
				<div className='flex flex-row justify-between items-center max-w-screen-2xl w-full px-2 xl:px-10'>
					<div
						className='text-4xl font-bold text-brand-violet scale-75 md:scale-90'
						onClick={() => onClickItem('/home')}>
						<Logo />
					</div>
					<div className='px-10 hidden lg:flex flex-row flex-wrap gap-8 flex-1'>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-xl  ${
									location.pathname === '/Events' || location.pathname === '/events' || location.pathname === '/'
										? 'text-system-primary-accent'
										: 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Events')}>
								Events
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname === '/Events' || location.pathname === '/events' || location.pathname === '/'
										? 'bg-system-primary-accent'
										: 'bg-transparent'
								}`}></div>
						</div>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-xl  ${
									location.pathname === '/Activities' ? 'text-system-primary-accent' : 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Activities')}>
								Activities
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname === '/Activities' ? 'bg-system-primary-accent' : 'bg-transparent'
								}`}></div>
						</div>

						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-xl  ${
									location.pathname === '/Discussions' ? 'text-system-primary-accent' : 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Discussions')}>
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
								onClick={() => onClickItem('/Connections')}>
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
								onClick={() => onClickItem('/Articles')}>
								Articles
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname === '/Articles' ? 'bg-system-primary-accent' : 'bg-transparent'
								}`}></div>
						</div>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-xl  ${
									location.pathname === '/Podcasts' ? 'text-system-primary-accent' : 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Podcasts')}>
								Podcasts
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname === '/Podcasts' ? 'bg-system-primary-accent' : 'bg-transparent'
								}`}></div>
						</div>
						{isPermitted && (
							<div className='w-max flex flex-col items-center'>
								<a
									className={`cursor-pointer  font-medium text-xl  ${
										location.pathname === '/Analytics' ? 'text-system-primary-accent' : 'text-system-primary-text'
									}`}
									onClick={() => onClickItem('/Analytics')}>
									Analytics
								</a>
								<div
									className={`h-1 w-10 rounded-full ${
										location.pathname === '/Analytics' ? 'bg-system-primary-accent' : 'bg-transparent'
									}`}></div>
							</div>
						)}
					</div>
					<div className='flex flex-row flex-wrap items-center gap-2 md:gap-4'>
						<div className='relative inline-block text-left'>
							<div className='relative flex'>
								<button
									type='button'
									className='inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
									onClick={() => onClickItem('/Search')}>
									<img src={searchIcon} alt='' className='h-7' />
								</button>
							</div>
						</div>
						<ChatList />
						<AlertList />

						<button className='inline-flex md:hidden' onClick={openLogoutModal}>
							<img src={logoutIcon} alt='' className='h-7' />
						</button>
						{user && (
							<>
								{user?.ProfilePicture ? (
									<div className='rounded-full overflow-hidden cursor-pointer' onClick={navigateToProfile}>
										<img src={user?.ProfilePicture} alt='' className='object-cover h-10 w-10 ' />
									</div>
								) : (
									<>
										<div className='rounded-full overflow-hidden cursor-pointer' onClick={navigateToProfile}>
											<img src={avatar} alt='' className='object-cover h-10 w-10 ' />
										</div>
									</>
								)}
							</>
						)}
						<button
							type='button'
							className='hidden md:inline-flex justify-center rounded-full border-2 border-system-error bg-system-secondary-bg text-md px-6 py-1 font-medium text-brand-red'
							onClick={openLogoutModal}>
							Logout
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default DashboardHeader
