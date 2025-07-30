import React, { useState } from 'react'
import outlinecircle from '../../assets/icons/outlinecircle.svg'
import filledcircle from '../../assets/icons/filledcircle.svg'
import left from '../../assets/icons/left.svg'
import right from '../../assets/icons/right.svg'
import VideoPlayer from '../../components/ui/VideoPlayer'

const ActivityCarousel = ({ slides }) => {
	const [currentIndex, setCurrentIndex] = useState(0)

	const prevSlide = () => {
		const isFirstSlide = currentIndex === 0
		const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
		setCurrentIndex(newIndex)
	}

	const nextSlide = () => {
		const isLastSlide = currentIndex === slides.length - 1
		const newIndex = isLastSlide ? 0 : currentIndex + 1
		setCurrentIndex(newIndex)
	}

	const goToSlide = (slideIndex) => {
		setCurrentIndex(slideIndex)
	}

	return (
		<div className='w-full h-96 m-auto mb-6 mt-3 relative bg-black rounded-md overflow-hidden'>
			{slides[currentIndex].Type === 'image' && (
				<img
					src={slides[currentIndex].FileUrl}
					className='w-full h-full rounded-2xl bg-center bg-cover duration-500 object-contain'></img>
			)}
			{slides[currentIndex].Type === 'video' && (
				<>
					{/* <video
					key={slides[currentIndex].FileUrl}
					playsInline
					className='w-full h-full rounded-2xl bg-center bg-cover duration-500 bg-system-primary-text'
					// autoPlay
					muted
					controls
					controlsList='nodownload'>
					<source src={slides[currentIndex].FileUrl} type='video/mp4' />
				</video> */}
					<VideoPlayer url={slides[currentIndex].FileUrl} />
				</>
			)}
			{slides.length !== 1 && (
				<>
					{/* Left Arrow */}
					<div
						className=' absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2  text-system-primary-bg cursor-pointer'
						onClick={prevSlide}>
						<img src={left} />
					</div>
					{/* Right Arrow */}
					<div
						className=' absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2  text-system-primary-bg cursor-pointer'
						onClick={nextSlide}>
						<img src={right} />
					</div>
					<div className='flex top-4 justify-center py-2 items-center'>
						{slides.map((slide, slideIndex) => (
							<div key={slideIndex} onClick={() => goToSlide(slideIndex)} className='cursor-pointer'>
								{slideIndex === currentIndex ? (
									<img src={filledcircle} className='h-4 w-4' />
								) : (
									<img src={outlinecircle} className='h-3 w-3' />
								)}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default ActivityCarousel
