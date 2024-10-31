import { LocalUser, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish } from 'agora-rtc-react'
import avatar from '../../assets/icons/avatar.svg'
import call_end from '../../assets/icons/streaming/call_end.svg'
import camera from '../../assets/icons/streaming/camera.svg'
import camera_off from '../../assets/icons/streaming/camera_off.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import mic from '../../assets/icons/streaming/mic.svg'

const StickyLocalUserView = ({
	participants,
	calling,
	role,
	cameraOn,
	micOn,
	isConnected,
	setCamera,
	setCalling,
	setMic,
	localCameraTrack,
	localMicrophoneTrack,
	currentUser,
	speakers,
	blocked,
}) => {
	return (
		<>
			{role === 'Speaker' && (
				<div className='z-10 absolute top-0 right-0 p-2'>
					<div className='h-44 w-40 md:w-60 flex flex-col items-center rounded-lg overflow-hidden'>
						<LocalUser
							playAudio={false}
							audioTrack={localMicrophoneTrack}
							cameraOn={cameraOn}
							micOn={micOn}
							videoTrack={localCameraTrack}
							cover={currentUser?.ProfilePicture ? currentUser?.ProfilePicture : avatar}
							className='w-32 h-32 relative p-0'>
							<div className='absolute left-0 right-0 rounded-t bottom-3'>
								{isConnected && (
									<div className='flex justify-center items-center'>
										<div className='flex space-x-4 justify-center items-center'>
											<button
												className={`${
													!blocked ? 'bg-system-primary-accent hover:bg-brand-seagreen-dim' : 'bg-gray-500'
												} p-2 rounded-full`}
												onClick={() => setCamera((a) => !a)}
												disabled={blocked}>
												{cameraOn ? (
													<img src={camera} className='h-4'></img>
												) : (
													<img src={camera_off} className='h-4'></img>
												)}
											</button>
											<button
												className={`btn btn-phone p-2 rounded-lg ${calling ? 'bg-red-500' : 'bg-green-500'} text-white`}
												onClick={() => setCalling((a) => !a)}>
												{calling ? (
													<img src={call_end} className='h-6'></img>
												) : (
													<img src={call_end} className='h-6'></img>
												)}
											</button>
											<button
												className={`${
													!blocked ? 'bg-system-primary-accent hover:bg-brand-seagreen-dim' : 'bg-gray-500'
												} p-2 rounded-full`}
												onClick={() => setMic((a) => !a)}
												disabled={blocked}>
												{micOn ? <img src={mic} className='h-4'></img> : <img src={mic_off} className='h-4'></img>}
											</button>
										</div>
									</div>
								)}
							</div>
							<span className='absolute right-0  text-xs  top-0 font-semibold text-brand-secondary bg-system-primary-accent px-3 m-1 rounded-full'>
								{'You'}{' '}
								{micOn ? (
									<img className='inline-block h-3' src={mic}></img>
								) : (
									<img src={mic_off} className='inline-block h-3'></img>
								)}
							</span>
						</LocalUser>
					</div>
				</div>
			)}
		</>
	)
}

export default StickyLocalUserView
