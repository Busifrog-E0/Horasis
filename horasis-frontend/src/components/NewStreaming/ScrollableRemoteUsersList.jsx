import { useState, useEffect, useRef } from 'react'
import { RemoteUser } from 'agora-rtc-react'
import avatar from '../../assets/icons/avatar.svg'
import fullscreen from '../../assets/icons/streaming/fullscreen.svg'
import mic from '../../assets/icons/streaming/mic.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import right from '../../assets/icons/streaming/right.svg'
import left from '../../assets/icons/streaming/left.svg'
import camera from '../../assets/icons/streaming/camera.svg'
import camera_off from '../../assets/icons/streaming/camera_off.svg'
import { PermanentBlockUser } from './NewStreamUsersList'

const ScrollableRemoteUsersList = ({
	participants,
	remoteUsers,
	setMainScreenUser,
	mainScreenUser,
	speakers,
	muteUser,
	isPermitted,
	role,
}) => {
	const [isScrollable, setIsScrollable] = useState(false)
	const [atStart, setAtStart] = useState(true) // Track if at the left end
	const [atEnd, setAtEnd] = useState(false) // Track if at the right end
	const scrollableDivRef = useRef(null)

	// Check if the content overflows
	useEffect(() => {
		const handleResize = () => {
			const scrollableDiv = scrollableDivRef.current
			if (scrollableDiv) {
				setIsScrollable(scrollableDiv.scrollWidth > scrollableDiv.clientWidth)
				checkScrollPosition() // Update scroll position after resize
			}
		}
		handleResize() // Check initially
		// Add event listener for window resize
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [remoteUsers])

	// Check scroll position and update the atStart and atEnd state
	const checkScrollPosition = () => {
		const scrollableDiv = scrollableDivRef.current
		if (scrollableDiv) {
			setAtStart(scrollableDiv.scrollLeft === 0)
			setAtEnd(scrollableDiv.scrollLeft + scrollableDiv.clientWidth >= scrollableDiv.scrollWidth)
		}
	}

	// Update scroll position when user scrolls
	const handleScroll = () => {
		checkScrollPosition()
	}

	return (
		<div className='relative w-full'>
			{/* Left Arrow (only if scrollable and not at the start) */}
			{isScrollable && !atStart && (
				<div
					className='absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-system-primary-accent opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full p-1'
					onClick={() => scrollableDivRef.current.scrollBy({ left: -200, behavior: 'smooth' })}>
					<img className='inline-block h-5' src={left} alt='Scroll Left' />
				</div>
			)}

			{/* Scrollable Container */}
			<div
				ref={scrollableDivRef}
				id='scrollable-div'
				className='flex flex-row w-full overflow-x-auto gap-2 mt-2 whitespace-nowrap scroll-smooth'
				onScroll={handleScroll} // Listen for scroll events
			>
				{mainScreenUser !== null &&
					remoteUsers
						.filter((user) => user.uid !== mainScreenUser.uid)
						.map((user) => {
							const participant = speakers.find((p) => p.UserId === user.uid)
							return (
								<div
									className='relative h-36 w-64 flex-shrink-0 flex flex-col items-center rounded-lg overflow-hidden'
									key={user.uid}>
									<div
										className='absolute top-0 right-0 mx-2 my-2 z-10 cursor-pointer'
										onClick={() => setMainScreenUser(user)}>
										<span className='material-symbols-outlined'>
											<img className='inline-block h-5' src={fullscreen} alt='Fullscreen' />
										</span>
									</div>
									<RemoteUser cover={participant?.UserAvatar || avatar} user={user} className='w-32 h-32 bg-red-500'>
										<div className='absolute text-xs md:text-sm truncate right-0 rounded-full m-2 bottom-0 font-semibold text-brand-secondary bg-system-primary-accent px-3'>
											{/* {user.uid} */}
											{participant?.UserName}
											{user.hasAudio ? (
												<img className='inline-block h-3' src={mic} alt='Mic On' />
											) : (
												<img src={mic_off} className='inline-block h-3' alt='Mic Off' />
											)}
										</div>
										{isPermitted && role === 'Speaker' && (
											<div className='absolute left-2 bottom-1 flex flex-row gap-2 '>
												<button
													className='bg-white/15 p-2 rounded-full hover:bg-white/30 flex text-system-secondary-bg gap-2 items-center'
													onClick={() =>
														muteUser(speakers.find((p) => p.UserId === participant.uid)?.UserId, 'CAMERATOGGLE')
													}>
													{user.hasVideo ? (
														<img src={camera} className='h-4' />
													) : (
														<img src={camera_off} className='h-4' />
													)}
													{/* {participant.hasVideo ? 'Turn off camera' :'Turned off'} */}
												</button>

												<button
													className='bg-white/15 p-2 rounded-full hover:bg-white/30 flex text-system-secondary-bg gap-2 items-center'
													onClick={() =>
														muteUser(speakers.find((p) => p.UserId === participant.uid)?.UserId, 'MICTOGGLE')
													}>
													{user.hasAudio ? <img src={mic} className='h-4' /> : <img src={mic_off} className='h-4' />}
													{/* {participant.hasAudio ? 'Turn off microphone' : 'Turned off'} */}
												</button>
												<PermanentBlockUser
													muteUser={() =>
														muteUser(
															speakers.find((p) => participant.UserId === participant.uid)?.UserId,
															'BLOCK'
														)
													}
												/>
											</div>
										)}
									</RemoteUser>
								</div>
							)
						})}
			</div>

			{/* Right Arrow (only if scrollable and not at the end) */}
			{isScrollable && !atEnd && (
				<div
					className='absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-system-primary-accent opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full p-1'
					onClick={() => scrollableDivRef.current.scrollBy({ left: 200, behavior: 'smooth' })}>
					<img className='inline-block h-5' src={right} alt='Scroll Right' />
				</div>
			)}
		</div>
	)
}

export default ScrollableRemoteUsersList
