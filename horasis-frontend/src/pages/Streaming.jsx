import {
    LocalUser,
    RemoteUser,
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    usePublish,
    useRemoteUsers,
} from "agora-rtc-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItem } from "../constants/operations";
import { useAuth } from "../utils/AuthProvider";
import { useToast } from "../components/Toast/ToastService";
import VideoPlayer from "../components/Streaming/VideoPlayer";
import testImage from '../assets/images/about-us-image.png'
import camera from '../assets/icons/streaming/camera.svg'
import camera_off from '../assets/icons/streaming/camera_off.svg'
import mic from '../assets/icons/streaming/mic.svg'
import mic_off from '../assets/icons/streaming/mic_off.svg'
import call_end from '../assets/icons/streaming/call_end.svg'
import StreamUsersList from "../components/Streaming/StreamUsersList";

export const Streaming = () => {

    const { updateCurrentUser, currentUserData } = useAuth()
    const toast = useToast()

    const { eventid } = useParams()
    const [loading, setLoading] = useState(true);
    const [calling, setCalling] = useState(false);
    const isConnected = useIsConnected();
    const [appId, setAppId] = useState("206c8a92da8d4676aabfb8314a21fa17");
    const [channel, setChannel] = useState(eventid);
    const [token, setToken] = useState("");

    useJoin({ appid: appId, channel: channel, token: token ? token : null }, calling);

    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);
    usePublish([localMicrophoneTrack, localCameraTrack]);

    const remoteUsers = useRemoteUsers();
    const getToken = () => {
        setLoading(true)
        getItem(
            `event/${eventid}/videoCall/join`,
            (result) => {
                // if (result && result.Token) {
                //     setToken(result.Token)
                // }
                setToken("007eJxTYBDl+aDxnmevYv+bF4t2P8m7GMh1qKL6cKfBZFnzpx/OMLsoMBgZmCVbJFoapSRapJiYmZslJialJVkYG5okGhmmJRqaWyffSGsIZGS4qfWQlZEBAkF8doa81PKQ1OISBgYA+HIh1Q==")
                setLoading(false)
            },
            (err) => {
                setToken("007eJxTYBDl+aDxnmevYv+bF4t2P8m7GMh1qKL6cKfBZFnzpx/OMLsoMBgZmCVbJFoapSRapJiYmZslJialJVkYG5okGhmmJRqaWyffSGsIZGS4qfWQlZEBAkF8doa81PKQ1OISBgYA+HIh1Q==")
                setLoading(false)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    useEffect(() => {
        getToken([])
    }, [])

    // console.log("calling", calling)
    console.log("Local Camera Track:", localCameraTrack);


    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-xl font-semibold text-gray-700">Loading...</div>
                </div>
            ) : (


                isConnected ?
                    <div className="bg-system-primary-accent h-full overflow-hidden">
                        <div className="h-full flex flex-row p-4">
                            <div className="flex-1">
                                <div className="overflow-auto h-full mx-auto">
                                    <StreamUsersList cameraOn={cameraOn} localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack}
                                        micOn={micOn} remoteUsers={remoteUsers} setCamera={setCamera} isConnected={isConnected} calling={calling} setMic={setMic}
                                        setCalling={setCalling} />
                                </div>
                            </div>
                            <div className=" w-96 h-full">
                                <div className="flex flex-col h-full overflow-hidden p-4 bg-system-primary-accent-dim shadow-lg rounded-lg">
                                    <div>
                                        <p>HI </p>
                                    </div>
                                    <hr className="my-3" />
                                    <div className="overflow-auto flex-1 flex-grow-1 w-full">
                                        <div className="bg-brand-backg text-brand-primary p-5 rounded-lg">
                                            <p>Hello </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* */}
                    </div>
                    :
                    <div className="p-6 rounded-lg shadow-md max-w-md mx-auto bg-brand-secondary mt-5">
                        <input
                            onChange={(e) => setAppId(e.target.value)}
                            placeholder="Enter your App ID"
                            value={appId}
                            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            onChange={(e) => setChannel(e.target.value)}
                            placeholder="Enter your Channel Name"
                            value={channel}
                            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Enter your Token"
                            value={token}
                            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            className={`w-full py-2 text-white font-semibold rounded-lg ${!appId || !channel
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                            disabled={!appId || !channel}
                            onClick={() => setCalling(true)}
                        >
                            Join Channel
                        </button>
                    </div>




            )}
        </>
    );
};

export default Streaming;
