import Modal from '../../ui/Modal'
import close from '../../../assets/icons/close.svg'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { getItem, patchItem } from '../../../constants/operations'
import SearchComponent from '../../Search/SearchBox/SearchComponent'
import { MemberTab, SelectedMember } from './Permissions'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import Button from '../../ui/Button'

const AddUserModal = ({ isAddPeopleModal, setAddPeopleModal, permissionType, discussionId }) => {
	const { currentUserData, updateCurrentUser } = useContext(AuthContext)
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
			toast
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
			toast
		)
	}

	const [isLoadingAddUsers, setIsLoadingAddUsers] = useState(true)
	const [isLoadingMoreAddUsers, setIsLoadingMoreAddUsers] = useState(false)
	const [pageDisabledAddUsers, setPageDisabledAddUsers] = useState(true)
	const [addUsers, setAddUsers] = useState([])
	const [addUserFilters, setAddUserFilters] = useState({
		OrderBy: 'Index',
		Limit: 4,
		Keyword: '',
		[`Permissions.${permissionType}`]: false,
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
	const api = `discussions/${discussionId}/members`
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
		fetchAddUsers()
	}, [addUserFilters])

	const handleSubmitPermissions = () => {
		const memberIds = addedMembers.map((member) => {
			return member.UserDetails.DocId
		})
		const dataToSend = {
			[`${permissionType}`]: memberIds,
		}

		patchItem(
			`discussions/${discussionId}/member/permissions`,
			dataToSend,
			(result) => {
				if(result === true){
					setAddPeopleModal(false)

				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
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
						<SearchComponent
							searchKey={addUserFilters.Keyword}
							setSearchKey={(value) => setAddUserFilters((prev) => ({ ...prev, Keyword: value }))}
							placeholder='Search Members'
						/>
					</div>
					{addUsers && addUsers.length > 0 && (
						<>
							<div className='flex flex-col px-4'>
								{addUsers.map((member, index) => {
									const lastItem = addUsers.length - 1 === index
									return (
										<MemberTab
											member={member}
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
					<div className='flex items-center justify-end gap-4 py-2'>
						<Button
							size='md'
							variant='outline'
							onClick={() => {
								setAddPeopleModal(false)
							}}>
							Cancel
						</Button>
						<Button size='md' variant='black' onClick={handleSubmitPermissions}>
							Add Users
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default AddUserModal
