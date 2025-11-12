import { useEffect, useState } from 'react'
import avatar from '../../assets/icons/avatar.svg'
import location from '../../assets/icons/location.svg'
import { getDateInWordsFormat, gettimenow } from '../../utils/date'
import ShowMoreText from '../Common/ShowMoreText'
import Modal from '../ui/Modal'
import closeIcon from '../../assets/icons/close.svg'

const EventsAgendaBig = ({ event }) => {
	const [agendas, setAgendas] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedSpeaker, setSelectedSpeaker] = useState(null)

	useEffect(() => {
		if (event?.Agenda) {
			setAgendas(event.Agenda)
		}
	}, [event])

	const openSpeakerModal = (speaker) => {
		setSelectedSpeaker(speaker)
		setIsModalOpen(true)
	}

	const closeSpeakerModal = () => {
		setIsModalOpen(false)
		setSelectedSpeaker(null)
	}

	return (
		<>
			<Modal isOpen={isModalOpen} maxWidth='max-w-4xl'>
				<Modal.Header>
					<div className='flex items-center justify-between w-full'>
						<p className='text-lg font-medium'>Speaker Details</p>
						<button onClick={closeSpeakerModal}>
							<img src={closeIcon} className='h-6  cursor-pointer' alt='' />
						</button>
					</div>
				</Modal.Header>
				<Modal.Body>
					{selectedSpeaker && (
						<div className='flex flex-col items-start p-2 rounded-lg'>
							<div className='flex items-center gap-4'>
								<div className='w-11 h-11 rounded-full overflow-hidden'>
									<img
										className='w-full h-full object-cover'
										src={selectedSpeaker?.ProfilePicture || avatar}
										alt='Speaker avatar'
									/>
								</div>
								<div className='flex flex-col'>
									<p className='text-lg font-medium text-system-primary-text'>
										{selectedSpeaker?.FullName}
									</p>
									<div className=' text-system-secondary-text'>
										{selectedSpeaker?.JobTitle}
									</div>
								</div>
							</div>
							{selectedSpeaker?.About && (
								<div className='mt-4'>
									<p className='text-base text-system-primary-text'>{selectedSpeaker?.About}</p>
								</div>
							)}
						</div>
					)}
				</Modal.Body>
			</Modal>
			<div className='relative md:px-4 lg:p-0'>
				<div className='space-y-6'>
					{agendas.map((agenda, index) => (
						<div key={index} className='flex flex-col md:flex-row items-start md:items-center gap-6 relative'>
							{/* Timeline Dot */}
							<div className='absolute -left-3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-system-primary-accent rounded-full z-10 hidden md:block'></div>

							<div className='w-full'>
								<div className='bg-system-secondary-bg p-5 rounded-2xl shadow-sm border border-gray-200'>
									<h3 className='text-xl font-medium text-system-primary-accent mb-4'>{agenda.Name}</h3>
									<div className='flex flex-col gap-1'>
										<time className='block text-base font-semibold text-system-primary-text'>
											{getDateInWordsFormat(new Date(agenda?.Date))}, {gettimenow(new Date(agenda.StartTime))} - {gettimenow(new Date(agenda.EndTime))}
										</time>
										<div className='flex items-center gap-1'>
											<img className='w-4 h-4 object-contain' src={location} alt='Location icon' />
											<span className='text-base font-medium text-system-secondary-text'>{agenda?.Location}</span>
										</div>
									</div>
									{agenda?.Description && (
										<div className='mb-4'>
											<ShowMoreText text={agenda?.Description} />
										</div>
									)}

									{agenda?.SpeakerData?.UserDetails?.FullName && (
										<div className='flex flex-col items-start border p-4 rounded-lg'>
											<p className='text-system-secondary-text mb-4 text-sm'>Speaker Details</p>
											<div className='flex items-center gap-4'>
												<div className='w-11 h-11 rounded-full overflow-hidden'>
													<img
														className='w-full h-full object-cover'
														src={agenda?.SpeakerData?.UserDetails?.ProfilePicture || avatar}
														alt='Speaker avatar'
													/>
												</div>
												<div className='flex flex-col'>
													<p
														onClick={() => openSpeakerModal(agenda?.SpeakerData?.UserDetails)}
														className='text-lg font-medium text-system-primary-text cursor-pointer'>
														{agenda?.SpeakerData?.UserDetails?.FullName}
													</p>
												</div>
											</div>
											{agenda?.SpeakerData?.UserDetails?.About && (
												<ShowMoreText text={agenda?.SpeakerData?.UserDetails?.About} />
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default EventsAgendaBig
