import { useContext } from 'react'
import { postItem } from '../../constants/operations'
import Button from '../ui/Button'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'

const DiscussionTab = ({ discussion, onClick }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const joinDiscussion = () => {
		postItem(
			`discussions/${discussion.DocId}/join`,
			{},
			(result) => console.log(result),
			(err) => console.log(err),
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	return (
		<div className='rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg '>
			<div className='h-28 overflow-hidden rounded-t-lg cursor-pointer' onClick={() => onClick(discussion.DocId)}>
				<img src={discussion.CoverPicture} className='object-cover h-full w-full' />
			</div>
			<div className='p-2 px-6 cursor-pointer' onClick={() => onClick(discussion.DocId)}>
				<div className='flex flex-wrap items-center gap-x-2'>
					<h4 className='text-xs text-brand-gray-dim'>{discussion.Privacy} Discussion</h4>
					<h4 className='tetx-xs text-brand-gray-dim'>•</h4>
					<h4 className='text-xs text-brand-gray-dim'>{discussion.NoOfMembers} Members</h4>
				</div>
				<h4 className='text-base font-semibold text-system-primary-text mb-1 leading-6'>{discussion.DiscussionName}</h4>
				<h4 className=' text-xs text-brand-gray-dim min-h-16 max-h-16 overflow-hidden'>{discussion.Brief}</h4>
			</div>
			{!discussion.IsMember && (
				<div className='flex items-center justify-center my-2'>
					<Button variant='black' onClick={() => joinDiscussion()}>
						Follow
					</Button>
				</div>
			)}
		</div>
	)
}

export default DiscussionTab
