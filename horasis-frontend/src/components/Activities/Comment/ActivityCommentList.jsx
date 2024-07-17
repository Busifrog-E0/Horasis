import ActivityComment from './ActivityComment'

const ActivityCommentList = ({ activity }) => {
	return (
		<div className='flex items-center  justify-between mt-4 flex-col gap-1'>
			{[0, 1, 2].map((item) => (
				<ActivityComment key={item} comment={activity} />
			))}
		</div>
	)
}

export default ActivityCommentList
