import { LocalUser, RemoteUser } from 'agora-rtc-react';
import testImage from '../../assets/images/about-us-image.png'
import camera from '../../assets/icons/streaming/camera.svg'
import camera_off from '../../assets/icons/streaming/camera_off.svg'
import mic from '../../assets/icons/streaming/mic.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import call_end from '../../assets/icons/streaming/call_end.svg'
import arrowl from '../../assets/icons/arrowl.svg'
import people from '../../assets/icons/people.svg'



const StreamUsersList = ({ event, localMicrophoneTrack, cameraOn, micOn, localCameraTrack, setCamera, remoteUsers, isConnected, calling, setCalling, setMic }) => {



    return (
        <div className="flex-1">
            <div className='flex flex-row gap-4 p-6 items-start border-b-2 '>
                <div>

                    <img src={arrowl} alt='' className='h-6 bg-[#354657] ' />
                </div>
                <div>

                    <p className='text-[#CBD2DA] text-[20px] '>{event.EventName}</p>
                </div>
                <div className='flex flex-row gap-2 p-1 ml-6 items-center bg-[#354657]'>

                    <img src={people} alt='' className='h-4 ' />
                    <p className='text-white'>415+ </p>
                </div>

            </div>


            <div className="overflow-auto h-full mx-auto">
                <div className="overflow-hidden rounded-lg">
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 p-4">
                        <div className=" h-96 flex flex-col items-center">
                            <LocalUser
                                audioTrack={localMicrophoneTrack}
                                cameraOn={cameraOn}
                                micOn={micOn}
                                videoTrack={localCameraTrack}
                                cover={testImage}
                                className="w-32 h-32 bg-orange-500 relative"
                            >
                                <div className="absolute left-0 right-0 p-4 py-3 rounded-t bottom-4 ">
                                    {isConnected && (
                                        <div className="flex justify-center items-center">
                                            <div className="flex space-x-5 justify-center items-center">
                                                <button
                                                    className="bg-brand-btn-prim p-2 rounded-full hover:bg-brand-seagreen-dim"
                                                    onClick={() => setCamera((a) => !a)}
                                                >
                                                    {cameraOn ? <img src={camera}></img> : <img src={camera_off}></img>}
                                                </button>
                                                <button
                                                    className={`btn btn-phone p-4 rounded-lg ${calling ? "bg-red-500" : "bg-green-500"
                                                        } text-white`}
                                                    onClick={() => setCalling((a) => !a)}
                                                >
                                                    {calling ? <img src={call_end}></img> : <img src={call_end}></img>}
                                                </button>
                                                <button
                                                    className="bg-brand-btn-prim p-2 rounded-full hover:bg-brand-seagreen-dim"
                                                    onClick={() => setMic((a) => !a)}
                                                >
                                                    {micOn ? <img src={mic}></img> : <img src={mic_off}></img>}
                                                </button>
                                            </div>

                                        </div>
                                    )}
                                </div>
                                <span className="absolute right-0 rounded-t bottom-0 font-semibold text-brand-secondary bg-system-primary-accent px-3">
                                    {"You"} {micOn ?
                                        <img className="inline-block h-4" src={mic}></img>
                                        : <img src={mic_off} className="inline-block h-4" ></img>}
                                </span>
                            </LocalUser>
                        </div>
                        {remoteUsers.map((user) => (
                            <div className=" h-96 flex flex-col items-center" key={user.uid}>
                                <RemoteUser
                                    cover={testImage}
                                    user={user}
                                    className=" w-32 h-32 bg-red-500"
                                >
                                    <div className="absolute right-0 rounded-t bottom-0 font-semibold text-brand-secondary bg-system-primary-accent px-3">
                                        {user.uid} {user.hasAudio ?
                                            <img className="inline-block h-4" src={mic}></img>
                                            : <img src={mic_off} className="inline-block h-4" ></img>}
                                    </div>
                                </RemoteUser>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamUsersList;
