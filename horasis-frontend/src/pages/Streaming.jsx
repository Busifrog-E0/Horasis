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

export const Streaming = () => {

    const { updateCurrentUser, currentUserData } = useAuth()
    const toast = useToast()

    const { eventid } = useParams()
    const [loading, setLoading] = useState(true);
    // Define state variables
    const [calling, setCalling] = useState(false);
    const isConnected = useIsConnected(); // Store the user's connection status
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
                // console.log('Suggested')
                if (result && result.Token) {
                    setToken(result.Token)
                }
                setLoading(false)
            },
            (err) => {
                setLoading(false)
                // console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    useEffect(() => {
        getToken([])
    }, [])


    useJoin({ appid: appId, channel: channel, token: token ? token : null }, calling);
    console.log("calling", calling)

    return (
        <>
            {
                loading ?
                    <>
                        Loading...
                    </>
                    :
                    <>
                        <div className="room">
                            {isConnected ? (
                                <div className="user-list">
                                    <div className="user">
                                        <LocalUser
                                            audioTrack={localMicrophoneTrack}
                                            cameraOn={cameraOn}
                                            micOn={micOn}
                                            videoTrack={localCameraTrack}
                                            cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                                        >
                                            <samp className="user-name">You</samp>
                                        </LocalUser>
                                    </div>
                                    {remoteUsers.map((user) => (
                                        <div className="user" key={user.uid}>
                                            <RemoteUser cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg" user={user}>
                                                <samp className="user-name">{user.uid}</samp>
                                            </RemoteUser>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="join-room">
                                    <input
                                        onChange={e => setAppId(e.target.value)}
                                        placeholder="<Your app ID>"
                                        value={appId}
                                    />
                                    <input
                                        onChange={e => setChannel(e.target.value)}
                                        placeholder="<Your channel Name>"
                                        value={channel}
                                    />
                                    <input
                                        onChange={e => setToken(e.target.value)}
                                        placeholder="<Your token>"
                                        value={token}
                                    />

                                    <button
                                        className={`join-channel ${!appId || !channel ? "disabled" : ""}`}
                                        disabled={!appId || !channel}
                                        onClick={() => setCalling(true)}
                                    >
                                        <span>Join Channel</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        {isConnected && (
                            <div className="control">
                                <div className="left-control">
                                    <button className="btn" onClick={() => setMic(a => !a)}>
                                        <i className={`i-microphone ${!micOn ? "off" : ""}`} />
                                    </button>
                                    <button className="btn" onClick={() => setCamera(a => !a)}>
                                        <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
                                    </button>
                                </div>
                                <button
                                    className={`btn btn-phone ${calling ? "btn-phone-active" : ""}`}
                                    onClick={() => setCalling(a => !a)}
                                >
                                    {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
                                </button>
                            </div>
                        )}
                    </>
            }
        </>
    );
};

export default Streaming;
