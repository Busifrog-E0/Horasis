import { LocalUser, RemoteUser } from 'agora-rtc-react'
import arrowl from '../../assets/icons/arrowl.svg'
import avatar from '../../assets/icons/avatar.svg'
import people from '../../assets/icons/people.svg'
import call_end from '../../assets/icons/streaming/call_end.svg'
import camera from '../../assets/icons/streaming/camera.svg'
import camera_off from '../../assets/icons/streaming/camera_off.svg'
import mic from '../../assets/icons/streaming/mic.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import { useEffect, useState } from 'react'
import ScrollableRemoteUsersList from './ScrollableRemoteUsersList'

const StreamUsersList = ({ event, localMicrophoneTrack, cameraOn, micOn, localCameraTrack, setCamera, remoteUsers, isConnected, calling, setCalling, setMic, role, currentUser }) => {

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
                    <p className='text-white'>415 + </p>
                </div>
            </div>
            <div className='flex-grow-1 flex-1  overflow-hidden'>
                <div className='h-full flex flex-col overflow-hidden'>
                    <div className='flex-1 flex-grow-1 rounded-lg overflow-hidden relative'>
                        {role === 'Speaker' && (
                            <div className='z-10 absolute top-0 right-0 p-2'>
                                <div className=' h-44 w-60 flex flex-col items-center rounded-lg overflow-hidden'>
                                    <LocalUser audioTrack={localMicrophoneTrack} cameraOn={cameraOn} micOn={micOn} videoTrack={localCameraTrack} cover={avatar}
                                        className='w-32 h-32 relative p-0'>
                                        <div className='absolute left-0 right-0 rounded-t bottom-2'>
                                            {isConnected && (
                                                <div className='flex justify-center items-center'>
                                                    <div className='flex space-x-5 justify-center items-center'>
                                                        <button className='bg-brand-btn-prim p-2 rounded-full hover:bg-brand-seagreen-dim' onClick={() => setCamera((a) => !a)}>
                                                            {cameraOn ? <img src={camera}></img> : <img src={camera_off}></img>}
                                                        </button>
                                                        <button className={`btn btn-phone p-3 rounded-lg ${calling ? 'bg-red-500' : 'bg-green-500'} text-white`} onClick={() => setCalling((a) => !a)}>
                                                            {calling ? <img src={call_end}></img> : <img src={call_end}></img>}
                                                        </button>
                                                        <button className='bg-brand-btn-prim p-2 rounded-full hover:bg-brand-seagreen-dim' onClick={() => setMic((a) => !a)}>
                                                            {micOn ? <img src={mic}></img> : <img src={mic_off}></img>}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className='absolute right-0  text-xs  top-0 font-semibold text-brand-secondary bg-system-primary-accent px-3 m-1 rounded-full'>
                                            {'You'} {micOn ? <img className='inline-block h-3' src={mic}></img> : <img src={mic_off} className='inline-block h-3'></img>}
                                        </span>
                                    </LocalUser>
                                </div>
                            </div>
                        )}
                        {mainScreenUser !== null &&
                            <RemoteUser cover={avatar} user={mainScreenUser} className='w-32 h-32 bg-red-500'>
                                <div className='absolute right-0 rounded-full m-2 bottom-0 font-semibold text-brand-secondary bg-system-primary-accent px-3'>
                                    {mainScreenUser.uid} {mainScreenUser.hasAudio ? <img className='inline-block h-4' src={mic}></img> : <img src={mic_off} className='inline-block h-4'></img>}
                                </div>
                            </RemoteUser>
                        }
                    </div>
                    <ScrollableRemoteUsersList mainScreenUser={mainScreenUser} remoteUsers={remoteUsers} setMainScreenUser={setMainScreenUser} />
                </div>
            </div>
        </div>
    )
}

export default StreamUsersList
