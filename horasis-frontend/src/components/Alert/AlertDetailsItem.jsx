import React, { useContext, useEffect, useState } from 'react'
import { relativeTime } from '../../utils/date'
import Button from '../../components/ui/Button'
import AlertContent from './Mentions/AlertContent'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'
import { deleteItem, patchItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import useEntityMembershipManager from '../../hooks/useEntityMembershipManager'
import useEntityOrganizationManager from '../../hooks/useEntityOrganizationManager'

const Alert = ({ notification, setIsOpen, getSingleNotification }) => {
	const navigate = useNavigate()
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()

	const acceptConnectionRequest = () => {
		patchItem(
			`connections/${notification.UserDetails.DocId}/accept`,
			{},
			(result) => {
				if (result) {
					getSingleNotification(notification, 'UPDATE')
				}
				toast.open(
					'success',
					'Connection request accepted',
					`Accepted connection request from ${notification.UserDetails.FullName}`
				)
			},
			(err) => {
				// toast.open('error', 'Connection accept error', `Some error happened while accepting connection request`)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const rejectConnectionRequest = () => {
		deleteItem(
			`connections/${notification.UserDetails.DocId}/reject`,
			(result) => {
				if (result) {
					getSingleNotification(notification, 'REMOVE')
				}
				toast.open(
					'info',
					'Connection request rejected',
					`Rejected connection request from ${notification.UserDetails.FullName}`
				)
			},
			(err) => {
				// toast.open('error', 'Connection reject error', `Some error happened while rejecting connection request`)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const { acceptEntityMembershipInvitation: acceptInvite } = useEntityMembershipManager({
		EntityId: notification.EntityId,
		Type: notification.EntityType,
		successCallback: () => getSingleNotification(notification, 'UPDATE'),
		errorCallback: () => {},
	})

	const { rejectEntityMembershipInvitation: rejectInvite } = useEntityMembershipManager({
		EntityId: notification.EntityId,
		Type: notification.EntityType,
		successCallback: () => getSingleNotification(notification, 'REMOVE'),
		errorCallback: () => {},
	})

	const { acceptEntityMembershipRequest: acceptJoinRequest } = useEntityOrganizationManager({
		UserId:notification.UserDetails.DocId,
		EntityId: notification.EntityId,
		Type: notification.EntityType,
		successCallback: () => getSingleNotification(notification, 'UPDATE'),
		errorCallback: () => {},
	})

	const { rejectEntityMembershipRequest: rejectJoinRequest } = useEntityOrganizationManager({
		UserId:notification.UserDetails.DocId,
		EntityId: notification.EntityId,
		Type: notification.EntityType,
		successCallback: () => getSingleNotification(notification, 'REMOVE'),
		errorCallback: () => {},
	})

	// const acceptJoinRequest = () => {
	// 	patchItem(
	// 		`discussions/${notification.EntityId}/join/${notification.UserDetails.DocId}/accept`,
	// 		{},
	// 		(result) => {
	// 			if (result) {
	// 				getSingleNotification(notification, 'UPDATE')
	// 			}
	// 		},
	// 		(err) => {},
	// 		updateCurrentUser,
	// 		currentUserData,
	// 		toast
	// 	)
	// }

	// const rejectJoinRequest = () => {
	// 	deleteItem(
	// 		`discussions/${notification.EntityId}/join/${notification.UserDetails.DocId}/reject`,
	// 		(result) => {
	// 			if (result) {
	// 				getSingleNotification(notification, 'REMOVE')
	// 			}
	// 		},
	// 		(err) => {},
	// 		updateCurrentUser,
	// 		currentUserData,
	// 		toast
	// 	)
	// }

	// const acceptInvite = () => {
	// 	patchItem(
	// 		`discussions/${notification.EntityId}/invite/accept`,
	// 		{},
	// 		(result) => {
	// 			if (result) {
	// 				getSingleNotification(notification, 'UPDATE')
	// 			}
	// 		},
	// 		(err) => {},
	// 		updateCurrentUser,
	// 		currentUserData,
	// 		toast
	// 	)
	// }

	// const rejectInvite = () => {
	// 	deleteItem(
	// 		`discussions/${notification.EntityId}/invite/${currentUserData.CurrentUser.UserId}/reject`,
	// 		(result) => {
	// 			if (result) {
	// 				getSingleNotification(notification, 'REMOVE')
	// 			}
	// 		},
	// 		(err) => {},
	// 		updateCurrentUser,
	// 		currentUserData,
	// 		toast
	// 	)
	// }

	const acceptSpeakerInvite = () => {
		patchItem(
			`events/${notification.EntityId}/speakers`,
			{},
			(result) => {
				if (result) {
					getSingleNotification(notification, 'UPDATE')
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const rejectSpeakerInvite = () => {
		deleteItem(
			`events/${notification.EntityId}/speakers/${currentUserData.CurrentUser.UserId}/reject`,
			(result) => {
				if (result) {
					getSingleNotification(notification, 'REMOVE')
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	if (notification.Type === 'Connection-Request') {
		return (
			<div
				className='p-3 px-5 border-b border-system-file-border hover:bg-system-primary-bg cursor-pointer'
				onClick={(e) => {
					e.stopPropagation()
					navigate(notification.Link)
					setIsOpen(false)
				}}>
				<div className='flex items-start gap-2'>
					{notification?.UserDetails?.ProfilePicture ? (
						<img
							className='w-12 h-12 rounded-full object-cover'
							src={notification?.UserDetails?.ProfilePicture}
							alt='Rounded avatar'
						/>
					) : (
						<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
					)}

					<div className='flex-1 flex flex-col gap-1'>
						{/* <h4 className='font-semibold text-base text-system-primary-accent'>
							{notification?.UserDetails?.FullName}
						</h4> */}
						<h4 className='text-sm font-medium text-system-primary-text'>
							<AlertContent Content={notification.Content} ContentLinks={notification.ContentLinks} />
						</h4>
						{notification.Status === 'Connection Received' && (
							<div className='flex gap-2'>
								<Button
									size='xs'
									variant='black'
									onClick={(e) => {
										e.stopPropagation()
										acceptConnectionRequest()
									}}>
									Accept
								</Button>
								<Button
									size='xs'
									variant='outline'
									onClick={(e) => {
										e.stopPropagation()
										rejectConnectionRequest()
									}}>
									Reject
								</Button>
							</div>
						)}
					</div>
					<div>
						<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(notification.CreatedIndex)}</h4>
					</div>
				</div>
			</div>
		)
	} else if (notification.Type === 'Join-Request') {
		return (
			<div
				className='p-3 px-5 border-b border-system-file-border hover:bg-system-primary-bg cursor-pointer'
				onClick={(e) => {
					e.stopPropagation()
					navigate(notification.Link)
					setIsOpen(false)
				}}>
				<div className='flex items-start gap-2'>
					{notification?.UserDetails?.ProfilePicture ? (
						<img
							className='w-12 h-12 rounded-full object-cover'
							src={notification?.UserDetails?.ProfilePicture}
							alt='Rounded avatar'
						/>
					) : (
						<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
					)}

					<div className='flex-1 flex flex-col gap-1'>
						{/* <h4 className='font-semibold text-base text-system-primary-accent'>
					{notification?.UserDetails?.FullName}
				</h4> */}

						<h4 className='text-sm font-medium text-system-primary-text'>
							<AlertContent Content={notification.Content} ContentLinks={notification.ContentLinks} />
						</h4>
						{notification.Status === 'Requested' && (
							<div className='flex gap-2'>
								<Button
									size='xs'
									variant='black'
									onClick={(e) => {
										e.stopPropagation()
										acceptJoinRequest()
									}}>
									Accept
								</Button>
								<Button
									size='xs'
									variant='outline'
									onClick={(e) => {
										e.stopPropagation()
										rejectJoinRequest()
									}}>
									Reject
								</Button>
							</div>
						)}
					</div>
					<div>
						<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(notification.CreatedIndex)}</h4>
					</div>
				</div>
			</div>
		)
	} else if (notification.Type === 'Invitation') {
		return (
			<div
				className='p-3 px-5 border-b border-system-file-border hover:bg-system-primary-bg cursor-pointer'
				onClick={(e) => {
					e.stopPropagation()
					navigate(notification.Link)
					setIsOpen(false)
				}}>
				<div className='flex items-start gap-2'>
					{notification?.UserDetails?.ProfilePicture ? (
						<img
							className='w-12 h-12 rounded-full object-cover'
							src={notification?.UserDetails?.ProfilePicture}
							alt='Rounded avatar'
						/>
					) : (
						<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
					)}

					<div className='flex-1 flex flex-col gap-1'>
						{/* <h4 className='font-semibold text-base text-system-primary-accent'>
			{notification?.UserDetails?.FullName}
		</h4> */}

						<h4 className='text-sm font-medium text-system-primary-text'>
							<AlertContent Content={notification.Content} ContentLinks={notification.ContentLinks} />
						</h4>
						{notification.Status === 'Invited' && (
							<div className='flex gap-2'>
								<Button
									size='xs'
									variant='black'
									onClick={(e) => {
										e.stopPropagation()
										acceptInvite()
									}}>
									Accept
								</Button>
								<Button
									size='xs'
									variant='outline'
									onClick={(e) => {
										e.stopPropagation()
										rejectInvite()
									}}>
									Reject
								</Button>
							</div>
						)}
					</div>
					<div>
						<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(notification.CreatedIndex)}</h4>
					</div>
				</div>
			</div>
		)
	} else if (notification.Type === 'Invitation-Speaker') {
		return (
			<div
				className='p-3 px-5 border-b border-system-file-border hover:bg-system-primary-bg cursor-pointer'
				onClick={(e) => {
					e.stopPropagation()
					navigate(notification.Link)
					setIsOpen(false)
				}}>
				<div className='flex items-start gap-2'>
					{notification?.UserDetails?.ProfilePicture ? (
						<img
							className='w-12 h-12 rounded-full object-cover'
							src={notification?.UserDetails?.ProfilePicture}
							alt='Rounded avatar'
						/>
					) : (
						<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
					)}

					<div className='flex-1 flex flex-col gap-1'>
						{/* <h4 className='font-semibold text-base text-system-primary-accent'>
	{notification?.UserDetails?.FullName}
</h4> */}

						<h4 className='text-sm font-medium text-system-primary-text'>
							<AlertContent Content={notification.Content} ContentLinks={notification.ContentLinks} />
						</h4>
						{notification.Status === 'Invited' && (
							<div className='flex gap-2'>
								<Button
									size='xs'
									variant='black'
									onClick={(e) => {
										e.stopPropagation()
										acceptSpeakerInvite()
									}}>
									Accept
								</Button>
								<Button
									size='xs'
									variant='outline'
									onClick={(e) => {
										e.stopPropagation()
										rejectSpeakerInvite()
									}}>
									Reject
								</Button>
							</div>
						)}
					</div>
					<div>
						<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(notification.CreatedIndex)}</h4>
					</div>
				</div>
			</div>
		)
	} else
		return (
			<div
				className='p-3 px-5 border-b border-system-file-border cursor-pointer hover:bg-system-primary-bg'
				onClick={() => {
					navigate(notification.Link)
					setIsOpen(false)
				}}>
				<div className='flex items-center gap-2'>
					{notification?.UserDetails?.ProfilePicture ? (
						<img
							className='w-12 h-12 rounded-full object-cover'
							src={notification?.UserDetails?.ProfilePicture}
							alt='Rounded avatar'
						/>
					) : (
						<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
					)}

					<div className='flex-1 flex flex-col gap-1'>
						{/* <h4 className='font-semibold text-base text-system-primary-accent'>{notification?.UserDetails?.FullName}</h4> */}
						<h4 className='text-sm font-medium text-system-primary-text'>
							<AlertContent Content={notification.Content} ContentLinks={notification.ContentLinks} />
						</h4>
					</div>
					<div>
						<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(notification.CreatedIndex)}</h4>
					</div>
				</div>
			</div>
		)
}

export default Alert
