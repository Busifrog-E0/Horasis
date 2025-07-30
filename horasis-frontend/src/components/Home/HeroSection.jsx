import heroImage from '../../assets/images/home/hero-right-image.png'
const HeroSection = () => {
	const handleClick = (e, id) => {
		e.preventDefault()
		document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' })
	}
	return (
		<>
			<div className='bg-system-primary-accent-transparent px-4 sm:px-8 md:px-16 lg:px-20 h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden relative'>
				<div className='grid lg:grid-cols-2 max-w-screen-2xl gap-10 '>
					<div className='flex flex-col gap-10 justify-center order-last md:order-first'>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-1'>
								<h4 className='font-bold text-6xl text-system-secondary-bg'>Horasis</h4>
								<h4 className=' text-xl md:text-2xl text-system-secondary-bg'>Global Visions Community</h4>
							</div>
							<h4 className='text-base md:text-md text-system-secondary-bg  md:w-4/5 lg:w-2/3'>
								Horasis exists to unite visionary leaders from government, business and civil society in pursuit of a
								single goal: forging a more sustainable, equitable and prosperous world. Through boundary‑transcending
								dialogue and action, we lay the groundwork for decisions today that safeguard our shared tomorrow.
							</h4>
						</div>
						<div className='flex flex-row flex-wrap gap-6'>
							<div className='rounded-full p-4 px-12 border border-system-secondary-bg bg-system-secondary-bg'>
								<p
									className='text-system-primary-accent text-xl font-bold cursor-pointer'
									// onClick={() => navigate('/welcome')}
									onClick={(e) => handleClick(e, 'about-us')}>
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
							className='md:scale-150 lg:scale-[1.1] lg:absolute lg:-right-1/3 lg:bottom-0 xl:-right-[30%] 2xl:right-[-10rem]'
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default HeroSection
