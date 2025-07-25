import { useEffect, useRef, useState } from 'react'
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

	const messageRef = useRef(null)
	const messagesClick = async () => {
		if (messageRef.current && messageRef.current.openMessages) {
			messageRef.current.openMessages()
		}
	}

	const notificationsRef = useRef(null)
	const notificationsClick = async () => {
		if (notificationsRef.current && notificationsRef.current.openNotifications) {
			notificationsRef.current.openNotifications()
		}
	}

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
					<div className='hidden lg:flex flex-row flex-nowrap gap-4 md:gap-8 flex-1 overflow-x-auto px-2 md:px-10 scroll-smooth'>
						<div className='w-max flex flex-col items-center flex-shrink-0'>
							<a
								className={`cursor-pointer  font-medium text-md  ${
									location.pathname.includes('/Events') ||
									location.pathname.includes('/events') ||
									location.pathname === '/'
										? 'text-system-primary-accent'
										: 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Events')}>
								Events
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname.includes('/Events') ||
									location.pathname.includes('/events') ||
									location.pathname === '/'
										? 'bg-system-primary-accent'
										: 'bg-transparent'
								}`}></div>
						</div>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-md  ${
									location.pathname.includes('/Activities') || location.pathname.includes('/activities')
										? 'text-system-primary-accent'
										: 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Activities')}>
								Activities
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname.includes('/Activities') || location.pathname.includes('/activities')
										? 'bg-system-primary-accent'
										: 'bg-transparent'
								}`}></div>
						</div>

						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-md  ${
									location.pathname.includes('/Discussions') || location.pathname.includes('/discussions')
										? 'text-system-primary-accent'
										: 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Discussions')}>
								Discussions
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname.includes('/Discussions') || location.pathname.includes('/discussions')
										? 'bg-system-primary-accent'
										: 'bg-transparent'
								}`}></div>
						</div>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-md  ${
									location.pathname.includes('/Connections') || location.pathname.includes('/connections')
										? 'text-system-primary-accent'
										: 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Connections')}>
								Connections
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname.includes('/Connections') || location.pathname.includes('/connections')
										? 'bg-system-primary-accent'
										: 'bg-transparent'
								}`}></div>
						</div>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-md  ${
									location.pathname.includes('/Articles') || location.pathname.includes('/articles')
										? 'text-system-primary-accent'
										: 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Articles')}>
								Articles
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname.includes('/Articles') || location.pathname.includes('/articles')
										? 'bg-system-primary-accent'
										: 'bg-transparent'
								}`}></div>
						</div>
						<div className='w-max flex flex-col items-center'>
							<a
								className={`cursor-pointer  font-medium text-md  ${
									location.pathname.includes('/Podcasts') || location.pathname.includes('/podcasts')
										? 'text-system-primary-accent'
										: 'text-system-primary-text'
								}`}
								onClick={() => onClickItem('/Podcasts')}>
								Podcasts
							</a>
							<div
								className={`h-1 w-10 rounded-full ${
									location.pathname.includes('/Podcasts') || location.pathname.includes('/podcasts')
										? 'bg-system-primary-accent'
										: 'bg-transparent'
								}`}></div>
						</div>
						{isPermitted && (
							<div className='w-max flex flex-col items-center'>
								<a
									className={`cursor-pointer  font-medium text-md  ${
										location.pathname.includes('/TagsManager') || location.pathname.includes('/tagsmanager')
											? 'text-system-primary-accent'
											: 'text-system-primary-text'
									}`}
									onClick={() => onClickItem('/TagsManager')}>
									Tags
								</a>
								<div
									className={`h-1 w-10 rounded-full ${
										location.pathname.includes('/TagsManager') || location.pathname.includes('/tagsmanager')
											? 'bg-system-primary-accent'
											: 'bg-transparent'
									}`}></div>
							</div>
						)}
						{isPermitted && (
							<div className='w-max flex flex-col items-center'>
								<a
									className={`cursor-pointer  font-medium text-md  ${
										location.pathname.includes('/Analytics') || location.pathname.includes('/analytics')
											? 'text-system-primary-accent'
											: 'text-system-primary-text'
									}`}
									onClick={() => onClickItem('/Analytics')}>
									Analytics
								</a>
								<div
									className={`h-1 w-10 rounded-full ${
										location.pathname.includes('/Analytics') || location.pathname.includes('/analytics')
											? 'bg-system-primary-accent'
											: 'bg-transparent'
									}`}></div>
							</div>
						)}

						{isPermitted && (
							<div className='w-max flex flex-col items-center'>
								<a
									className={`cursor-pointer  font-medium text-md  ${
										location.pathname.includes('/Moderation') || location.pathname.includes('/moderation')
											? 'text-system-primary-accent'
											: 'text-system-primary-text'
									}`}
									onClick={() => onClickItem('/Moderation')}>
									Moderation
								</a>
								<div
									className={`h-1 w-10 rounded-full ${
										location.pathname.includes('/Moderation') || location.pathname.includes('/moderation')
											? 'bg-system-primary-accent'
											: 'bg-transparent'
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
						<ChatList ref={messageRef} />
						<AlertList ref={notificationsRef} />

						<div className='hidden lg:block'>
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
						</div>

						<div className='block lg:hidden'>
							<UserProfile
								user={user}
								avatar={avatar}
								isPermitted={isPermitted}
								navigateToProfile={navigateToProfile}
								openLogoutModal={openLogoutModal}
								messagesClick={messagesClick}
								notificationsClick={notificationsClick}
							/>
						</div>

						{/* <button className='inline-flex md:hidden' onClick={openLogoutModal}>
							<img src={logoutIcon} alt='' className='h-7' />
						</button> */}
						<button
							type='button'
							className='hidden lg:inline-flex justify-center rounded-full border-2 border-system-error bg-system-secondary-bg text-md px-6 py-1 font-medium text-brand-red'
							onClick={openLogoutModal}>
							Logout
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

const UserProfile = ({
	user,
	avatar,
	isPermitted,
	navigateToProfile,
	openLogoutModal,
	messagesClick,
	notificationsClick,
}) => {
	const navigate = useNavigate()
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef(null)

	const handleDropdownToggle = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsDropdownOpen(false) // Close the dropdown if clicked outside
		}
	}

	const OnClickMenu = (path) => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
		// scrollToTop()
		navigate(path)
	}

	useEffect(() => {
		// Add event listener to detect clicks outside
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// Cleanup the event listener when the component unmounts
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<>
			{user && (
				<>
					{user?.ProfilePicture ? (
						<div className='relative' ref={dropdownRef}>
							<div className='rounded-full overflow-hidden cursor-pointer' onClick={handleDropdownToggle}>
								<img src={user?.ProfilePicture} alt='' className='object-cover h-10 w-10' />
							</div>

							{isDropdownOpen && (
								<div className='absolute right-0 mt-2 w-48 bg-system-secondary-bg overflow-hidden rounded-lg shadow-lg font-medium z-50'>
									<p
										onClick={() => {
											navigateToProfile()
											handleDropdownToggle()
										}}
										className='block px-4 py-2 text-system-primary-text hover:bg-gray-100 border-b cursor-pointer'>
										View Profile
									</p>
									<p
										onClick={() => {
											messagesClick()
											handleDropdownToggle()
										}}
										className='block px-4 py-2 text-system-primary-text hover:bg-gray-100 border-b cursor-pointer'>
										Messages
									</p>
									<p
										onClick={() => {
											notificationsClick()
											handleDropdownToggle()
										}}
										className='block px-4 py-2 text-system-primary-text hover:bg-gray-100 border-b cursor-pointer'>
										Notifications
									</p>
									{isPermitted && (
										<>
											<p
												onClick={() => {
													handleDropdownToggle()
													OnClickMenu('/TagsManager')
												}}
												className='block px-4 py-2 text-system-primary-text hover:bg-gray-100 border-b cursor-pointer'>
												Tags
											</p>
										</>
									)}
									{isPermitted && (
										<>
											<p
												onClick={() => {
													handleDropdownToggle()
													OnClickMenu('/Analytics')
												}}
												className='block px-4 py-2 text-system-primary-text hover:bg-gray-100 border-b cursor-pointer'>
												Analytics
											</p>
										</>
									)}
									<p
										onClick={() => {
											openLogoutModal()
											handleDropdownToggle()
										}}
										className='block px-4 py-2 text-system-error hover:bg-gray-100 cursor-pointer'>
										Logout
									</p>
								</div>
							)}
						</div>
					) : (
						<div className='relative' ref={dropdownRef}>
							<div className='rounded-full overflow-hidden cursor-pointer' onClick={handleDropdownToggle}>
								<img src={avatar} alt='' className='object-cover h-10 w-10' />
							</div>

							{isDropdownOpen && (
								<div className='absolute right-0 mt-2 w-48 bg-system-secondary-bg overflow-hidden rounded-lg shadow-lg font-medium z-50'>
									<p
										onClick={navigateToProfile}
										className='block px-4 py-2 text-system-primary-text hover:bg-system-primary-bg border-b cursor-pointer'>
										View Profile
									</p>
									<p
										onClick={() => {
											messagesClick()
											handleDropdownToggle()
										}}
										className='block px-4 py-2 text-system-primary-text hover:bg-gray-100 border-b cursor-pointer'>
										Messages
									</p>
									<p
										onClick={() => {
											notificationsClick()
											handleDropdownToggle()
										}}
										className='block px-4 py-2 text-system-primary-text hover:bg-gray-100 border-b cursor-pointer'>
										Notifications
									</p>
									<p
										onClick={openLogoutModal}
										className='block px-4 py-2 text-system-error hover:bg-system-primary-bg cursor-pointer'>
										Logout
									</p>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</>
	)
}

export default DashboardHeader
