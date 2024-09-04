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

export const Streaming = () => {

    const { updateCurrentUser, currentUserData } = useAuth()
    const toast = useToast()

    const { eventid } = useParams()
    const [loading, setLoading] = useState(true);
    const [calling, setCalling] = useState(false);
    const isConnected = useIsConnected();
    const [appId, setAppId] = useState("");
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
                if (result && result.Token) {
                    setToken(result.Token)
                }
                setLoading(false)
            },
            (err) => {
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
                <div className="min-h-screen bg-gray-100">
                    <div className="container mx-auto p-4">
                        {isConnected ? (
                            <div className="room bg-white p-6 rounded-lg shadow-md">
                                <div className="user-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="user flex flex-col items-center">
                                        <LocalUser
                                            audioTrack={localMicrophoneTrack}
                                            cameraOn={cameraOn}
                                            micOn={micOn}
                                            videoTrack={localCameraTrack}
                                            cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                                            className="rounded-full w-32 h-32"
                                        >
                                            <span className="user-name text-center mt-2 text-lg font-semibold">You</span>
                                        </LocalUser>
                                    </div>
                                    {remoteUsers.map((user) => (
                                        <div className="user flex flex-col items-center" key={user.uid}>
                                            <RemoteUser
                                                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                                                user={user}
                                                className="rounded-full w-32 h-32"
                                            >
                                                <span className="user-name text-center mt-2 text-lg font-semibold">
                                                    {user.uid}
                                                </span>
                                            </RemoteUser>
                                        </div>
                                    ))}



                                </div>
                            </div>
                        ) : (
                            <div className="join-room bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
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
                        {isConnected && (
                            <div className="control mt-6 flex justify-between items-center">
                                <div className="left-control flex space-x-4">
                                    <button
                                        className="btn bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                                        onClick={() => setMic((a) => !a)}
                                    >
                                        <i className={`i-microphone ${!micOn ? "off" : ""}`} />
                                    </button>
                                    <button
                                        className="btn bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                                        onClick={() => setCamera((a) => !a)}
                                    >
                                        <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
                                    </button>
                                </div>
                                <button
                                    className={`btn btn-phone p-2 rounded-full ${calling ? "bg-red-500" : "bg-green-500"
                                        } text-white`}
                                    onClick={() => setCalling((a) => !a)}
                                >
                                    {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Streaming;
