import { useState } from 'react'
import avatar from '../../assets/icons/avatar.svg'
import useEntityOrganizationManager from '../../hooks/useEntityOrganizationManager'
import Button from '../ui/Button'

const InviteMemberTab = ({ invitee, entityId, from = 'discussions' }) => {

	const [inviteSent, setInviteSent] = useState(false)
	
	const types = { discussions: 'Discussion', events: 'Event', podcasts: 'Podcast' }

	const { sendEntityMembershipInvitation: sendInvite } = useEntityOrganizationManager({
		EntityId: entityId,
		UserId: invitee.DocId,
		Type: types[from],
		successCallback: () => setInviteSent(true),
		errorCallback: () => {},
	})

	return (
		<>
			<div className='border-b border-system-file-border pb-4 pt-4'>
				<div className='flex items-center gap-3'>
					{invitee ? (
						<>
							{invitee.ProfilePicture ? (
								<div className='w-11 h-11 rounded-full bg-black'>
									<img
										className='w-11 h-11 rounded-full object-cover'
										src={invitee.ProfilePicture}
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
						<></>
					)}

					<div className='flex-1'>
						<h4 className='font-semibold text-system-primary-accent'>{invitee && invitee.FullName}</h4>
						<h4 className='font-medium text-sm text-brand-gray-dim mt-1'>
							@{invitee && invitee.Username}, {invitee && invitee.JobTitle} {invitee && invitee.Country}
						</h4>
					</div>
					{!inviteSent ? (
						<Button variant='outline' onClick={sendInvite}>
							Invite
						</Button>
					) : (
						<>
							<p className='text-system-secondary-text font-medium'>Invite sent</p>
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default InviteMemberTab
