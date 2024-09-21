import { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import cover from '../../assets/icons/cover.svg'
import useGetList from '../../hooks/useGetList'
import { useAuth } from '../../utils/AuthProvider'
import { getMonthsShort } from '../../utils/date'

const HomeUpcomingEvent = (props, ref) => {
	const navigate = useNavigate()
	const { data: guestEvents } = useGetList(`guest/events`, { Limit: 3 })
	const { currentUserData } = useAuth()

	return (
		<div className='h-max flex flex-col items-center bg-system-secondary-bg' ref={ref}>
			<div className='flex items-center justify-center my-20 max-w-screen-2xl w-full '>
				<div className='w-11/12  md:w-8/12 flex flex-col gap-6'>
					<div className='flex flex-col lg:flex-row justify-between gap-6 '>
						<h1 className='text-3xl font-bold text-system-primary-accent'>Upcoming Events</h1>
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
					<div className=' w-full  flex items-center justify-center'>
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
					</div>
				</div>
			</div>
		</div>
	)
}

const HomeEventItem = ({ date, month, title, description, coverPicture }) => {
	return (
		<div className='w-full flex flex-col rounded-xl overflow-hidden shadow-lg shadow-system-file-border bg-system-secondary-bg'>
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
