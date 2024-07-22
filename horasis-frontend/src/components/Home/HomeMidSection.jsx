import people from '../../assets/tempimages/people.jpg'

const HomeMidSection = () => {
	return (
		<div className='h-max flex flex-col items-center bg-system-secondary-bg'>
			<div className='flex items-center justify-center -mt-12 mb-10 max-w-screen-2xl w-full'>
				<div className='grid grid-cols-1 md:grid-cols-3 items-center md:items-baseline gap-10 w-11/12 md:w-9/12'>
					<div className='bg-system-secondary-bg shadow-md w-full  md:max-w-96 rounded-md p-8 flex flex-col gap-4'>
						<div className='bg-red-500 h-20 w-20 rounded-lg flex items-center justify-center text-white'>icon</div>
						<p className='text-xl font-medium'>Global Meeting</p>
						<div className='h-1 w-10 bg-red-500'></div>
						<p>The gradual accumulation of information about atomic and small-scale behaviour...</p>
					</div>
					<div className='bg-system-secondary-bg shadow-md w-full  md:max-w-96 rounded-md p-8 flex flex-col gap-4'>
						<div className='bg-blue-700 h-20 w-20 rounded-lg flex items-center justify-center text-white'>icon</div>
						<p className='text-xl font-medium'>Expert Training</p>
						<div className='h-1 w-10 bg-red-500'></div>
						<p>The gradual accumulation of information about atomic and small-scale behaviour...</p>
					</div>
					<div className='bg-system-secondary-bg shadow-md w-full  md:max-w-96 rounded-md p-8 flex flex-col gap-4'>
						<div className='bg-amber-500 h-20 w-20 rounded-lg flex items-center justify-center text-white'>icon</div>
						<p className='text-xl font-medium'>Wide Connection</p>
						<div className='h-1 w-10 bg-red-500'></div>
						<p>The gradual accumulation of information about atomic and small-scale behaviour...</p>
					</div>
				</div>
			</div>
			<div className=' py-10 max-w-screen-2xl flex items-center justify-center w-full'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 w-11/12 md:w-9/12 items-center'>
					<div>
						<img src={people} alt='' />
					</div>
					<div className='flex flex-col justify-center gap-4'>
						<div className='bg-red-500 h-2 w-40'></div>
						<p className='text-4xl font-bold'>About us</p>
						<p className='w-11/12 lg:w-2/3'>
							Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi asperiores veniam officia eaque
							perferendis dolor, non iusto eveniet. Fuga debitis perspiciatis aut voluptates, assumenda expedita.
						</p>
						<p className='text-system-primary-accent'>Learn More</p>
					</div>
				</div>
			</div>
			<div className='w-full bg-sky-200 flex items-end justify-center py-10 lg:py-0 lg:h-72 mt-20'>
				<div className='max-w-screen-2xl w-full flex items-end justify-center '>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 w-11/12 md:w-9/12 w-max-screen-2xl '>
						<div className='hidden lg:flex'>
							<img src={people} alt='' />
						</div>
						<div className='flex flex-col justify-center gap-3'>
							<p className='text-3xl font-bold'>Join the global event</p>
							<p className='w-2/3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, ullam.</p>
							<button className='w-1/2 bg-pink-500 text-white px-6 py-3 rounded-full font-medium'>
								Join the events
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeMidSection
