import { useContext, useState } from 'react'
import Button from '../ui/Button'
import { postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import avatar from '../../assets/icons/avatar.svg'
import Select from '../ui/Select'

const InviteSpeakersTab = ({ connection, eventId, from = 'events', lastItem, agendaList }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [inviteSent, setInviteSent] = useState(false)
	const [selectedAgenda, setSelectedAgenda] = useState({})
	const handleAgendaChange = (selectedOption) => {
		const agenda = selectedOption ? agendaList.find((agenda) => selectedOption === agenda.Name) : ''
		setSelectedAgenda(agenda)
	}

	const sentInvite = () => {
		postItem(
			`${from}/${eventId}/speakers/${connection.DocId}`,
			{
				Agenda: selectedAgenda,
			},
			(result) => {
				setInviteSent(result)
			},
			(err) => {
				// toast.open('error', 'Invite failed', `Couldn't sent  invite to ${connection.FullName}. Try again.`)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	return (
		<>
			<div className={`${!lastItem && 'border-b'} border-system-file-border pb-4 pt-4`}>
				<div className='flex items-center gap-3'>
					<div className='flex flex-1 gap-3 '>
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
							<h4 className='font-medium text-sm text-brand-gray-dim mt-1'>@{connection && connection.Username}</h4>
						</div>
					</div>
					<div className='flex-1 '>
						<Select
							placeholder='Select Agenda'
							className='rounded-xl border-2 border-system-file-border-accent'
							width='full'
							value={agendaList.find((option) => option.Name === selectedAgenda.Name)?.Name || ''}
							options={agendaList.map((item) => item.Name)}
							setValue={(selectedOption) => handleAgendaChange(selectedOption)}
						/>
					</div>
					{!inviteSent ? (
						<Button
							disabled={Object.keys(selectedAgenda).length === 0}
							variant='outline'
							onClick={() => sentInvite(connection.DocId)}>
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

export default InviteSpeakersTab
