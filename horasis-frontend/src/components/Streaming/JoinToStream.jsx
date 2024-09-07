import cover from '../../assets/icons/cover.svg'
import Button from '../ui/Button'
const JoinToStream = ({ event, appId, channel, token, setChannel, setToken, setCalling, setAppId }) => {
	return (
		<div className='w-full h-full'>
			{event.CoverPicture ? (
				<>
					<img src={event.CoverPicture} className='object-cover w-full h-full' />
				</>
			) : (
				<>
					<img src={cover} className='object-cover w-full h-full' />
				</>
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
						<Button variant='danger' className='px-20 font-bold' size='md' disabled={!appId || !channel} onClick={() => setCalling(true)}>
							Join
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default JoinToStream
