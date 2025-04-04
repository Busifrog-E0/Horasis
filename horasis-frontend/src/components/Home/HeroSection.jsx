import heroImage from '../../assets/images/home/hero-right-image.png'
const HeroSection = () => {
	return (
		<>
			<div className='bg-system-primary-accent-transparent px-4 sm:px-8 md:px-16 lg:px-20 h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden relative'>
				<div className='grid lg:grid-cols-2 max-w-screen-2xl gap-10 '>
					<div className='flex flex-col gap-10 justify-center order-last md:order-first'>
						<div>
							<div className='flex flex-col gap-4'>
								<h4 className='font-bold text-6xl text-system-secondary-bg'>Horasis</h4>
								<h4 className=' text-3xl md:text-4xl text-system-secondary-bg'>Global Visions Community</h4>
							</div>
							<h4 className='text-md md:text-xl text-system-secondary-bg  md:w-4/5 lg:w-2/3'>
								Look no further! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua.
							</h4>
						</div>
						<div className='flex flex-row flex-wrap gap-6'>
							<div className='rounded-full p-4 px-12 border border-system-secondary-bg bg-system-secondary-bg'>
								<p
									className='text-system-primary-accent text-xl font-bold cursor-pointer'
									// onClick={() => navigate('/welcome')}
								>
									Learn More
								</p>
							</div>
							{/* <div className='rounded-full p-4 px-12 border border-system-secondary-bg'>
								<p className='text-xl font-bold text-system-secondary-bg'>Learn More</p>
							</div> */}
						</div>
					</div>
					<div className=' w-full h-full border md:border-none border-system-primary-bg rounded-xl '>
						<img
							src={heroImage}
							alt=''
							className='md:scale-150 lg:scale-[1.2] lg:absolute lg:-right-1/4 lg:bottom-0 xl:-right-1/4 2xl:-right-1'
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default HeroSection
