import { useEffect, useState } from 'react'
import close from '../../../assets/icons/close.svg'
import { getItem, patchItem } from '../../../constants/operations'
import { useSuperAuth } from '../../../context/SuperAdmin/SuperAuthService'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import SearchComponent from '../../Search/SearchBox/SearchComponent'
import { useToast } from '../../Toast/ToastService'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import Spinner from '../../ui/Spinner'
import avatar from '../../../assets/icons/avatar.svg'
import deleteIcon from '../../../assets/icons/delete.svg'

export const MemberTab = ({ member, lastItem, hideDelete = true, onAddClick = () => {}, onDeleteClick = () => {} }) => {
	return (
		<div className={`${!lastItem ? 'border-b border-system-file-border' : ''} pb-4 pt-4`}>
			<div className='flex items-center gap-3'>
				{member ? (
					<>
						{member?.ProfilePicture ? (
							<div className='w-11 h-11 rounded-full bg-black'>
								<img className='w-11 h-11 rounded-full object-cover' src={member?.ProfilePicture} alt='Rounded avatar' />
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
					<h4 className='font-semibold text-system-primary-accent'>{member && member?.FullName}</h4>
					<h4 className='font-medium text-sm text-brand-gray-dim mt-1'>@{member && member?.Username}</h4>
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

const SelectedMember = ({ member, removeSingleUser }) => {
	return (
		<>
			<div className=' flex justify-between items-center  py-2 px-3 rounded-full border border-system-primary-accent bg-system-primary-accent-light gap-2 '>
				<div className='text-system-primary-accent'>
					<p className='text-base font-semibold'>{member.FullName}</p>
					{/* <p className='text-sm text-system-primary-accent-transparent font-medium'>@{member.UserDetails.Username}</p> */}
				</div>
				<div>
					<img src={close} className='h-5  cursor-pointer' alt='' onClick={() => removeSingleUser(member)} />
				</div>
			</div>
		</>
	)
}

const AddAdminModal = ({ isAddPeopleModal, setAddPeopleModal, permissionChangeCallback = () => {} }) => {
	const { currentUserData, updateCurrentUser } = useSuperAuth()
	const toast = useToast()

	const getData = (endpoint, tempData, setData) => {
		setLoadingComAddUsers(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				setData([...tempData, ...data])
				setLoadingComAddUsers(tempData, false)
			},
			(err) => {
				setLoadingComAddUsers(tempData, false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}
	const hasAnyLeft = (endpoint, tempData) => {
		getItem(
			`${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...addUserFilters, Limit: 1 })}`,
			(data) => {
				if (data?.length > 0) {
					setPageDisabledAddUsers(false)
				} else {
					setPageDisabledAddUsers(true)
				}
			},
			(err) => {
				setPageDisabledAddUsers(true)
			},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}

	const [isLoadingAddUsers, setIsLoadingAddUsers] = useState(true)
	const [isLoadingMoreAddUsers, setIsLoadingMoreAddUsers] = useState(false)
	const [pageDisabledAddUsers, setPageDisabledAddUsers] = useState(true)
	const [addUsers, setAddUsers] = useState([])
	const [addUserFilters, setAddUserFilters] = useState({
		OrderBy: 'Index',
		Limit: 3,
		Keyword: '',
		Role: 'User',
	})

	const [addedMembers, setAddedMembers] = useState([])
	const onAddClick = (member) => {
		setAddUsers((prev) =>
			prev.filter((user) => {
				return user.DocId !== member.DocId
			})
		)
		setAddedMembers((prev) => [...prev, member])
	}
	const removeSingleUser = (member) => {
		setAddedMembers((prev) =>
			prev.filter((user) => {
				return user.DocId !== member.DocId
			})
		)
		setAddUsers((prev) => [...prev, member])
	}
	const api = `admin/users`
	const getAddUsers = (tempArr) => {
		getData(`${api}?&${jsonToQuery(addUserFilters)}`, tempArr, setAddUsers)
	}
	const setLoadingComAddUsers = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMoreAddUsers(value)
		} else {
			setIsLoadingAddUsers(value)
		}
	}

	const fetchDataAdd = (initialRender = false) => {
		getAddUsers(initialRender ? [] : addUsers)
	}

	const fetchAddUsers = () => fetchDataAdd(true)
	const fetchMoreAddUsers = () => fetchDataAdd(false)
	useEffect(() => {
		if (addUsers.length > 0) hasAnyLeft(`${api}`, addUsers)
	}, [addUsers])

	useEffect(() => {
		if (addUserFilters.Keyword.length > 0) {
			fetchAddUsers()
		}
	}, [addUserFilters])

	const [permissionLoading, setPermissionLoading] = useState(false)

	const handleSubmitPermissions = () => {
		const memberIds = addedMembers.map((member) => {
			return member.DocId
		})
		const dataToSend = {
			UserIds: memberIds,
		}
		setPermissionLoading(true)
		patchItem(
			`admin/addAdmin`,
			dataToSend,
			(result) => {
				setPermissionLoading(false)
				if (result === true) {
					permissionChangeCallback()
					setAddedMembers([])
					setAddPeopleModal(false)
				}
			},
			(err) => {
				setPermissionLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}

	return (
		<>
			<Modal isOpen={isAddPeopleModal}>
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
						<div className='flex gap-4 px-4 pb-4 mb-4'>
							{addedMembers.map((member) => {
								return <SelectedMember member={member} removeSingleUser={removeSingleUser} key={member.DocId} />
							})}
						</div>
					)}
					<div className='px-4'>
						<SearchComponent searchKey={addUserFilters.Keyword} setSearchKey={(value) => setAddUserFilters((prev) => ({ ...prev, Keyword: value }))} placeholder='Search Members' />
					</div>
					{addUsers && addUsers.length > 0 && (
						<>
							<div className='flex flex-col px-4'>
								{addUsers.map((member, index) => {
									const lastItem = addUsers.length - 1 === index
									return <MemberTab member={member} lastItem={lastItem} key={member.DocId} hideDelete={false} onAddClick={onAddClick} />
								})}
							</div>
						</>
					)}
					<div className='flex items-center justify-end gap-4 py-2'>
						{permissionLoading && <Spinner />}
						{!permissionLoading && (
							<>
								<Button
									disabled={permissionLoading}
									size='md'
									variant='outline'
									onClick={() => {
										setAddPeopleModal(false)
									}}>
									Cancel
								</Button>
								<Button disabled={permissionLoading} size='md' variant='black' onClick={handleSubmitPermissions}>
									Add Users
								</Button>
							</>
						)}
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default AddAdminModal
