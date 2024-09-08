import { LocalUser, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish } from "agora-rtc-react"
import avatar from '../../assets/icons/avatar.svg'
import call_end from '../../assets/icons/streaming/call_end.svg'
import camera from '../../assets/icons/streaming/camera.svg'
import camera_off from '../../assets/icons/streaming/camera_off.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import mic from '../../assets/icons/streaming/mic.svg'

const StickyLocalUserView = ({ calling, role, cameraOn, micOn, isConnected, setCamera, setCalling, setMic }) => {

    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn)
    const { localCameraTrack } = useLocalCameraTrack(cameraOn)
    usePublish([localMicrophoneTrack, localCameraTrack])
    return <>
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
    </>
}

export default StickyLocalUserView