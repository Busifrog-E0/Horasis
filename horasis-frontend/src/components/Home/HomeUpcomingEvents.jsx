import people from '../../assets/tempimages/people.jpg'

const HomeUpcomingEvents = () => {
	return (
		<div className='h-max flex flex-col items-center bg-system-secondary-bg'>
			<div className='flex items-center justify-center my-20 max-w-screen-2xl w-full '>
				<div className='w-11/12  md:w-8/12 flex flex-col gap-6'>
					<div className='flex flex-col lg:flex-row justify-between gap-6 '>
						<h1 className='text-3xl font-bold text-system-primary-accent'>Upcoming Events</h1>
						<div className='flex flex-wrap gap-4'>
							<button className='px-6 py-3 bg-blue-100 rounded-full text-md font-medium text-system-primary-accent'>
								Weekdays
							</button>
							<button className='px-6 py-3 bg-blue-100 rounded-full text-md font-medium text-system-primary-accent'>
								Event Type
							</button>
							<button className='px-6 py-3 bg-blue-100 rounded-full text-md font-medium text-system-primary-accent'>
								Any Category
							</button>
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10'>
						<HomeEventItem
							date='14'
							month='APR'
							title='Horasis Asia Meeting 2024 April'
							description="We'll get you directly seated and inside for you to enjoy the show."
						/>
						<HomeEventItem
							date='20'
							month='AUG'
							title='Horasis Worldwide Meeting Barcelona Aug'
							description='Directly seated and inside for you to enjoy the show.'
						/>
						<HomeEventItem
							date='18'
							month='SEP'
							title='Horasis USA Meeting Public Event  2024'
							description='Directly seated and inside for you to enjoy the show.'
						/>
						<HomeEventItem
							date='15'
							month='APR'
							title='Horasis India Meeting 2024 April'
							description="We'll get you directly seated and inside for you to enjoy the show."
						/>
						<HomeEventItem
							date='20'
							month='AUG'
							title='Horasis Worldwide Meeting Barcelona'
							description='Directly seated and inside for you to enjoy the show.'
						/>
						<HomeEventItem
							date='18'
							month='SEP'
							title='Horasis Global 2024 New York City'
							description='Directly seated and inside for you to enjoy the show.'
						/>
					</div>
					<div className=' w-full  flex items-center justify-center'>
						<button className='border border-system-primary-accent text-system-primary-accent px-10 py-4 rounded-full'>
							Load More
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const HomeEventItem = ({ date, month, title, description }) => {
	return (
		<div className='w-full flex flex-col rounded-xl overflow-hidden shadow-lg shadow-system-file-border bg-system-secondary-bg'>
			<img src={people} alt='' />
			<div className='flex gap-4 justify-start px-4 py-4'>
				<div>
					<p className='text-system-primary-accent font-bold text-sm'>{month}</p>
					<p className='font-bold text-2xl'>{date}</p>
				</div>
				<div className='flex flex-col gap-2'>
					<p className='font-bold text-lg'>{title}</p>
					<p className='text-sm text-system-secondary-text'>{description}</p>
				</div>
			</div>
		</div>
	)
}
export default HomeUpcomingEvents
