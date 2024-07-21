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
	onSaveRemoveCallback = () => { }
}) => {
	return (
		<div className={`flex flex-col ${gapBnTabs} my-3`}>
			{activitiesData.map((activity, index) => (
				<ActivityComponent
					onSaveRemoveCallback={onSaveRemoveCallback}
					ShowImage={ShowImage}
					titleSize={titleSize}
					onDelete={onDelete}
					descriptionSize={descriptionSize}
					avatarSize={avatarSize}
					className={`${className} ${border === true ? (index !== activitiesData.length - 1 ? 'border-b pb-4' : '') : ''}`}
					bordered={bordered}
					key={activity.DocId}
					activity={activity}
				/>
			))}
		</div>
	)
}

export default ActivityListComponent
