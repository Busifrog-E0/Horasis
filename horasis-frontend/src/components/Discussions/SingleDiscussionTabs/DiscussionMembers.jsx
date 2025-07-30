import useGetList from '../../../hooks/useGetList'
import EmptyMembers from '../../Common/EmptyMembers'
import Spinner from '../../ui/Spinner'
import DiscussionMembersTab from './DiscussionMembersTab'

const DiscussionMembers = ({ discussionId }) => {
	const {
		isLoading,
		isLoadingMore,
		isPageDisabled,
		data: members,
		getList,
	} = useGetList(`members/${discussionId}`, {}, true, true, true, [])

	if (isLoading) {
		return (
			<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
				<Spinner />
			</div>
		)
	}
	return (
		<>
			<div className='flex flex-col gap-5'>
				{members ? (
					<>
						{members.length > 0 ? (
							<>
								{members.map((item, index) => {
									return <DiscussionMembersTab profile={item} key={item.DocId} />
								})}
							</>
						) : (
							<>
								<EmptyMembers emptyText={'No members'} />
							</>
						)}
					</>
				) : (
					<></>
				)}
			</div>

			{isLoadingMore && (
				<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
					<Spinner />
				</div>
			)}
			{!isPageDisabled && (
				<div onClick={() => getList(members, false)} className='flex flex-row justify-end mt-4 mb-2'>
					<div className='cursor-pointer flex items-center gap-2'>
						<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
					</div>
				</div>
			)}
		</>
	)
}

export default DiscussionMembers
