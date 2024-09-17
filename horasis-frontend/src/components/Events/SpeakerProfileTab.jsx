import Button from '../ui/Button'
import avatar from '../../assets/icons/avatar.svg'

const SpeakerProfileTab = ({ profile, agenda }) => {
	return (
		<div className=' border rounded-md border-system-primary-accent overflow-hidden'>
			<p className='text-sm mb-2 bg-system-primary-accent font-medium text-system-secondary-bg px-2 py-1'>
				{agenda?.Name}
			</p>
			<div className='p-2'>
				<div className='flex items-center gap-3'>
					{profile.ProfilePicture ? (
						<img className='w-12 h-12 rounded-full object-cover' src={profile.ProfilePicture} alt='Rounded avatar' />
					) : (
						<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
					)}
					<div className='flex-1'>
						<h4 className='font-semibold text-base text-system-primary-accent'>{profile.FullName}</h4>
					</div>
				</div>
				<h4 className='text-base text-system-primary-text mt-2.5 lg:mt-3 leading-6 whitespace-pre-line'>
					{profile.About ? (
						profile.About
					) : (
						<span className='text-system-secondary-text text-sm'>Speaker about is not available</span>
					)}
				</h4>
			</div>
		</div>
	)
}

export default SpeakerProfileTab
