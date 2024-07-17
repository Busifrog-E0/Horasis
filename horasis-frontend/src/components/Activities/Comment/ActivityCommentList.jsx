import { defaultComment } from '../../../utils/AuthProvider'
import ActivityComment from './ActivityComment'

const ActivityCommentList = ({ activity, comments }) => {


	return (
		<div className='flex items-center  justify-between mt-4 flex-col gap-1'>
			{comments.map((item) => (
				<ActivityComment key={item} comment={defaultComment} />
			))}
		</div>
	)
}

export default ActivityCommentList
