import { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import cover from '../../assets/icons/cover.svg'
import useGetList from '../../hooks/useGetList'
import { useAuth } from '../../utils/AuthProvider'
import { getMonthsShort } from '../../utils/date'
import moment from 'moment'
import saoPaulo from '../../assets/images/home/sao-paulo.jpg'

const HomeUpcomingEvent = (props, ref) => {
	const navigate = useNavigate()
	const { data: guestEvents } = useGetList(`guest/events`, { Limit: 3 })
	const { currentUserData } = useAuth()

	return (
		<div className='h-max flex flex-col items-center bg-system-secondary-bg' ref={ref}>
			<div className='flex items-center justify-center my-20 max-w-screen-2xl w-full '>
				<div className='w-11/12  md:w-9/12 flex flex-col gap-6 '>
					<div className='flex flex-col lg:flex-row justify-between gap-6 '>
						<h1 className='text-xl font-medium text-system-primary-accent'>Upcoming Events</h1>
						{/* <div className='flex flex-wrap gap-4'>
							<button className='px-6 py-3 bg-blue-100 rounded-full text-md font-medium text-system-primary-accent'>
								Weekdays
							</button>
							<button className='px-6 py-3 bg-blue-100 rounded-full text-md font-medium text-system-primary-accent'>
								Event Type
							</button>
							<button className='px-6 py-3 bg-blue-100 rounded-full text-md font-medium text-system-primary-accent'>
								Any Category
							</button>
						</div> */}
					</div>
					{moment().isBefore(moment('7 October 2025')) && (
						<section class='border rounded-2xl max-w-96 container lg:max-w-none  mx-auto lg:mx-none'>
							<div class='flex flex-col-reverse lg:flex-row items-center'>
								<div className='px-10 py-10 lg:py-4'>
									<h2 class='text-3xl font-semibold mb-2'>Horasis Global Meeting 2025</h2>
									<p class=' bg-system-primary-accent text-system-primary-bg px-2 py-1 rounded-full text-base inline'>
										São Paulo, Brazil | 7–10 October
									</p>
									<p className='mt-2'>
										Theme: <span className='font-semibold'>Harnessing the Power of Cooperation</span>. Join 1,000+
										leaders to transform global challenges into shared opportunities.
									</p>
									{/* <a href='#details' class='mt-6 inline-block text-blue-800 font-semibold hover:underline'>
									Learn More &rarr;
								</a> */}
								</div>
								<div className='flex items-center justify-end'>
									<img src={saoPaulo} alt='São Paulo Skyline' class='rounded-t-2xl lg:rounded-tl-none rounded-br-none lg:rounded-r-2xl lg:max-w-96' />
								</div>
							</div>
						</section>
					)}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10'>
						{guestEvents.map((event) => {
							return (
								<HomeEventItem
									key={event.DocId}
									date={new Date(event.Date).getDate()}
									month={getMonthsShort(event.Date)}
									title={event.EventName}
									description={event.Description}
									coverPicture={event.CoverPicture}
								/>
							)
						})}
					</div>
					{/* <div className=' w-full  flex items-center justify-center'>
						<button
							className='border border-system-primary-accent text-system-primary-accent px-10 py-4 rounded-full'
							onClick={() => {
								if (currentUserData) {
									navigate('/Events')
								} else {
									navigate('/Login')
								}
							}}>
							Load More
						</button>
					</div> */}
				</div>
			</div>
		</div>
	)
}

const HomeEventItem = ({ date, month, title, description, coverPicture }) => {
	return (
		<div className='w-full flex flex-col rounded-xl overflow-hidden shadow-sm shadow-system-file-border bg-system-secondary-bg'>
			{coverPicture ? (
				<>
					<img src={coverPicture} className='object-cover w-full h-32' />
				</>
			) : (
				<>
					<img src={cover} className='object-cover w-full h-32' />
				</>
			)}
			<div className='flex gap-4 justify-start px-4 py-4'>
				<div>
					<p className='text-system-primary-accent font-bold text-sm'>{month}</p>
					<p className='font-bold text-2xl'>{date}</p>
				</div>
				<div className='flex flex-col gap-2'>
					<p className='font-bold text-lg'>{title}</p>
					<p className='text-sm text-system-secondary-text line-clamp-3'>{description}</p>
				</div>
			</div>
		</div>
	)
}

const HomeUpcomingEvents = forwardRef(HomeUpcomingEvent)

export default HomeUpcomingEvents
