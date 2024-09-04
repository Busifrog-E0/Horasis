import './videos.css'
import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ videoTrack, isLocal }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoTrack && videoRef.current) {
            videoTrack.play(videoRef.current);
        }
        return () => {
            if (videoTrack) {
                videoTrack.stop();
            }
        };
    }, [videoTrack]);

    return (
        <div className={`video-container ${isLocal ? 'local' : 'remote'}`}>
            <div ref={videoRef} className="video-player"></div>
        </div>
    );
};

export default VideoPlayer;
