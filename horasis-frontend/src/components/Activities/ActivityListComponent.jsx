import { defaultActivity } from '../../utils/AuthProvider'
import ActivityComponent from './ActivityComponent'

const ActivityListComponent = ({ bordered, activitiesData, gapBnTabs, onDelete, className, avatarSize }) => {
	return (
		<div className={`flex flex-col ${gapBnTabs} my-3`}>
			{activitiesData.map((activity, index) => (
				<ActivityComponent onDelete={onDelete} avatarSize={avatarSize} className={className} bordered={bordered} key={activity.DocId} activity={activity} />
			))}
		</div>
	)
}

export default ActivityListComponent
