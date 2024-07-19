import { useState } from 'react'
import EmptyMembers from '../../../Common/EmptyMembers'
import PostSearchSectionTab from './PostSearchSectionTab'

const PostsSearchSection = ({
	posts,
	emptyText,
	updateList,
	whichTime,
	tabName,
}) => {
	const [updatingId, setUpdatingId] = useState(null)

	return (
		<>
			<div className='flex flex-col gap-5'>
				{posts ? (
					<>
						{posts.length > 0 ? (
							<>
								{posts.map((item, index) => {
									let lastElement = posts.length === index + 1
									return (
										<PostSearchSectionTab activity={item}
											ShowImage={false}
											titleSize={'text-xl'}
											onDelete={() => { }}
											descriptionSize={'text-lg font-medium'}
											avatarSize={'w-16 h-16'}
											className={`p-5 bg-system-secondary-bg rounded-lg relative`}
											bordered={false}
											key={item.DocId}
										/>
									)
								})}
							</>
						) : (
							<>
								<EmptyMembers emptyText={emptyText} />
							</>
						)}
					</>
				) : (
					<></>
				)}
			</div>
		</>
	)
}

export default PostsSearchSection
