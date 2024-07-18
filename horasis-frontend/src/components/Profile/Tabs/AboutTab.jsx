import AboutProfile from '../AboutProfile'

const AboutTab = ({ user, getUserDetails, isCurrentUser }) => {
	return <>
		<AboutProfile user={user} getUserDetails={getUserDetails} isCurrentUser={isCurrentUser} />
		<div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5'>
			<div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
				<h4 className='font-medium text-lg text-system-primary-text'>Notification</h4>
				<h4 className='font-medium text-lg text-system-primary-accent'>ON</h4>
			</div>
			<div className='flex flex-row items-center justify-between'>
				<h4 className='font-medium text-lg text-system-primary-text'>Language</h4>
				<h4 className='font-medium text-lg text-system-primary-accent'>English</h4>
			</div>
		</div>
		<div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5'>
			<div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
				<h4 className='font-medium text-lg text-system-primary-text'>Security</h4>
			</div>
			<div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
				<h4 className='font-medium text-lg text-system-primary-text'>Help & Support</h4>
			</div>
			<div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
				<h4 className='font-medium text-lg text-system-primary-text'>Contact Us</h4>
			</div>
			<div className='flex flex-row items-center justify-between'>
				<h4 className='font-medium text-lg text-system-primary-text'>Privacy Policy</h4>
			</div>
		</div>
	</>
}

export default AboutTab
