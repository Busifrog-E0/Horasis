import avatar from '../../../assets/icons/avatar.svg'
import useEntityOrganizationManager from '../../../hooks/useEntityOrganizationManager'
import Button from '../../ui/Button'

const DiscussionJoinMembers = ({ profile, discussionId, fetch = () => {} }) => {
	const { acceptEntityMembershipRequest: acceptJoinRequest, rejectEntityMembershipRequest: rejectJoinRequest } =
		useEntityOrganizationManager({
			EntityId: discussionId,
			UserId: profile.MemberId,
			Type: 'Discussion',
			successCallback: fetch,
			errorCallback: () => {},
		})

	return (
		<div className={` cursor-pointer px-2 py-2 rounded-lg flex items-center justify-between gap-2`}>
			<div className='flex items-start gap-4'>
				{profile ? (
					<>
						{profile.UserDetails.ProfilePicture ? (
							<div className='w-11 h-11 rounded-full bg-black'>
								<img
									className='w-11 h-11 rounded-full object-cover'
									src={profile.UserDetails.ProfilePicture}
									alt='Rounded avatar'
								/>
							</div>
						) : (
							<>
								<div className='w-11 h-11 rounded-full bg-brand-light-gray'>
									<img src={avatar} className='object-cover h-full w-full rounded-lg' />
								</div>
							</>
						)}
					</>
				) : (
					<>
						<img
							className='w-11 h-11 rounded-full'
							src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
							alt='Rounded avatar'
						/>
					</>
				)}

				<div className='flex-1'>
					<h4 className='font-semibold text-lg text-system-primary-accent '>
						{profile && profile.UserDetails.FullName}
					</h4>
					<h4 className='font-semibold text-sm text-brand-gray-dim'>@{profile && profile.UserDetails.Username}</h4>
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<Button variant='black' onClick={acceptJoinRequest}>
					Accept
				</Button>
				<Button variant='outline' onClick={rejectJoinRequest}>
					Reject
				</Button>
			</div>
		</div>
	)
}

export default DiscussionJoinMembers
