import Button from '../ui/Button'
import avatar from '../../assets/icons/avatar.svg'

const SpeakerProfileTab = ({ profile }) => {
	return (
		<div className='px-4'>
			<div className='flex items-start gap-3'>
				{profile.ProfilePicture ? (
					<img className='w-12 h-12 rounded-full' src={profile.ProfilePicture} alt='Rounded avatar' />
				) : (
					<img className='w-12 h-12 rounded-full' src={avatar} alt='Rounded avatar' />
				)}
				<div className='flex-1'>
					<h4 className='font-semibold text-base text-system-primary-accent mt-3'>{profile.FullName}</h4>
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
	)
}

export default SpeakerProfileTab
