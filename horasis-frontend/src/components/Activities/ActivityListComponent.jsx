import { defaultActivity } from '../../utils/AuthProvider'
import ActivityComponent from './ActivityComponent'

const ActivityListComponent = ({
	titleSize = 'text-xl',
	descriptionSize = 'text-md',
	bordered,
	activitiesData,
	gapBnTabs,
	onDelete,
	className,
	avatarSize,
	border = false,
	ShowImage = true,
	iconSize,timeSize,
	onSaveRemoveCallback = () => { }
	,from
}) => {
	return (
		<div className={`flex flex-col ${gapBnTabs} my-3`}>
			{activitiesData.map((activity, index) => (
				<ActivityComponent
				from={from}
					onSaveRemoveCallback={onSaveRemoveCallback}
					ShowImage={ShowImage}
					titleSize={titleSize}
					onDelete={onDelete}
					descriptionSize={descriptionSize}
					avatarSize={avatarSize}
					className={`${className} ${border === true ? (index !== activitiesData.length - 1 ? '' : '') : ''}`}
					bordered={bordered}
					key={activity.DocId}
					activity={activity}
					iconSize={iconSize}
					timeSize={timeSize}
				/>
			))}
		</div>
	)
}

export default ActivityListComponent
