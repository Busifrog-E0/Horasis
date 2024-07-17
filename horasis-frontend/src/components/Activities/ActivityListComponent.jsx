import { defaultActivity } from '../../utils/AuthProvider'
import ActivityComponent from './ActivityComponent'

const ActivityListComponent = ({ activitiesData }) => {
	return (
		<div className='flex flex-col gap-3 my-3'>
			{activitiesData.map((activity, index) => (
				<ActivityComponent key={index} activity={activity} />
			))}
		</div>
	)
}

export default ActivityListComponent
