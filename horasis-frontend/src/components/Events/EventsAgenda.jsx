import { useState } from 'react'
import { gettimenow } from '../../utils/date'
import avatar from '../../assets/icons/avatar.svg'
import location from '../../assets/icons/location.svg'

const EventsAgenda = ({ event }) => {
	const [agendas, setAgendas] = useState(event.Agenda)

	return (
		<div className='relative flex flex-col items-center'>
			{agendas.map((agenda, index) => (
				<div key={index} className='flex w-full mb-8 items-center relative'>
					{/* Line connecting the dots */}
					{index !== agendas.length - 1 && (
						<div className='absolute top-8 w-[0.125rem] h-full bg-system-primary-accent left-1/2 transform -translate-x-1/2 z-0'></div>
					)}

					{/* Right side - Time */}
					<div className={`w-1/2 text-right pr-4`}>
						<time className='block mb-2 text-sm font-normal leading-none text-system-primary-text'>
							{gettimenow(new Date(agenda.StartTime))}
							{/* <p className='text-xs font-normal text-system-secondary-text'>{agenda.Description}</p> */}
						</time>
						<div className='flex justify-end items-center gap-1'>
							<img className='w-4 h-4 rounded-full object-cover' src={location} alt='Rounded avatar' />
							<h3 className='text-sm font-medium text-system-primary-text'>{agenda?.Location}</h3>
						</div>
					</div>

					{/* Center - Timeline dot */}
					<div className='relative flex items-center justify-center w-8 h-8 z-10'>
						<div className='z-10 flex items-center justify-center w-6 h-6 rounded-full'>
							<svg
								aria-hidden='true'
								className='w-3 h-3 text-system-primary-accent'
								fill='currentColor'
								viewBox='0 0 20 20'>
								<path d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11H9v5h2V7zm0 6H9v2h2v-2z' />
							</svg>
						</div>
					</div>

					{/* Left side - Event details */}
					<div className={`w-1/2 text-left pl-4`}>
						<div className='flex items-center gap-3'>
							<h3 className='text-base font-medium text-system-primary-text'>{agenda.Name}</h3>

						</div>
						<div className='flex-1'>
							{agenda?.SpeakerData?.length > 0 && (
								<div className="w-full mt-3">

									{/* Horizontal Line */}
									<hr className="my-3 border-system-secondary-accent/40" />

									{/* Speaker Names */}
									<div className="flex gap-1 flex-wrap">
										<p className="text-sm">by</p>

										<h4 className="font-semibold text-sm text-system-primary-accent flex flex-wrap gap-1">
											{agenda.SpeakerData
												.map((speaker) => speaker?.UserDetails?.FullName)
												.filter(Boolean)
												.join(", ")}
										</h4>
									</div>

								</div>
							)}

						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default EventsAgenda
