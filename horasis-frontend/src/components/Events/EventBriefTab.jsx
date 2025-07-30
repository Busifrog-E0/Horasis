import { getDateInFullWordsFormat, relativeTime } from '../../utils/date'
import Button from '../ui/Button'

const EventBriefTab = ({ event }) => {
	return (
		<>
			<div className='aspect-square w-60 relative overflow-hidden rounded-lg'>
				<img src={event?.CoverPicture} className='object-cover h-full w-full' />
				<div className='absolute top-0 right-0 left-0 bottom-0 p-3 py-8 bg-gradient-to-b from-brand-blue-transparent h-100 overflow-hidden overflow-y-auto'>
					<h4 className='text-md font-bold text-white m-0 leading-5 mb-2'>{event.EventName}</h4>
					<h4 className='text-sm font-medium text-white mb-2'>{getDateInFullWordsFormat(new Date(event.Date))}</h4>
					<div className='flex flex-row flex-wrap gap-3'>
						<h4 className='text-xs text-white'>{event.Privacy} Event</h4>
						<h4 className='text-xs text-white'>Active {relativeTime(new Date(event.CreatedIndex))}</h4>
						<h4 className='text-xs text-white'>{event.NoOfMembers} Participants</h4>
					</div>
				</div>
			</div>
		</>
	)
}

export default EventBriefTab
