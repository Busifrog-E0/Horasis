import Button from '../ui/Button'

const InviteMemberTab = ({ connection }) => {
	return (
		<>
			<div className='border-b border-system-file-border pb-4 pt-4'>
				<div className='flex items-start gap-3'>
					{connection ? (
						<>
							{connection.ProfilePicture ? (
								<div className='w-11 h-11 rounded-full bg-black'>
									<img
										className='w-11 h-11 rounded-full object-cover'
										src={connection.ProfilePicture}
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
						<h4 className='font-semibold text-system-primary-accent'>{connection && connection.FullName}</h4>
						<h4 className='font-medium text-sm text-brand-gray-dim mt-1'>
							@{connection && connection.Username}, {connection && connection.JobTitle}{' '}
							{connection && connection.Country}
						</h4>
					</div>
					<Button variant='outline'>Invite</Button>
				</div>
			</div>
		</>
	)
}

export default InviteMemberTab
