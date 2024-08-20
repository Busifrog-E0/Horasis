import { Outlet } from 'react-router-dom'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'

const ProfileTabLayout = () => {
	return (
		<div className='p-2 lg:px-10 lg:py-6'>
			<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
				<div className='sticky h-max top-0'>
					<CurrentProfileTab />
					<h4 className='font-medium text-xl text-system-primary-text mt-3 lg:mt-5'>Today's Event</h4>
					<TodaysEventTab />
					<div className='p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5'>
						<h4 className='font-medium text-md text-system-primary-text mb-4'>Recently Active Members</h4>
						<RecentlyActiveMemebrsTab />
					</div>
				</div>
				<>
					<Outlet />
				</>
			</div>
		</div>
	)
}

export default ProfileTabLayout
