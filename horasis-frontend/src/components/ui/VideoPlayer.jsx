import React, { useRef, useState } from 'react'
import VideoControls from './VideoControls'
import play from '../../assets/icons/streaming/play.svg'
import pause from '../../assets/icons/streaming/pause.svg'

const VideoPlayer = ({ url }) => {
	const videoRef = useRef(null)
	const containerRef = useRef(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isMuted, setIsMuted] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [volume, setVolume] = useState(1)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

	const [showCenterButton, setShowCenterButton] = useState(false)

	const togglePlay = (e) => {
		e.stopPropagation()
		if (isPlaying) {
			videoRef.current.pause()
		} else {
			videoRef.current.play()
		}
		setIsPlaying(!isPlaying)
		setShowCenterButton(true)

		// Hide the center button after 1 second
		setTimeout(() => setShowCenterButton(false), 1000)
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

	const handleMute = (e) => {
		e.stopPropagation()
		if (isMuted) {
			setIsMuted(false)
			setVolume(0.5)
			videoRef.current.volume = 0.5
		} else {
			setIsMuted(true)
			setVolume(0)
			videoRef.current.volume = 0
		}
	}

	const handleTimeUpdate = () => {
		setCurrentTime(videoRef.current.currentTime)
	}

	const handleFullscreen = (e) => {
		e.stopPropagation()
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

	const playOnEnter = () => {
		videoRef.current.play()
		setIsPlaying(true)
	}

	const pauseOnLeave = () => {
		videoRef.current.pause()
		setIsPlaying(false)
	}

	return (
		<div
			onClick={togglePlay}
			ref={containerRef}
			className={`relative bg-black rounded-md overflow-hidden ${
				isFullscreen ? 'w-full h-full fixed top-0 left-0 z-50' : 'w-full h-full'
			}`}>
			{/* Center play/pause button with transition */}
			<div
				className={`absolute inset-0 flex items-center justify-center  transition-all duration-700 ease-in-out  ${
					!showCenterButton ? 'opacity-0 scale-100' : 'opacity-80 scale-[2]'
				}`}>
				<button onClick={togglePlay} className='bg-transparent border-none'>
					{isPlaying ? (
						<img
							src={pause}
							alt='Pause'
							className={`h-10 w-10 text-white transform transition-all duration-500 ease-in-out scale-150 opacity-100 bg-system-black-transparent rounded-full p-1`}
						/>
					) : (
						<img
							src={play}
							alt='Play'
							className={`h-10 w-10 text-white transform transition-all duration-500 ease-in-out scale-150 opacity-100 bg-system-black-transparent rounded-full p-1`}
						/>
					)}
				</button>
			</div>

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
