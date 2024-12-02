import { RemoteUser, useRemoteUsers } from 'agora-rtc-react'
import arrowl from '../../assets/icons/arrowl.svg'
import avatar from '../../assets/icons/avatar.svg'
import people from '../../assets/icons/people.svg'
import { useEffect, useRef, useState } from 'react'
import ScrollableRemoteUsersList from './ScrollableRemoteUsersList'
import StickyLocalUserView from './StickyLocalUserView'
import Button from '../ui/Button'
import mic from '../../assets/icons/streaming/mic.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import camera from '../../assets/icons/streaming/camera.svg'
import camera_off from '../../assets/icons/streaming/camera_off.svg'
import call_end from '../../assets/icons/streaming/call_end.svg'
import { useNavigate } from 'react-router-dom'

const NewStreamUsersList = ({
	participants,
	event,
	cameraOn,
	micOn,
	setCamera,
	isConnected,
	calling,
	setCalling,
	setMic,
	role,
	localCameraTrack,
	localMicrophoneTrack,
	currentUser,
	setModalOpen,
	speakers,
	muteUser,
	isPermitted,
	blocked,
}) => {
	const remoteUsers = useRemoteUsers()
	const [mainScreenUser, setMainScreenUser] = useState(null)

	useEffect(() => {
		if (remoteUsers.length > 0) {
			setMainScreenUser(remoteUsers[0])
		} else {
			setMainScreenUser(null)
		}
	}, [remoteUsers, speakers, participants, role])

	return (
		<div className='flex flex-col h-full overflow-hidden '>
			<div className='flex flex-row gap-4 p-2 py-6 items-center border-b border-system-secondary-bg-transparent mb-2 '>
				<div className='cursor-pointer' onClick={() => setCalling((a) => !a)}>
					<img src={arrowl} alt='' className='h-8 bg-[#354657] rounded-md' />
				</div>
				<div>
					<p className='text-[#CBD2DA] text-lg md:text-xl lg:text-2xl'>{event.EventName}</p>
				</div>
				<div className='hidden md:flex flex-row gap-2 p-1 px-3 rounded-md ml-6 items-center bg-[#354657]'>
					<img src={people} alt='' className='h-4 ' />
					<p className='text-white'>{participants.length + speakers.length} + </p>
				</div>
				<div
					className='flex md:hidden flex-row gap-2 p-1 px-3 rounded-md ml-6 items-center bg-[#354657]'
					onClick={() => setModalOpen(true)}>
					<img src={people} alt='' className='h-4 ' />
					<p className='text-white'>{participants.length + speakers.length} + </p>
				</div>
			</div>
			<div className='flex-grow-1 flex-1  overflow-hidden '>
				<div className='h-full flex flex-col overflow-hidden'>
					<div className='flex-1 flex-grow-1 rounded-lg overflow-hidden relative flex '>
						<StickyLocalUserView
							localCameraTrack={localCameraTrack}
							localMicrophoneTrack={localMicrophoneTrack}
							calling={calling}
							cameraOn={cameraOn}
							isConnected={isConnected}
							participants={participants}
							micOn={micOn}
							role={role}
							setCalling={setCalling}
							setCamera={setCamera}
							setMic={setMic}
							currentUser={currentUser}
							speakers={speakers}
							blocked={blocked}
						/>
						{mainScreenUser !== null && (
							<RemoteUser
								cover={
									speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserAvatar
										? speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserAvatar
										: avatar
								}
								user={mainScreenUser}
								className='w-32 h-32 bg-red-500'>
								<div className='absolute right-0 rounded-full m-2 bottom-0 font-semibold text-brand-secondary bg-system-primary-accent px-3'>
									{speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserName}{' '}
									{mainScreenUser.hasAudio ? (
										<img className='inline-block h-4' src={mic}></img>
									) : (
										<img src={mic_off} className='inline-block h-4'></img>
									)}
								</div>
								{isPermitted && role === 'Speaker' && (
									<div className='absolute left-2 lg:left-1/2 bottom-2 lg:bottom-4 flex flex-row gap-2 lg:gap-10 lg:-translate-x-1/2'>
										<button
											className='bg-white/15 py-2 px-4 rounded-full hover:bg-white/30 flex text-system-secondary-bg gap-2 items-center'
											onClick={() =>
												muteUser(
													speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserId,
													'CAMERATOGGLE'
												)
											}>
											{mainScreenUser.hasVideo ? (
												<img src={camera} className='h-6' />
											) : (
												<img src={camera_off} className='h-6' />
											)}
											<span className='hidden lg:inline'>
												{mainScreenUser.hasVideo ? 'Turn off camera' : 'Turned off'}
											</span>
										</button>

										<button
											className='bg-white/15 py-2 px-4 rounded-full hover:bg-white/30 flex text-system-secondary-bg gap-2 items-center'
											onClick={() =>
												muteUser(
													speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserId,
													'MICTOGGLE'
												)
											}>
											{mainScreenUser.hasAudio ? (
												<img src={mic} className='h-6' />
											) : (
												<img src={mic_off} className='h-6' />
											)}
											<span className='hidden lg:inline'>
												{mainScreenUser.hasAudio ? 'Turn off microphone' : 'Turned off'}
											</span>
										</button>

										<PermanentBlockUser
											muteUser={() =>
												muteUser(
													speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserId,
													'BLOCK'
												)
											}
										/>
										{/* <button
										onClick={() =>
											muteUser(speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserRtcUid)
										}
										className='bg-red-600 '>
										Turn of mic
									</button> */}
									</div>
								)}
							</RemoteUser>
						)}
					</div>
					<ScrollableRemoteUsersList
						participants={participants}
						mainScreenUser={mainScreenUser}
						remoteUsers={remoteUsers}
						setMainScreenUser={setMainScreenUser}
						speakers={speakers}
						muteUser={muteUser}
						isPermitted={isPermitted}
						role={role}
					/>
				</div>
			</div>
		</div>
	)
}

