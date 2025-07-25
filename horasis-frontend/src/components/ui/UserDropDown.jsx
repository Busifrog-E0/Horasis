import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteItem, patchItem, postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { useFollow } from '../../context/Follow/FollowService'
import personplus from '../../assets/icons/personplus.svg'
import personremove from '../../assets/icons/personremove.svg'
import connectadd from '../../assets/icons/connectadd.svg'
import connectremove from '../../assets/icons/connectremove.svg'

const DropdownConnectComponent = ({ profile, updateList, tabName }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()

	const sendConnectionRequest = () => {
		postItem(
			`connections/${profile.DocId}/send`,
			{},
			(result) => {
				updateList('UPDATE')
				toast.open('success', 'Connection Request Sent', `Connection request sent to ${profile.FullName}`)
				console.log(result)
			},
			(err) => {
				// toast.open('error', 'Connection request error', `Error happened while sending connection request`)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const acceptConnectionRequest = () => {
		patchItem(
			`connections/${profile.DocId}/accept`,
			{},
			(result) => {
				if (tabName === 'received') {
					updateList('REMOVE')
				} else {
					updateList('UPDATE')
				}
				toast.open('success', 'Connection request accepted', `Accepted connection request from ${profile.FullName}`)
				console.log(result)
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
			`connections/${profile.DocId}/reject`,
			(result) => {
				if (tabName === 'received') {
					updateList('REMOVE')
				} else {
					updateList('UPDATE')
				}
				toast.open('info', 'Connection request rejected', `Rejected connection request from ${profile.FullName}`)

				console.log(result)
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
	const cancelConnectionRequest = () => {
		deleteItem(
			`connections/${profile.DocId}/cancel`,
			(result) => {
				if (tabName === 'sent') {
					updateList('REMOVE')
				} else {
					updateList('UPDATE')
				}
				toast.open('info', 'Connection cancelled', `Connection request to ${profile.FullName} cancelled`)
				console.log(result)
			},
			(err) => {
				// toast.open('error', 'Connection cancel error', `Some error happened while cancelling connection request`)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const deleteConnection = () => {
		deleteItem(
			`connections/${profile.DocId}`,
			(result) => {
				if (tabName === 'connections') {
					updateList('REMOVE')
				} else {
					updateList('UPDATE')
				}
				toast.open('info', 'Connection Removed', `Removed connection from ${profile.FullName}`)
				console.log(result)
			},
			(err) => {
				// toast.open('error', 'Connection remove error', `Some error happened while removing connection`)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	if (profile.ConnectionStatus === 'No Connection') {
		return (
			<span
				className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
				role='menuitem'
				onClick={() => {
					sendConnectionRequest()
				}}>
				<img src={connectadd} alt='' className='h-6' />
				Connect
			</span>
		)
	} else if (profile.ConnectionStatus === 'Connected') {
		return (
			<span
				className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
				role='menuitem'
				onClick={() => {
					deleteConnection()
				}}>
				<img src={connectremove} alt='' className='h-6' />
				Remove Connection
			</span>
		)
	} else if (profile.ConnectionStatus === 'Connection Received') {
		return (
			<>
				<span
					className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
					role='menuitem'
					onClick={() => {
						acceptConnectionRequest()
					}}>
					<img src={connectadd} alt='' className='h-6' />
					Accept Request
				</span>
				<span
					className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
					role='menuitem'
					onClick={() => {
						rejectConnectionRequest()
					}}>
					<img src={connectremove} alt='' className='h-6' />
					Reject Request
				</span>
			</>
		)
	} else if (profile.ConnectionStatus === 'Connection Requested') {
		return (
			<span
				className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
				role='menuitem'
				onClick={() => {
					cancelConnectionRequest()
				}}>
				<img src={connectremove} alt='' className='h-6' />
				Cancel Request
			</span>
		)
	} else {
		return <></>
	}
}

const DropdownFollowComponent = ({ profile, updateList, tabName }) => {
	const { followUser, unFollowUser } = useFollow()

	if (profile.IsFollowing) {
		return (
			<>
				<span
					className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
					role='menuitem'
					onClick={() => {
						unFollowUser(profile, () => {
							if (tabName === 'following') {
								updateList('REMOVE')
							} else {
								updateList('UPDATE')
							}
						})
					}}>
					<img src={personremove} alt='' className='h-6' />
					Unfollow
				</span>
			</>
		)
	} else if (!profile.IsFollowing) {
		return (
			<>
				<span
					className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
					role='menuitem'
					onClick={() => {
						followUser(profile, () => {
							updateList('UPDATE')
						})
					}}>
					<img src={personplus} alt='' className='h-6' />
					Follow
				</span>
			</>
		)
	} else {
		return <></>
	}
}

const UserDropDown = ({ memberProfile, updateList, tabName }) => {
	const navigate = useNavigate()
	const { currentUserData } = useContext(AuthContext)
	const dropdownRef = useRef(null)
	const buttonRef = useRef(null)
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

	useEffect(() => {
		if (isOpen) {
			const dropdown = dropdownRef.current
			const button = buttonRef.current
			const rect = dropdown.getBoundingClientRect()
			const buttonRect = button.getBoundingClientRect()

			// Adjust position if dropdown is out of viewport
			if (rect.right > window.innerWidth) {
				dropdown.style.right = 'auto'
				dropdown.style.left = '0'
			} else {
				dropdown.style.left = 'auto'
				dropdown.style.right = '0'
			}

			if (rect.bottom > window.innerHeight) {
				dropdown.style.top = 'auto'
				dropdown.style.bottom = `${buttonRect.height}px`
			} else {
				dropdown.style.bottom = 'auto'
				dropdown.style.top = `${buttonRect.height}px`
			}
		}
	}, [isOpen])

	return (
		<div className='relative inline-block text-left' ref={buttonRef}>
			<button
				type='button'
				className='inline-flex justify-center w-full rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
				onClick={() => setIsOpen(!isOpen)}>
				•••
			</button>
			{isOpen && (
				<div
					className='origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5'
					ref={dropdownRef}>
					<div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
						{profile && profile.ConnectionStatus && (
							<DropdownConnectComponent profile={profile} updateList={updateList} tabName={tabName} />
						)}
						{profile && <DropdownFollowComponent profile={profile} updateList={updateList} tabName={tabName} />}

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
