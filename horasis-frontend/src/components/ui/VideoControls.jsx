import React from 'react'
import volumeoff from '../../assets/icons/streaming/volume_off.svg'
import volumeon from '../../assets/icons/streaming/volume_on.svg'
import play from '../../assets/icons/streaming/play.svg'
import pause from '../../assets/icons/streaming/pause.svg'
import fullscreenenter from '../../assets/icons/streaming/fullscreen_enter.svg'
import fullscreenexit from '../../assets/icons/streaming/fullscreen_exit.svg'

const VideoControls = ({
	isPlaying,
	onPlayPause,
	isMuted,
	onMute,
	volume,
	onVolumeChange,
	currentTime,
	duration,
	onProgressChange,
	onFullscreen,
	isFullscreen,
}) => {
	const formatTime = (time) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	return (
		<div className='absolute bottom-0 left-0 right-0  text-white p-3'>
			{/* Progress Bar */}
			<div className='flex items-center space-x-3'>
				{/* <span>{formatTime(currentTime)}</span> */}
				<div
					className='flex-grow h-1 hover:h-2 bg-system-secondary-bg-transparent rounded relative cursor-pointer'
					onClick={(e) => {
						const rect = e.target.getBoundingClientRect()
						const percent = (e.clientX - rect.left) / rect.width
						onProgressChange(duration * percent)
					}}>
					<div
						className='h-full bg-system-secondary-bg rounded'
						style={{ width: `${(currentTime / duration) * 100}%` }}
					/>
				</div>
				{/* <span>{formatTime(duration)}</span> */}
			</div>

			{/* Controls */}
			<div className='flex items-center justify-between mt-3'>
				<div className='flex gap-2'>
					{/* Play/Pause Button */}
					<button onClick={onPlayPause} className='text-xl'>
						{isPlaying ? <img className='h-6' src={pause} /> : <img className='h-6' src={play} />}
					</button>

					{/* Volume Controls */}
					<div className='flex items-center space-x-2 group'>
						<button onClick={onMute} className='text-xl'>
							{isMuted ? <img className='h-6' src={volumeoff} /> : <img className='h-6' src={volumeon} />}
						</button>
						<div
							className=' h-1 hover:h-2 w-0 group-hover:w-24 bg-system-secondary-bg-transparent rounded relative cursor-pointer transition-all duration-300'
							onClick={(e) => {
								const rect = e.target.getBoundingClientRect()
								const percent = (e.clientX - rect.left) / rect.width
								onVolumeChange(percent)
							}}>
							<div className='h-full bg-system-secondary-bg rounded' style={{ width: `${volume * 100}%` }} />
						</div>
					</div>

					<div className='flex items-center space-x-1 text-sm'>
						<span className='text-sm'>{formatTime(currentTime)}</span> <span className='text-sm'>|</span> <span className='text-sm'>{formatTime(duration)}</span>
					</div>
				</div>

				{/* Fullscreen Button */}
				<button onClick={onFullscreen} className='text-xl'>
					{isFullscreen ? <img className='h-6' src={fullscreenexit} /> : <img className='h-6' src={fullscreenenter} />}
				</button>
			</div>
		</div>
	)
}

export default VideoControls
