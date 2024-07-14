import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteItem, patchItem, postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'

const DropdownConnectComponent = ({ profile, updateList }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)

	const sendConnectionRequest = () => {
		postItem(
			`connections/${profile.DocId}/send`,
			{},
			(result) => {
				updateList([])
				console.log(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData
		)
	}
	const acceptConnectionRequest = () => {
		patchItem(
			`connections/${profile.DocId}/accept`,
			{},
			(result) => {
				updateList([])
				console.log(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData
		)
	}
	const rejectConnectionRequest = () => {
		deleteItem(
			`connections/${profile.DocId}/reject`,
			(result) => {
				updateList([])
				console.log(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData
		)
	}
	const cancelConnectionRequest = () => {
		deleteItem(
			`connections/${profile.DocId}/cancel`,
			(result) => {
				updateList([])
				console.log(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData
		)
	}
	const deleteConnection = () => {
		deleteItem(
			`connections/${profile.DocId}`,
			(result) => {
				updateList([])
				console.log(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData
		)
	}

	if (profile.ConnectionStatus === 'No Connection') {
		return (
			<span
				className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
				role='menuitem'
				onClick={() => {
					sendConnectionRequest()
				}}>
				Connect
			</span>
		)
	} else if (profile.ConnectionStatus === 'Connected') {
		return (
			<span
				className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
				role='menuitem'
				onClick={() => {
					deleteConnection()
				}}>
				Remove Connection
			</span>
		)
	} else if (profile.ConnectionStatus === 'Connection Received') {
		return (
			<>
				<span
					className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
					role='menuitem'
					onClick={() => {
						acceptConnectionRequest()
					}}>
					Accept Request
				</span>
				<span
					className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
					role='menuitem'
					onClick={() => {
						rejectConnectionRequest()
					}}>
					Reject Request
				</span>
			</>
		)
	} else if (profile.ConnectionStatus === 'Connection Requested') {
		return (
			<span
				className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
				role='menuitem'
				onClick={() => {
					cancelConnectionRequest()
				}}>
				Cancel Request
			</span>
		)
	} else {
		return <></>
	}
}

const DropdownFollowComponent = ({ profile, updateList }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)

	const followUser = () => {
		postItem(
			'follow',
			{
				FolloweeId: profile.DocId,
			},
			(result) => {
				if (result === true) {
					updateList([])
				}
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData
		)
	}

	const unFollowUser = () => {
		deleteItem(
			`users/${currentUserData.CurrentUser.UserId}/follow/${profile.DocId}`,
			(result) => {
				if (result === true) {
					updateList([])
				}
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData
		)
	}
	if (profile.IsFollowing) {
		return (
			<>
				<span
					className='cursor-pointer flex px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
					role='menuitem'
					onClick={() => {
						unFollowUser()
					}}>
					Unfollow
				</span>
			</>
		)
	} else if (!profile.IsFollowing) {
		return (
			<>
				<span
					className='cursor-pointer flex px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
					role='menuitem'
					onClick={() => {
						followUser()
					}}>
					Follow
				</span>
			</>
		)
	} else {
		return <></>
	}
}

const UserDropDown = ({ memberProfile, updateList }) => {
	const navigate = useNavigate()
	const { currentUserData } = useContext(AuthContext)
	const dropdownRef = useRef(null)
	const [profile, setProfile] = useState(memberProfile)
	const [isOpen, setIsOpen] = useState(false)

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false)
		}
	}
	const goToProfile = () => {
		if (profile) {
			if (profile.DocId === currentUserData.CurrentUser.UserId) {
				navigate(`/MyProfile`)
			} else {
				navigate(`/ViewProfile/${profile.DocId}`)
			}
		}
	}

	useEffect(() => {
		// getUserDetails()
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className='relative inline-block text-left' ref={dropdownRef}>
			<button
				type='button'
				className='inline-flex justify-center w-full rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
				onClick={() => setIsOpen(!isOpen)}>
				•••
			</button>
			{isOpen && (
				<div className='origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5'>
					<div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
						{profile && profile.ConnectionStatus && <DropdownConnectComponent profile={profile} updateList={updateList} />}
						{profile && <DropdownFollowComponent profile={profile} updateList={updateList} />}

						{/* <span
							className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
							role='menuitem'
							onClick={() => {
								goToProfile()
							}}>
							View Profile
						</span> */}
					</div>
				</div>
			)}
		</div>
	)
}

export default UserDropDown
