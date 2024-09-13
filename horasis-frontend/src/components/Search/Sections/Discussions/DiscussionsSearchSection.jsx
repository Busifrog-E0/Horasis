import { useState } from 'react'
import EmptyMembers from '../../../Common/EmptyMembers'
import DiscussionSearchSectionTab from './DiscussionSearchSectionTab'

const DiscussionsSearchSection = ({
	discussions,
	emptyText,
	updateList,
	whichTime,
	tabName,
}) => {
	const [updatingId, setUpdatingId] = useState(null)

	return (
		<>
			<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
				<div className='flex flex-col gap-5'>
					{discussions ? (
						<>
							{discussions.length > 0 ? (
								<>
									{discussions.map((item, index) => {
										let lastElement = discussions.length === index + 1
										return (
											<DiscussionSearchSectionTab key={index} discussion={item}
												lastElement={lastElement}
												updateList={(actionType) => {

												}}
												whichTime={whichTime}
												updatingId={updatingId}
												tabName={tabName} />
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


			</div>
		</>
	)
}

export default DiscussionsSearchSection
