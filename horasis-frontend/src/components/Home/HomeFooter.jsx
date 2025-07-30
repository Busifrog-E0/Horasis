import playstore from '../../assets/images/playstore.png'
import appstore from '../../assets/images/appstore.svg'
import facebook from '../../assets/icons/facebook.svg'
import twitter from '../../assets/icons/twitter.svg'
import linkedin from '../../assets/icons/linkedin.svg'
import telephone from '../../assets/icons/telephone.svg'
import mailwhite from '../../assets/icons/mailwhite.svg'
import locationwhite from '../../assets/icons/locationwhite.svg'

import { forwardRef } from 'react'
import moment from 'moment'

const HomeFoot = (props, ref) => {
	return (
		<div className='bg-system-primary-accent h-max flex flex-col items-center' ref={ref}>
			<div className='flex flex-col gap-10 items-center justify-center my-10 max-w-screen-2xl w-full'>
				<div className='w-11/12 md:w-9/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 text-system-secondary-bg gap-8 md:gap-8 lg:gap-4'>
					<div className='flex flex-col gap-8'>
						<h4 className='font-bold text-3xl'>Horasis</h4>
						<p>
							Horasis is an independent, international think tank, headquartered in Zurich, Switzerland. Founded in
							2005, by Frank-Jurgen Ritcher, former director of the World Economic Forum.
						</p>
						<div className='flex gap-2 items-end'>
							<a href='https://www.facebook.com/HorasisOrg' target='_blank' rel='noreferrer'>
								<img src={facebook} alt='' className='h-6' />
							</a>
							<a href='https://x.com/horasisorg' target='_blank' rel='noreferrer'>
								<img src={twitter} alt='' className='h-6' />
							</a>
							<a href='https://www.linkedin.com/company/horasis' target='_blank' rel='noreferrer'>
								<img src={linkedin} alt='' className='h-6' />
							</a>
							{/* <p>facebook</p>
							<p>twitter</p>
							<p>linkedin</p> */}
						</div>
					</div>
					{/* <div className='flex flex-col gap-8 md:items-center'>
						<p className='text-lg'>Download the app by clicking the link below :</p>
						<div className='flex flex-col gap-2'>
							<img src={playstore} alt='' className='w-40' />
							<img src={appstore} alt='' className='w-40' />
						</div>
					</div> */}
					<div className='flex flex-col gap-8'>
						<h1 className='text-xl font-bold'>Contact</h1>
						<div className='flex flex-col gap-4'>
							<div className='flex gap-2 items-center'>
								<img src={telephone} alt='' className='h-5' />
								<h1>: (406) 555-0120</h1>
							</div>
							<div className='flex gap-2 items-center'>
								<img src={mailwhite} alt='' className='h-5' />
								<h1>: mangcoding123@gmail.com</h1>
							</div>
							<div className='flex gap-2 items-start'>
								<img src={locationwhite} alt='' className='h-5' />
								<h1>
									: 2972 Horasis Weistheimer Rd,
									<br /> Zurich, Switzerland 85486
								</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h1 className='text-system-secondary-bg'>Copyright &copy; {moment().format('YYYY')} Horasis</h1>
				</div>
			</div>
		</div>
	)
}

const HomeFooter = forwardRef(HomeFoot)

export default HomeFooter
