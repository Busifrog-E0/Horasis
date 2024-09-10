import { RemoteUser, useRemoteUsers } from 'agora-rtc-react'
import arrowl from '../../assets/icons/arrowl.svg'
import avatar from '../../assets/icons/avatar.svg'
import people from '../../assets/icons/people.svg'
import mic from '../../assets/icons/streaming/mic.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import { useEffect, useState } from 'react'
import ScrollableRemoteUsersList from './ScrollableRemoteUsersList'
import StickyLocalUserView from './StickyLocalUserView'

const NewStreamUsersList = ({ participants, event, cameraOn, micOn, setCamera, isConnected, calling, setCalling, setMic, role, localCameraTrack, localMicrophoneTrack, currentUser }) => {
	const remoteUsers = useRemoteUsers()
	const [mainScreenUser, setMainScreenUser] = useState(null)

	useEffect(() => {
		if (remoteUsers.length > 0) {
			setMainScreenUser(remoteUsers[0])
		}
	}, [remoteUsers])

	return (
		<div className='flex flex-col h-full overflow-hidden'>
			<div className='flex flex-row gap-4 p-6 items-center border-b border-system-secondary-bg-transparent mb-2'>
				<div className='cursor-pointer' onClick={() => setCalling((a) => !a)}>
					<img src={arrowl} alt='' className='h-6 bg-[#354657] rounded-md' />
				</div>
				<div>
					<p className='text-[#CBD2DA] text-[20px] '>{event.EventName}</p>
				</div>
				<div className='flex flex-row gap-2 p-1 px-3 rounded-md ml-6 items-center bg-[#354657]'>
					<img src={people} alt='' className='h-4 ' />
					<p className='text-white'>{participants.length} + </p>
				</div>
			</div>
			<div className='flex-grow-1 flex-1  overflow-hidden'>
				<div className='h-full flex flex-col overflow-hidden'>
					<div className='flex-1 flex-grow-1 rounded-lg overflow-hidden relative'>
						<StickyLocalUserView localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack} calling={calling} cameraOn={cameraOn} isConnected={isConnected} participants={participants} micOn={micOn} role={role} setCalling={setCalling} setCamera={setCamera} setMic={setMic} currentUser={currentUser} />
						{mainScreenUser !== null && (
							<RemoteUser cover={participants.find((participant) => participant.UserId === mainScreenUser.uid)?.UserAvatar ? participants.find((participant) => participant.UserId === mainScreenUser.uid)?.UserAvatar : avatar} user={mainScreenUser} className='w-32 h-32 bg-red-500'>
								<div className='absolute right-0 rounded-full m-2 bottom-0 font-semibold text-brand-secondary bg-system-primary-accent px-3'>
									{participants.find((participant) => participant.UserId === mainScreenUser.uid)?.UserName} {mainScreenUser.hasAudio ? <img className='inline-block h-4' src={mic}></img> : <img src={mic_off} className='inline-block h-4'></img>}
								</div>
							</RemoteUser>
						)}
					</div>
					<ScrollableRemoteUsersList participants={participants} mainScreenUser={mainScreenUser} remoteUsers={remoteUsers} setMainScreenUser={setMainScreenUser} />
				</div>
			</div>
		</div>
	)
}

export default NewStreamUsersList
