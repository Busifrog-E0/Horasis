import useEntityMembershipManager from '../../hooks/useEntityMembershipManager'
import useGetData from '../../hooks/useGetData'
import { useAuth } from '../../utils/AuthProvider'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

const DiscussionTab = ({ discussion, onClick, fetch, updateList, data }) => {
	const { currentUserData } = useAuth()

	const onsuccess = (result) =>
		updateList(data.map((dis) => (dis.DocId === discussion.DocId ? { NextId: dis.NextId, ...result } : dis)))

	const { isLoading: isLoadingDiscussion, getData: getSingleDiscussion } = useGetData(
		`discussions/${discussion?.DocId}`,
		{ onSuccess: onsuccess, onError: () => {} },false
	)

	const {
		isLoading,
		subscribeEntityMembership: joinDiscussion,
		unsubscribeEntityMembership: unFollowDiscussion,
		cancelEntityMembershipSubscription: cancelJoinRequest,
		acceptEntityMembershipInvitation: acceptInvite,
		rejectEntityMembershipInvitation: rejectInvite,
	} = useEntityMembershipManager({
		EntityId: discussion?.DocId,
		Type: 'Discussion',
		successCallback: getSingleDiscussion,
		errorCallback: () => {},
	})

	return (
		<div className='rounded-lg mt-3 pb-2 overflow-hidden h-full bg-system-secondary-bg flex flex-col justify-between shadow-lg'>
			<div>
				<div className='h-28 overflow-hidden rounded-t-lg cursor-pointer' onClick={() => onClick(discussion.DocId)}>
					<img src={discussion.CoverPicture} className='object-cover h-full w-full' />
				</div>
				<div className='p-2 px-6 cursor-pointer' onClick={() => onClick(discussion.DocId)}>
					<div className='flex flex-wrap items-center gap-x-2'>
						<h4 className='text-xs text-brand-gray-dim'>{discussion.Privacy} Discussion</h4>
						<h4 className='tetx-xs text-brand-gray-dim'>•</h4>
						<h4 className='text-xs text-brand-gray-dim'>{discussion.NoOfMembers} Members</h4>
					</div>
					<h4 className='text-base font-semibold text-system-primary-text mb-1 leading-6'>
						{discussion.DiscussionName}
					</h4>
					<h4 className=' text-xs text-brand-gray-dim min-h-16 max-h-16 overflow-hidden'>{discussion.Brief}</h4>
				</div>
			</div>

			<div className='flex items-center justify-center my-2 gap-2'>
				{isLoading || isLoadingDiscussion ? (
					<Spinner />
				) : (
					<>
						{discussion.IsMember ? (
							<>
								{currentUserData.CurrentUser.UserId !== discussion.OrganiserId && (
									<Button
										variant='outline'
										onClick={() => {
											unFollowDiscussion()
										}}>
										Unfollow
									</Button>
								)}
							</>
						) : (
							<>
								{discussion.MembershipStatus === undefined && (
									<Button
										variant='black'
										onClick={() => {
											joinDiscussion()
										}}>
										Follow
									</Button>
								)}
								{discussion.MembershipStatus === 'Requested' && (
									<Button variant='outline' onClick={() => cancelJoinRequest()}>
										Cancel Request
									</Button>
								)}
								{discussion.MembershipStatus === 'Invited' && (
									<div className='flex flex-col items-center gap-2 px-4 '>
										<p className='text-system-secondary-text text-center text-xs'>
											You have been invited to this discussion
										</p>
										<div className='flex gap-2'>
											<Button variant='black' onClick={() => acceptInvite()}>
												Accept
											</Button>
											<Button variant='outline' onClick={() => rejectInvite()}>
												Reject
											</Button>
										</div>
									</div>
								)}
							</>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default DiscussionTab
