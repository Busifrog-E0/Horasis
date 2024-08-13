import { useContext, useEffect, useState } from 'react'
import Button from '../../ui/Button'
import avatar from '../../../assets/icons/avatar.svg'
import deleteIcon from '../../../assets/icons/delete.svg'
import Switch from '../../ui/Switch'
import Modal from '../../ui/Modal'
import Input from '../../ui/Input'
import close from '../../../assets/icons/close.svg'
import SearchComponent from '../../Search/SearchBox/SearchComponent'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { getNextId } from '../../../utils/URLParams'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getItem, patchItem } from '../../../constants/operations'
import AddUserModal from './AddUserModal'
import Spinner from '../../ui/Spinner'

const Permissions = ({ permissionType, discussionId }) => {
	const { currentUserData, updateCurrentUser } = useContext(AuthContext)
	const toast = useToast()

	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [permittedUsers, setPermittedUsers] = useState([])
	const [permittedFilters, setPermittedFilters] = useState({
		OrderBy: 'Index',
		Limit: 3,
		Keyword: '',
		[`Permissions.${permissionType}`]: true,
	})

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getData = (endpoint, tempData, setData) => {
		setLoadingCom(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				setData([...tempData, ...data])
				setLoadingCom(tempData, false)
			},
			(err) => {
				setLoadingCom(tempData, false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const hasAnyLeft = (endpoint, tempData) => {
		getItem(
			`${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...permittedFilters, Limit: 1 })}`,
			(data) => {
				if (data?.length > 0) {
					setPageDisabled(false)
				} else {
					setPageDisabled(true)
				}
			},
			(err) => {
				setPageDisabled(true)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const api = `discussions/${discussionId}/members`
	const getPermittedUsers = (tempArr) => {
		getData(`${api}?&${jsonToQuery(permittedFilters)}`, tempArr, setPermittedUsers)
	}

	const fetchDataPermitted = (initialRender = false) => {
		getPermittedUsers(initialRender ? [] : permittedUsers)
	}

	const fetchPermittedUsers = () => fetchDataPermitted(true)
	const fetchMorePermmittedUsers = () => fetchDataPermitted(false)
	useEffect(() => {
		if (permittedUsers.length > 0) hasAnyLeft(`${api}`, permittedUsers)
	}, [permittedUsers])

	useEffect(() => {
		fetchPermittedUsers()
	}, [permittedFilters])

	const [addUserFilters, setAddUserFilters] = useState({
		OrderBy: 'Index',
		Limit: 3,
		Keyword: '',
		[`Permissions.${permissionType}`]: false,
	})

	const removeUserPermission = (member) => {
		patchItem(
			`discussions/${discussionId}/member/${member.UserDetails.DocId}/permissions/remove`,
			{
				PermissionField: `${permissionType}`,
			},
			(result) => {
				console.log(result)
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const [permitEveryone, setPermitEveryone] = useState(false)
	const [isEveryoneModal, setIsEveryoneModal] = useState(false)
	const [isAddPeopleModal, setAddPeopleModal] = useState(false)

	const componentContent = {
		CanInviteOthers: {
			Title: 'Group Invitations',
			Subtitle: 'Which members of this group are allowed to invite others?',
		},
		CanPostActivity: {
			Title: 'Activity Feeds',
			Subtitle: '	Which members of this group are allowed to post into the activity feed?',
		},
		CanUploadPhoto: {
			Title: 'Group Photos',
			Subtitle: 'Which members of this group are allowed to upload albums?',
		},
		CanCreateAlbum: {
			Title: 'Group Albums',
			Subtitle: 'Which members of this group are allowed to create albums?',
		},
		CanUploadVideo: {
			Title: 'Group Videos',
			Subtitle: 'Which members of this group are allowed to upload videos?',
		},
		IsAdmin: {
			Title: 'Admin',
			Subtitle: 'Which members of this group are allowed to admin permissions?',
		},
	}

	

	return (
		<>
			<AddUserModal
				isAddPeopleModal={isAddPeopleModal}
				setAddPeopleModal={setAddPeopleModal}
				permissionType={permissionType}
				discussionId={discussionId}
			/>
			{/* <Modal isOpen={isAddPeopleModal}>
				<Modal.Header>
					<p className='text-lg font-medium'>Add people</p>
					<button
						onClick={() => {
							setAddPeopleModal(false)
						}}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					{addedMembers && addedMembers.length > 0 && (
						<>
							<div className='flex flex-col gap-4 px-4 pb-4 mb-4'>
								{addedMembers.map((member) => {
									return (
										<>
											<SelectedMember member={member} removeSingleUser={removeSingleUser} key={member.DocId} />
										</>
									)
								})}
							</div>
						</>
					)}
					<div className='px-4'>
						<SearchComponent
							// searchKey={filters.Keyword}
							// setSearchKey={(value) => setFilters((prev) => ({ ...prev, Keyword: value }))}
							placeholder='Search Members'
						/>
					</div>
					{members && members.length > 0 && (
						<>
							<div className='flex flex-col px-4'>
								{members.map((member, index) => {
									const lastItem = members.length - 1 === index
									return (
										<MemberTab
											connection={member}
											lastItem={lastItem}
											key={member.DocId}
											hideDelete={false}
											onAddClick={onAddClick}
										/>
									)
								})}
							</div>
						</>
					)}
				</Modal.Body>
			</Modal> */}
			<Modal isOpen={isEveryoneModal}>
				<Modal.Header>
					{!permitEveryone && <p className='text-lg font-medium'>Grant permission to everyone?</p>}
					{permitEveryone && <p className='text-lg font-medium'>Remove all member permission access?</p>}
					<button
						onClick={() => {
							setIsEveryoneModal(false)
						}}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<div className='flex justify-end gap-2'>
						<Button
							variant='outline'
							onClick={() => {
								setIsEveryoneModal(false)
							}}>
							Cancel
						</Button>
						{!permitEveryone && (
							<Button
								variant='black'
								onClick={() => {
									setIsEveryoneModal(false)
									setPermitEveryone(true)
								}}>
								Grant
							</Button>
						)}
						{permitEveryone && (
							<Button
								variant='black'
								onClick={() => {
									setIsEveryoneModal(false)
									setPermitEveryone(false)
								}}>
								Remove
							</Button>
						)}
					</div>
				</Modal.Body>
			</Modal>
			<div className='border flex flex-col p-4 rounded-md justify-between'>
				<div className='flex flex-col md:flex-row gap-2 justify-between mb-6 md:mb-0 md:items-center'>
					<div>
						<h1 className='text-system-primary-text font-medium text-lg'>{componentContent[permissionType].Title}</h1>
						<p className='text-brand-gray mt-1 mb-2 text-base'>{componentContent[permissionType].Subtitle}</p>
					</div>
					<div className='flex gap-4 items-start'>
						{!permitEveryone && (
							<>
								<Button
									variant='outline'
									onClick={() => {
										setAddPeopleModal(true)
									}}>
									Add People
								</Button>
							</>
						)}
						{permissionType !== 'IsAdmin' && (
							<div
								className={`flex items-center gap-2 border-2 ${
									permitEveryone
										? 'border-system-primary-accent-light text-system-primary-accent '
										: 'border-system-primary-bg text-system-secondary-text '
								} py-1 px-4 rounded-xl cursor-pointer`}
								onClick={(e) => {
									e.stopPropagation()
									setIsEveryoneModal(true)
								}}>
								<p className='font-medium'>Everyone</p>
								<Switch
									checked={permitEveryone}
									onChange={(e) => {
										// e.stopPropogation()
										setIsEveryoneModal(true)
									}}
								/>
							</div>
						)}
					</div>
				</div>
				{isLoading ? (
					<div className='h-10 py-20'>
						<Spinner />
					</div>
				) : (
					<>
						{!permitEveryone && (
							<>
								<div className='flex flex-col'>
									{permittedUsers.map((member, index) => {
										const lastItem = permittedUsers.length - 1 === index
										return (
											<MemberTab
												member={member}
												lastItem={lastItem}
												key={member.DocId}
												onDeleteClick={removeUserPermission}
											/>
										)
									})}
								</div>
							</>
						)}
					</>
				)}
			</div>
		</>
	)
}

export const MemberTab = ({ member, lastItem, hideDelete = true, onAddClick = () => {}, onDeleteClick = () => {} }) => {
	return (
		<div className={`${!lastItem ? 'border-b border-system-file-border' : ''} pb-4 pt-4`}>
			<div className='flex items-center gap-3'>
				{member ? (
					<>
						{member?.UserDetails?.ProfilePicture ? (
							<div className='w-11 h-11 rounded-full bg-black'>
								<img
									className='w-11 h-11 rounded-full object-cover'
									src={member?.UserDetails?.ProfilePicture}
									alt='Rounded avatar'
								/>
							</div>
						) : (
							<>
								<div className='w-11 h-11 rounded-full bg-brand-light-gray'>
									<img src={avatar} className='object-cover h-full w-full rounded-lg' />
								</div>
							</>
						)}
					</>
				) : (
					<></>
				)}

				<div className='flex-1'>
					<h4 className='font-semibold text-system-primary-accent'>{member && member?.UserDetails?.FullName}</h4>
					<h4 className='font-medium text-sm text-brand-gray-dim mt-1'>@{member && member?.UserDetails?.Username}</h4>
				</div>

				{hideDelete ? (
					<img src={deleteIcon} alt='' className='h-6 cursor-pointer' onClick={() => onDeleteClick(member)} />
				) : (
					<>
						<Button variant='outline' onClick={() => onAddClick(member)}>
							Add
						</Button>
					</>
				)}
			</div>
		</div>
	)
}

export const SelectedMember = ({ member, removeSingleUser }) => {
	return (
		<>
			<div className=' flex justify-between items-center  py-2 px-3 rounded-full border border-system-primary-accent bg-system-primary-accent-light gap-2 '>
				<div className='text-system-primary-accent'>
					<p className='text-base font-semibold'>{member.UserDetails.FullName}</p>
					{/* <p className='text-sm text-system-primary-accent-transparent font-medium'>@{member.UserDetails.Username}</p> */}
				</div>
				<div>
					<img src={close} className='h-5  cursor-pointer' alt='' onClick={() => removeSingleUser(member)} />
				</div>
			</div>
		</>
	)
}

export default Permissions
