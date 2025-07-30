import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useGetList from '../../hooks/useGetList'
import { getMonthsShort } from '../../utils/date'
import EmptyMembers from '../Common/EmptyMembers'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

const TodaysEventTab = () => {
	const navigate = useNavigate()
	const { isLoading, data: events } = useGetList('events', {
		[`StartTime[$gte]`]: new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate(),
			0,
			0,
			0,
			0
		).getTime(),
		[`StartTime[$lte]`]: new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate() + 1,
			0,
			0,
			0,
			0
		).getTime(),
	},false)

	const sliderRef = useRef(null)
	// Function to handle scrolling to the next or previous slide
	const handleScroll = (direction) => {
		if (sliderRef.current) {
			const scrollAmount = sliderRef.current.clientWidth
			if (direction === 'next') {
				sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
			} else {
				sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
			}
		}
	}

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					{events.length > 0 ? (
						<>
							{/* Slider Container */}
							<div className='relative'>
								{/* Scrollable Container */}
								<div
									ref={sliderRef}
									className='flex overflow-x-scroll scroll-snap-x snap-mandatory snap-x space-x-4 pb-4'
									style={{ scrollBehavior: 'smooth' }}>
									{events.map((item) => (
										<div
											key={item.DocId}
											className='snap-center flex-shrink-0 w-full bg-system-secondary-bg rounded-lg overflow-hidden shadow-lg'>
											<div className='h-24 bg-system-secondary-bg relative overflow-hidden'>
												<img src={item.CoverPicture} className='object-cover h-full w-full' alt='event cover' />
												<div className='absolute top-0 right-0 p-2'>
													<Button
														loading={false}
														onClick={() => {
															navigate(`/Events/${item.DocId}`)
														}}
														variant='black'
														width='full'>
														Join Event
													</Button>
												</div>
											</div>
											<div className='p-3 px-2 grid grid-cols-5 gap-3 items-center'>
												<div className='p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex flex-col items-center h-full justify-center'>
													<h4 className='text-sm text-center text-system-primary-text m-0'>
														{getMonthsShort(item.Date)}
													</h4>
													<h4 className='font-semibold text-xl text-center text-system-primary-text m-0'>
														{new Date(item.Date).getDate()}
													</h4>
												</div>
												<div className='col-span-4 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg h-full'>
													<h4 className='text-base text-system-primary-text m-0 leading-5'>{item.EventName}</h4>
													<h4 className='text-xs text-brand-gray-dim line-clamp-2'>{item.Description}</h4>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Navigation Buttons */}
								{events.length > 1 && (
									<>
										<button
											className='absolute top-1/2 left-0 transform -translate-y-1/2 bg-system-primary-accent-transparent mx-2 text-system-secondary-bg  rounded-full shadow-lg h-6 w-6'
											onClick={() => handleScroll('prev')}>
											‹
										</button>
										<button
											className='absolute top-1/2 right-0 transform -translate-y-1/2 bg-system-primary-accent-transparent mx-2 text-system-secondary-bg  rounded-full shadow-lg h-6 w-6'
											onClick={() => handleScroll('next')}>
											›
										</button>
									</>
								)}
							</div>
						</>
					) : (
						<EmptyMembers emptyText={'No Events available today.'} />
					)}
				</>
			)}
		</>
	)
}

export default TodaysEventTab
