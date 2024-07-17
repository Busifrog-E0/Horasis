import ActivityComponent from './ActivityComponent'

const ActivityListComponent = () => {
	return (
		<div className='flex flex-col gap-3 my-3'>
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((activity) => (
				<ActivityComponent key={activity} />
			))}
		</div>
	)
}

export default ActivityListComponent
