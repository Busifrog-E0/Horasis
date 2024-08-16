import { useContext, useEffect, useState } from 'react'
import { deleteItem, getItem, patchItem, postItem } from '../../constants/operations'
import Button from '../ui/Button'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import Spinner from '../ui/Spinner'

const DiscussionTab = ({ discussion, onClick, fetch, updateList, data }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)

	const acceptInvite = () => {
		setIsLoading(true)
		patchItem(
			`discussions/${discussion.DocId}/invite/accept`,
			{},
			(result) => {
				if (result === true) {
					// fetch()
					getSingleDiscussion(discussion.DocId)
				}
			},
			(err) => {
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const joinDiscussion = () => {
		setIsLoading(true)
		postItem(
			`discussions/${discussion.DocId}/join`,
			{},
			(result) => {
				if (result === true) {
					// fetch()
					getSingleDiscussion(discussion.DocId)
				} else if (typeof result === 'object') {
					// fetch()
					getSingleDiscussion(discussion.DocId)
				}
			},
			(err) => {
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const rejectInvite = () => {
		setIsLoading(true)
		deleteItem(
			`discussions/${discussion.DocId}/invite/${currentUserData.CurrentUser.UserId}/reject`,
			(result) => {
				if (result === true) {
					// fetch()
					getSingleDiscussion(discussion.DocId)
				}
			},
			(err) => {
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const unFollowDiscussion = () => {
		setIsLoading(true)
		deleteItem(
			`discussions/${discussion.DocId}/leave`,
			(result) => {
				if (result === true) {
					// fetch()
					getSingleDiscussion(discussion.DocId)
				}
			},
			(err) => {
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const cancelJoinRequest = () => {
		setIsLoading(true)
		deleteItem(
			`discussions/${discussion.DocId}/join/${currentUserData.CurrentUser.UserId}/cancel`,
			(result) => {
				if (result === true) {
					// fetch()
					getSingleDiscussion(discussion.DocId)
				}
			},
			(err) => {
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getSingleDiscussion = (discussionId) => {
		setIsLoading(true)
		getItem(
			`discussions/${discussionId}`,
			(result) => {
				updateList(
					data.map((discussion) =>
						discussion.DocId === discussionId ? { NextId: discussion.NextId, ...result } : discussion
					)
				)
				setIsLoading(false)
			},
			(err) => {
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<div className='rounded-lg mt-3 pb-2 overflow-hidden h-full bg-system-secondary-bg flex flex-col justify-between '>
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
				{isLoading ? (
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

				{/* {discussion.Privacy === 'Private' ? (
					<>
						{discussion.Status === 'Invited' ? (
							<>
								<Button onClick={() => acceptInvite()} variant='black'>
									Accept invite
								</Button>
							</>
						) : (
							<>
								<Button
									onClick={() => unFollowDiscussion()}
									variant='black'
									className='bg-system-secondary-text border-system-secondary-text'>
									Unfollow
								</Button>
							</>
						)}
					</>
				) : (
					<>
						{!discussion.IsMember ? (
							<Button onClick={() => joinDiscussion()} variant='black'>
								Follow
							</Button>
						) : (
							<Button
								onClick={() => unFollowDiscussion()}
								variant='black'
								className='bg-system-secondary-text border-system-secondary-text'>
								Unfollow
							</Button>
						)}
					</>
				)} */}
			</div>
		</div>
	)
}

export default DiscussionTab
