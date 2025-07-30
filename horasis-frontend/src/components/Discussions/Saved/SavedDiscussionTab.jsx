import { useNavigate } from 'react-router-dom'
import useGetList from '../../../hooks/useGetList'
import EmptyMembers from '../../Common/EmptyMembers'
import Spinner from '../../ui/Spinner'

const SavedDiscussionTab = () => {
	const {
		data: discussions,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		setData: setDiscussions,
	} = useGetList(`saves`, { Limit: 5, Type: 'Discussion' }, false, true, false, [])

	const navigate = useNavigate()

	const onDelete = (DocId) => {
		console.log(DocId)
		setDiscussions(discussions.filter((d) => d.DocId !== DocId))
	}

	const navigateToDiscussion = (id) => {
		navigate(`/Discussions/${id}`)
	}

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Saved Discussions</h4>
			</div>
			<div>
				{isLoading ? (
					<Spinner />
				) : discussions.length > 0 ? (
					<>
						{discussions.map((discussion, index) => {
							let lastItem = discussions.length - 1 === index
							return (
								<SavedDiscussionItem
									discussion={discussion}
									lastItem={lastItem}
									navigateToDiscussion={navigateToDiscussion}
									key={discussion.DocId}
								/>
							)
						})}
					</>
				) : (
					<EmptyMembers emptyText={'No saved discussions'} />
				)}
			</div>
		</div>
	)
}

const SavedDiscussionItem = ({ discussion, lastItem, navigateToDiscussion }) => {
	return (
		<>
			<div
				className={`mt-4 flex flex-row gap-2 cursor-pointer ${
					!lastItem ? 'border-b' : ''
				} pb-4 border-system-file-border`}
				onClick={() => navigateToDiscussion(discussion.DocId)}>
				<div className='h-16 w-28  overflow-hidden rounded-lg'>
					<img src={discussion.CoverPicture} className='object-cover h-full w-full' />
				</div>
				<div className='flex-1'>
					<h4 className='font-semibold text-sm text-system-primary-text'>{discussion.DiscussionName}</h4>
					<div className='flex flex-row gap-3'>
						<p className='text-xs text-brand-gray-dim mt-1 line-clamp-1'>{discussion.Description}</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default SavedDiscussionTab
