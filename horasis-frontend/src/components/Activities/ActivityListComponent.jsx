import { defaultActivity } from '../../utils/AuthProvider'
import ActivityComponent from './ActivityComponent'

const ActivityListComponent = ({ bordered, activitiesData, gapBnTabs }) => {
	return (
		<div className={`flex flex-col ${gapBnTabs} my-3`}>
			{activitiesData.map((activity, index) => (
				<ActivityComponent bordered={bordered} key={activity.DocId} activity={activity} />
			))}
		</div>
	)
}

export default ActivityListComponent
