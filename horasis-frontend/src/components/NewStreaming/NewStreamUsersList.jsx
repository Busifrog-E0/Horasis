import { RemoteUser, useRemoteUsers } from 'agora-rtc-react'
import arrowl from '../../assets/icons/arrowl.svg'
import avatar from '../../assets/icons/avatar.svg'
import people from '../../assets/icons/people.svg'
import mic from '../../assets/icons/streaming/mic.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import { useEffect, useState } from 'react'
import ScrollableRemoteUsersList from './ScrollableRemoteUsersList'
import StickyLocalUserView from './StickyLocalUserView'

const NewStreamUsersList = ({ participants, event, cameraOn, micOn, setCamera, isConnected, calling, setCalling, setMic, role, localCameraTrack, localMicrophoneTrack, currentUser, setModalOpen,speakers,muteUser }) => {
	const remoteUsers = useRemoteUsers()
	const [mainScreenUser, setMainScreenUser] = useState(null)

	useEffect(() => {
		if (remoteUsers.length > 0) {
			setMainScreenUser(remoteUsers[0])
		} else {
			setMainScreenUser(null)
		}
	}, [remoteUsers])

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
					<p className='text-white'>{participants.length + speakers.length } + </p>
				</div>
				<div className='flex md:hidden flex-row gap-2 p-1 px-3 rounded-md ml-6 items-center bg-[#354657]' onClick={() => setModalOpen(true)}>
					<img src={people} alt='' className='h-4 ' />
					<p className='text-white'>{participants.length + speakers.length} + </p>
				</div>
			</div>
			<div className='flex-grow-1 flex-1  overflow-hidden '>
				<div className='h-full flex flex-col overflow-hidden'>
					<div className='flex-1 flex-grow-1 rounded-lg overflow-hidden relative flex '>
						<StickyLocalUserView localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack} calling={calling} cameraOn={cameraOn} isConnected={isConnected} participants={participants} micOn={micOn} role={role} setCalling={setCalling} setCamera={setCamera} setMic={setMic} currentUser={currentUser} speakers={speakers} />
						{mainScreenUser !== null && (
							<RemoteUser cover={speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserAvatar ? speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserAvatar : avatar} user={mainScreenUser} className='w-32 h-32 bg-red-500'>
								<div className='absolute right-0 rounded-full m-2 bottom-0 font-semibold text-brand-secondary bg-system-primary-accent px-3'>
									{participants.find((participant) => participant.UserId === mainScreenUser.uid)?.UserName} {mainScreenUser.hasAudio ? <img className='inline-block h-4' src={mic}></img> : <img src={mic_off} className='inline-block h-4'></img>}
								</div>
								<button onClick={()=>muteUser(speakers.find((participant) => participant.UserId === mainScreenUser.uid)?.UserRtcUid)} className='bg-red-600'>Turn of mic</button>
								
							</RemoteUser>
						)}
					</div>
					<ScrollableRemoteUsersList participants={participants} mainScreenUser={mainScreenUser} remoteUsers={remoteUsers} setMainScreenUser={setMainScreenUser} speakers={speakers} muteUser={muteUser} />
				</div>
			</div>
		</div>
	)
}

export default NewStreamUsersList
