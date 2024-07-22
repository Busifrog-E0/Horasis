import people from '../../assets/tempimages/people.jpg'

const HomeDiscussionsSection = () => {
	return (
		<div className='bg-sky-200 h-max flex flex-col items-center '>
			<div className='flex items-center justify-center my-20 max-w-screen-2xl w-full'>
				<div className='w-11/12  md:w-8/12 flex flex-col gap-10'>
					<div className='flex flex-col items-center justify-between gap-1'>
						<h1 className='text-3xl text-system-primary-accent'>Community Discussions</h1>
						<p className='text-system-secondary-text'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						<HomeDiscussionItem />
						<HomeDiscussionItem />
						<HomeDiscussionItem />
					</div>
          <div className=' w-full  flex items-center justify-center'>
						<button className='border border-system-primary-accent bg-system-secondary-bg text-system-primary-accent px-8 py-3 rounded-full'>
							Load More
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const HomeDiscussionItem = () => {
	return (
		<div className='flex flex-col gap-4'>
			<div className='rounded-xl overflow-hidden'>
				<img src={people} alt='' />
			</div>
			<p className='font-bold text-lg text-system-primary-accent'>
				6 Stratergies to find your conference keynote and other speakers
			</p>
			<p className='text-sm '>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem illo sit eum neque quo est. Architecto ad
				odit sint repellendus.
			</p>
			<p className='text-system-secondary-text text-sm'>12 Mar - John Doe</p>
		</div>
	)
}

export default HomeDiscussionsSection
