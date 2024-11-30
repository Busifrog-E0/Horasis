import cover from '../../assets/icons/cover.svg'
import useCountdown from '../../hooks/useCountdown'
import Button from '../ui/Button'
const JoinToStream = ({ event, appId, channel, token, setChannel, setToken, setCalling, setAppId }) => {
	const { timeLeft, formattedTime } = useCountdown(event.StartTime, event.EndTime)
	return (
		<div className='w-full h-screen max-w-screen max-h-screen overflow-hidden'>
			{event.DisplayPicture ? (
				<img src={event.DisplayPicture} className='object-cover w-full h-full' alt='Event Cover' />
			) : (
				<img src={cover} className='object-cover w-full h-full' alt='Default Cover' />
			)}
			<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-center items-center p-4 md:p-16 lg:p-32 overflow-hidden bg-system-primary-transparent'>
				<div className='grid md:grid-cols-2 xl:grid-cols-3 w-full'>
					<div className='flex flex-col gap-10  w-full'>
						<h4 className='font-bold text-4xl text-white'>{event.EventName}</h4>
						{/* <div className='flex flex-row flex-wrap gap-3'>
						<h4 className='text-xl text-white'>{event.Type} Event</h4>
						<h4 className='text-xl text-white'>•</h4>
						<h4 className='text-xl text-white'>{event.NoOfMembers} Participants</h4>
						<h4 className='text-xl text-white'>•</h4>
						<h4 className='text-xl text-white'>{event.Privacy}</h4>
					</div> */}
						<div className='flex flex-row flex-wrap gap-3'>
							<h4 className='text-xl text-white'>{event.Description}</h4>
						</div>
						{timeLeft > 0 ? (
							<div className='bg-system-primary-accent-transparent text-system-secondary-bg p-2 rounded-md'>
								{new Date().getTime() < event.StartTime ? (
									<>
										<p className='text-md'>Event starts in: </p>
										<p className='text-4xl'>{formattedTime} </p>
									</>
								) : (
									<>
										<p className='text-md'>Event ends in: </p>
										<p className='text-4xl'>{formattedTime} </p>
									</>
								)}
							</div>
						) : (
							<div className='bg-system-secondary-bg-transparent p-2 rounded-md'>The event has ended.</div>
						)}
						{event.StartTime < new Date().getTime() && new Date().getTime() < event.EndTime && event?.IsMember && (
							<Button
								variant='danger'
								className='px-20 font-bold'
								size='md'
								disabled={!appId || !channel}
								onClick={() => setCalling(true)}>
								Join
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default JoinToStream
