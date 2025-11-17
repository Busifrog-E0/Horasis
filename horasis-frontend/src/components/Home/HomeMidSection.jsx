import { useNavigate } from 'react-router-dom'
import HeroImage from '../../assets/images/home/B4.jpg'
import GlobalEventImage from '../../assets/images/home/global-event-image.jpg'
import globalmeeting from '../../assets/images/home/globalmeeting.svg'

const HomeMidSection = () => {
	const navigate = useNavigate()
	return (
		<div className='h-max flex flex-col items-center bg-system-secondary-bg'>
			<div className='flex items-center justify-center -mt-12 mb-10 max-w-screen-2xl w-full z-20'>
				<div className='grid grid-cols-1 md:grid-cols-3 items-center md:items-baseline gap-10 w-11/12 md:w-9/12'>
					<div></div>

					{/* <div className='bg-system-secondary-bg shadow-md w-full h-full md:max-w-96 rounded-xl p-8 flex flex-col gap-4'>
						<div className='h-20 w-20 rounded-lg flex items-center justify-center text-white'>
							<img src={globalmeeting} alt='Global Meeting Icon' />
						</div>
						<p className='text-xl font-medium'>Horasis Global Meeting</p>
						<div className='h-1 w-10 bg-system-primary-accent'></div>
						<p>Annual flagship gatherings and regional meetings.</p>
					</div> */}
					<div></div>
					{/* <div className='bg-system-secondary-bg shadow-md w-full h-full md:max-w-96 rounded-xl p-8 flex flex-col gap-4'>
						<div className='h-20 w-20 rounded-lg flex items-center justify-center text-white'>
							<img src={experttraining} alt='Visionary Circle Icon' />
						</div>
						<p className='text-xl font-medium'>Visionary Circle</p>
						<div className='h-1 w-10 bg-system-primary-accent'></div>
						<p>Invitation-only network of leaders committed to sharing insights and championing bold initiatives.</p>
					</div>
					<div className='bg-system-secondary-bg shadow-md w-full md:max-w-96 rounded-xl p-8 flex flex-col gap-4'>
						<div className='h-20 w-20 rounded-lg flex items-center justify-center text-white'>
							<img src={wideconnections} alt='Strategic Partnerships Icon' />
						</div>
						<p className='text-xl font-medium'>Strategic Partnerships</p>
						<div className='h-1 w-10 bg-system-primary-accent'></div>
						<p>
							Alliances with governments, corporations, and NGOs to co-create research and community-driven projects.
						</p>
					</div> */}
				</div>
			</div>

			{/* About Us Section */}
			<div id='about-us' className='py-10 max-w-screen-2xl flex items-center justify-center w-full mt-20'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 w-11/12 md:w-9/12 items-center'>
					<div className=' h-full rounded-xl'>
						<img src={HeroImage} alt='About Horasis' className='rounded-xl shadow-lg h-full object-cover' />
					</div>
					<div className='flex flex-col justify-center gap-4'>
						<div className='bg-system-primary-accent h-2 w-40'></div>
						<p className='text-4xl font-bold'>About Horasis</p>
						<p className='text-[#747474]'>
							Horasis is a global visions community committed to Inspiring Our Future — a mission driving every summit,
							dialogue, and partnership.
							<br />
							<br />
							Founded in 2005, Horasis brings together governments, international organizations, and business leaders to
							transcend boundaries and co-create sustainable, equitable solutions. With a special focus on the Global
							South, our flagship Global Meeting and regional summits in China, India, and Southeast Asia serve as
							catalysts for transformative dialogue and collaborative action.
							<br />
							<br />
							As an independent, Switzerland-headquartered platform, we foster long-term solutions to complex global
							challenges, expecting principled leadership and community-driven initiatives that deliver lasting impact.
						</p>
					</div>
				</div>
			</div>

			{/* Join the Global Event Section */}
			<div className='w-full bg-[#CFE8FA] flex items-center justify-center py-10 lg:py-20 lg:h-auto mt-20'>
				<div className='max-w-screen-2xl w-full flex items-end justify-center p-4'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 w-11/12 md:w-9/12'>
						<div className='flex flex-col justify-center gap-6'>
							<div className='bg-system-primary-accent h-2 w-40'></div>
							<p className='text-3xl font-bold text-[#252B42]'>Join Horasis</p>
							<p className='text-[#747474]'>Apply to attend or partner with us to make a global impact.</p>
							<button
								// onClick={() => navigate('/register')}
								className='w-1/2 bg-system-secondary-bg text-system-primary-accent px-6 py-3 rounded-full font-semibold'>
								<a href='mailto:visions@horasis.org'>Join Horasis</a>
							</button>
						</div>
						<div className='hidden lg:flex'>
							<img src={GlobalEventImage} alt='Global Event' className='rounded-xl ' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeMidSection
