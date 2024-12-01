import React, { useRef, useState } from 'react'

const VideoPlayer = ({ url }) => {
	const videoRef = useRef(null)
	const progressRef = useRef(null)
	const [playing, setPlaying] = useState(false)
	const [volume, setVolume] = useState(1)
	const [isControlsVisible, setControlsVisible] = useState(true)

	const togglePlay = () => {
		if (playing) {
			videoRef.current.pause()
		} else {
			videoRef.current.play()
		}
		setPlaying(!playing)
	}

	const handleProgress = () => {
		const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
		progressRef.current.value = progress
	}

	const handleVolumeChange = (e) => {
		const volume = e.target.value
		setVolume(volume)
		videoRef.current.volume = volume
	}

	const handleSeek = (e) => {
		const seekTime = (e.target.value / 100) * videoRef.current.duration
		videoRef.current.currentTime = seekTime
	}

	const showControls = () => {
		setControlsVisible(true)

		setTimeout(() => {
			setControlsVisible(false)
		}, 600)
	}

	const playOnHover = () => {
		videoRef.current.play()
		setPlaying(true)
	}
	const pauseOnLeave = () => {
		videoRef.current.pause()
		setPlaying(false)
	}

	return (
		<div
			className='relative group w-full max-w-lg mx-auto rounded-lg overflow-hidden'
			onMouseMove={showControls}
			onMouseEnter={playOnHover}
			onMouseLeave={pauseOnLeave}>
			{/* Video */}
			<video ref={videoRef} onTimeUpdate={handleProgress} className='w-full' src={url} controls={false} />
			{/* Controls */}
			<div
				className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
					isControlsVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
				}`}>
				<div className='px-4 py-2 flex items-center justify-between'>
					{/* Play/Pause Button */}
					<button onClick={togglePlay} className='text-white rounded-full'>
						{playing ? (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-10 w-10'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 9v6m4-6v6' />
							</svg>
						) : (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='h-10 w-10' fill='currentColor'>
								<path d='M10 8.5L16 12L10 15.5V8.5Z' />
							</svg>
						)}
					</button>

					{/* Progress Slider */}
					<div className='relative flex-grow mx-4'>
						<input
							type='range'
							ref={progressRef}
							onChange={handleSeek}
							className='w-full h-2 appearance-none bg-gray-300 rounded-lg overflow-hidden  transition-all'
							defaultValue='0'
							max='100'
						/>
					</div>

					{/* Volume Slider */}
					<div className='relative w-24'>
						<input
							type='range'
							className='w-full h-2 appearance-none bg-gray-300 rounded-lg overflow-hidden  transition-all '
							value={volume}
							onChange={handleVolumeChange}
							step='0.01'
							max='1'
							min='0'
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VideoPlayer