const Dropdown = ({ buttonLabel = '•••', items = [], onItemSelect = () => {}, btnStyles, itemsStyle }) => {
	const dropdownRef = useRef(null)
	const buttonRef = useRef(null)
	const [isOpen, setIsOpen] = useState(false)

	const handleClickOutside = (event) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target) &&
			!buttonRef.current.contains(event.target)
		) {
			setIsOpen(false)
		}
	}

	const adjustDropdownPosition = () => {
		if (!dropdownRef.current || !buttonRef.current) return

		const dropdown = dropdownRef.current
		const button = buttonRef.current
		const rect = dropdown.getBoundingClientRect()
		const buttonRect = button.getBoundingClientRect()

		// Reset position styles
		dropdown.style.left = 'auto'
		dropdown.style.right = 'auto'
		dropdown.style.top = 'auto'
		dropdown.style.bottom = 'auto'

		// Check horizontal boundaries
		if (rect.right > window.innerWidth) {
			dropdown.style.right = '0'
		} else if (rect.left < 0) {
			dropdown.style.left = '0'
		} else {
			dropdown.style.left = 'auto'
		}

		dropdown.style.bottom = `${buttonRect.height}px`
		// Check vertical boundaries
		// if (rect.bottom > window.innerHeight) {
		// 	dropdown.style.bottom = `${buttonRect.height}px`
		// } else {
		// 	dropdown.style.top = `${buttonRect.height}px`
		// }
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		if (isOpen) {
			adjustDropdownPosition()
		}
	}, [isOpen])

	return (
		<div className='relative inline-block text-left' ref={buttonRef}>
			<button
				className={
					btnStyles
						? btnStyles
						: 'inline-flex justify-center w-full rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
				}
				type='button'
				onClick={() => setIsOpen(!isOpen)}>
				{buttonLabel}
			</button>
			{isOpen && (
				<div
					className={`origin-top-right absolute z-10 w-56 rounded-md shadow-lg ${
						itemsStyle ? '' : 'bg-system-secondary-bg'
					} ring-1 ring-black ring-opacity-5`}
					ref={dropdownRef}>
					<div className='py-1 flex flex-col gap-2' role='menu' aria-orientation='vertical'>
						{items.map((item, index) => (
							<span
								key={index}
								className={
									itemsStyle
										? itemsStyle
										: 'cursor-pointer block px-4 py-2 text-sm text-system-secondary-text bg-system-secondary-bg hover:bg-system-primary-bg'
								}
								role='menuitem'
								onClick={() => {
									onItemSelect(item)
									setIsOpen(false) // Close dropdown after selection
								}}>
								{item.label}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export const PermanentBlockUser = ({ muteUser }) => {
	const handleItemSelect = (item) => {
		muteUser()
	}

	const dropdownItems = [{ label: 'Permanently mute.' }]

	return (
		<Dropdown
			btnStyles={
				'bg-white/15 py-2 px-4 rounded-full hover:bg-white/30 flex text-system-secondary-bg gap-2 items-center'
			}
			itemsStyle={
				'bg-white/15 py-2 px-4 rounded-md hover:bg-white/30 flex text-system-secondary-bg gap-2 items-center text-sm cursor-pointer'
			}
			items={dropdownItems}
			onItemSelect={handleItemSelect}
		/>
	)
}

export default NewStreamUsersList
