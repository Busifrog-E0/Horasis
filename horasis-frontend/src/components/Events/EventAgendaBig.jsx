import { useEffect, useState } from 'react'
import avatar from '../../assets/icons/avatar.svg'
import location from '../../assets/icons/location.svg'
import { gettimenow } from '../../utils/date'
import ShowMoreText from '../Common/ShowMoreText'

const EventsAgendaBig = ({ event }) => {
	const [agendas, setAgendas] = useState([])

	useEffect(() => {
		if (event?.Agenda) {
			setAgendas(event.Agenda)
		}
	}, [event])

	return (
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
										{gettimenow(new Date(agenda.StartTime))} - {gettimenow(new Date(agenda.EndTime))}
									</time>
									<div className='flex items-center gap-1'>
										<img className='w-4 h-4 object-contain' src={location} alt='Location icon' />
										<span className='text-base font-medium text-system-secondary-text'>{agenda?.Location}</span>
									</div>
								</div>
								{agenda?.Description && (
									<div className='mb-4'>
										<ShowMoreText
											text={
												'				Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nihil saepe laborum nisi sunt autem corrupti vero ipsam, aperiam cupiditate possimus quae assumenda unde placeat molestias labore expedita similique rem blanditiis eaque repudiandae maiores sint. Mollitia esse a alias minima provident iste vel tenetur voluptatibus!'
											}
										/>
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
												<p className='text-lg font-medium text-system-primary-text'>
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
	)
}

export default EventsAgendaBig
