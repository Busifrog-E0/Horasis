import React, { useRef, useState } from 'react'
import VideoControls from './VideoControls'

const VideoPlayer = ({ url }) => {
	const videoRef = useRef(null) // Reference to the video element
	const containerRef = useRef(null) // Reference to the outer container
	const [isPlaying, setIsPlaying] = useState(false)
	const [isMuted, setIsMuted] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [volume, setVolume] = useState(1) // Volume range is 0 to 1
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

	const togglePlay = () => {
		if (isPlaying) {
			videoRef.current.pause()
		} else {
			videoRef.current.play()
		}
		setIsPlaying(!isPlaying)
	}

	const handleVolumeChange = (newVolume) => {
		setVolume(newVolume)
		videoRef.current.volume = newVolume
		if (newVolume === 0) {
			setIsMuted(true)
		} else {
			setIsMuted(false)
		}
	}

	const handleMute = () => {
		if (isMuted) {
			setIsMuted(false)
			setVolume(0.5) // Restore volume to a default level (e.g., 50%) when unmuting
			videoRef.current.volume = 0.5
		} else {
			setIsMuted(true)
			setVolume(0) // Set volume to 0 when muted
			videoRef.current.volume = 0
		}
	}

	const handleTimeUpdate = () => {
		setCurrentTime(videoRef.current.currentTime)
	}

	const handleFullscreen = () => {
		if (!isFullscreen) {
			if (containerRef.current.requestFullscreen) {
				containerRef.current.requestFullscreen()
			} else if (containerRef.current.webkitRequestFullscreen) {
				containerRef.current.webkitRequestFullscreen()
			} else if (containerRef.current.mozRequestFullScreen) {
				containerRef.current.mozRequestFullScreen()
			} else if (containerRef.current.msRequestFullscreen) {
				containerRef.current.msRequestFullscreen()
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen()
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen()
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen()
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen()
			}
		}
		setIsFullscreen(!isFullscreen)
	}

	const handleProgressChange = (newTime) => {
		videoRef.current.currentTime = newTime
		setCurrentTime(newTime)
	}

	const playOnEnter =()=>{
		videoRef.current.play()
		setIsPlaying(true)
	}

	const pauseOnLeave = ()=>{
		videoRef.current.pause()
		setIsPlaying(false)
	}

	return (
		<div
			ref={containerRef}
			className={`relative bg-black rounded-md overflow-hidden ${isFullscreen ? 'w-full h-full fixed top-0 left-0 z-50' : 'w-full h-full'}`} >
			<video
				ref={videoRef}
				src={url}
				className='w-full h-full'
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={() => setDuration(videoRef.current.duration)}
				controls={false} // Disable default controls
			/>
			<VideoControls
				isPlaying={isPlaying}
				onPlayPause={togglePlay}
				isMuted={isMuted}
				onMute={handleMute}
				volume={volume}
				onVolumeChange={handleVolumeChange}
				currentTime={currentTime}
				duration={duration}
				onProgressChange={handleProgressChange}
				onFullscreen={handleFullscreen}
				isFullscreen={isFullscreen}
			/>
		</div>
	)
}

export default VideoPlayer
