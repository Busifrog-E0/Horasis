import {
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    usePublish,
    useRemoteUsers,
} from "agora-rtc-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItem } from "../constants/operations";
import { useAuth } from "../utils/AuthProvider";
import { useToast } from "../components/Toast/ToastService";
import StreamUsersList from "../components/Streaming/StreamUsersList";
import JoinToStream from "../components/Streaming/JoinToStream";
import StreamParticipantList from "../components/Streaming/StreamParticipantList";

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

    let newUser = useJoin({ appid: appId, channel: channel, token: token ? token : null }, calling);

    useEffect(() => {
        console.log(newUser)
    }, [newUser])

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
                            <StreamUsersList cameraOn={cameraOn} localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack}
                                micOn={micOn} remoteUsers={remoteUsers} setCamera={setCamera} isConnected={isConnected} calling={calling} setMic={setMic}
                                setCalling={setCalling} />

                            <div className=" w-96 h-full">
                                <StreamParticipantList />
                            </div>
                        </div>
                        {/* */}
                    </div>
                    :
                    <JoinToStream appId={appId} channel={channel} setAppId={setAppId} setCalling={setCalling} setChannel={setChannel} setToken={setToken} token={token} />
            )}
        </>
    );
};

export default Streaming;
