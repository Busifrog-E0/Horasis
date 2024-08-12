import playstore from '../../assets/images/playstore.png'
import appstore from '../../assets/images/appstore.svg'
import facebook from '../../assets/icons/facebook.svg'
import twitter from '../../assets/icons/twitter.svg'
import linkedin from '../../assets/icons/linkedin.svg'

const HomeFooter = () => {
	return (
		<div className='bg-system-primary-accent h-max flex flex-col items-center'>
			<div className='flex flex-col gap-10 items-center justify-center my-10 max-w-screen-2xl w-full'>
				<div className='w-11/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-system-secondary-bg gap-8 md:gap-8 lg:gap-4'>
					<div className='flex flex-col gap-2'>
						<h4 className='font-bold text-3xl'>Horasis</h4>
						<p>
							Horasis is an independent, international think tank, headquartered in Zurich, Switzerland. Founded in
							2005, by Frank-Jurgen Ritcher, former director of the World Economic Forum.
						</p>
						<div className='flex gap-2 items-end'>
							<img src={facebook} alt='' className='h-6' />
							<img src={twitter} alt='' className='h-6' />
							<img src={linkedin} alt='' className='h-6' />
							{/* <p>facebook</p>
							<p>twitter</p>
							<p>linkedin</p> */}
						</div>
					</div>
					<div className='flex flex-col gap-8 md:items-center'>
						<p className='text-lg'>Download the app by clicking the link below :</p>
						<div className='flex flex-col gap-2'>
							<img src={playstore} alt='' className='w-40' />
							<img src={appstore} alt='' className='w-32' />
							{/* 
							<p>Google Play Store</p>
							<p>App Store</p> */}
						</div>
					</div>
					<div className='flex flex-col gap-8'>
						<h1 className='text-xl font-bold'>Contact</h1>
						<div className='flex flex-col gap-2'>
							<h1>tel : (406) 555-0120</h1>
							<h1>mail : mangcoding123@gmail.com</h1>
							<h1>
								loc : 2972 Horasis Weistheimer Rd,
								<br /> Zurich, Switzerland 85486
							</h1>
						</div>
					</div>
				</div>
				<div>
					<h1 className='text-system-secondary-bg'>Copyright &copy; 2022 Horasis</h1>
				</div>
			</div>
		</div>
	)
}

export default HomeFooter
