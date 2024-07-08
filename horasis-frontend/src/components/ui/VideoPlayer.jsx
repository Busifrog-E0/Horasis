import React, { useRef, useState } from 'react';
import RangeInput from './RangeInput'; // Import the custom range input component

const VideoPlayer = ({ url }) => {
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [value, setValue] = useState(0); // Initial value for the range input

    // Function to handle range input change
    const handleRangeChange = (event) => {
        setValue(event.target.value); // Update the state with the new value
    };

    // Calculate the percentage value for styling the background gradient
    const percent = ((value - 0) / (100 - 0)) * 100;
    console.log(value, percent)
    // Inline style for the range input background
    const rangeStyle = {
        background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percent}%, #ddd ${percent}%, #ddd 100%)`
    };

    const togglePlay = () => {
        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setPlaying(!playing);
    };

    const handleProgress = () => {
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        progressRef.current.value = progress;
    };

    const handleVolumeChange = (e) => {
        const volume = e.target.value;
        setVolume(volume);
        videoRef.current.volume = volume;
    };

    return (
        <div className="text-white rounded-lg">
            <video
                ref={videoRef}
                onTimeUpdate={handleProgress}
                className="w-full rounded-lg"
                src={url}
                controls={false}
            />
            <div className="mt-4 flex items-center justify-between gap-4">
                <button onClick={togglePlay} className="px-4 py-2 bg-blue-500 rounded">
                    {playing ? 'Pause' : 'Play'}
                </button>
                <input
                    ref={progressRef}
                    type="range"
                    onChange={handleRangeChange}
                    style={rangeStyle}
                    className="w-full h-1 bg-brand-orange-transparent rounded-lg appearance-none"
                    defaultValue="0"
                    max="100"
                />
                <input
                    type="range"
                    className="w-24 h-1"
                    value={volume}
                    onChange={handleVolumeChange}
                    step="0.01"
                    max="1"
                    min="0"
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
