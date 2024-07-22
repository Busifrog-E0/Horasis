import { useNavigate } from 'react-router-dom'
import people from '../../assets/tempimages/people.jpg'
const HeroSection = () => {
	const navigate = useNavigate()
	return (
		<>
			<div className='bg-system-primary-accent-transparent px-4 sm:px-8 md:px-16 lg:px-20 h-[calc(100vh-5rem)] flex items-center justify-center'>
				<div className='grid lg:grid-cols-2 max-w-screen-2xl'>
					<div className='flex flex-col gap-10 justify-center'>
						<div>
							<div className='flex flex-col gap-2'>
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
								<p className='text-system-primary-accent text-xl font-bold cursor-pointer' onClick={() => navigate('/welcome')}>
									Register
								</p>
							</div>
							<div className='rounded-full p-4 px-12 border border-system-secondary-bg'>
								<p className='text-xl font-bold text-system-secondary-bg'>Learn More</p>
							</div>
						</div>
					</div>
					<div className=' w-full h-full hidden lg:block'>
						<img src={people} alt='' />
					</div>
				</div>
			</div>
		</>
	)
}

export default HeroSection
