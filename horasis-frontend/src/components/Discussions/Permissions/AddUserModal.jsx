import { useState } from 'react'
import close from '../../../assets/icons/close.svg'
import useGetList from '../../../hooks/useGetList'
import useUpdateData from '../../../hooks/useUpdateData'
import SearchComponent from '../../Search/SearchBox/SearchComponent'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import Spinner from '../../ui/Spinner'
import { MemberTab, SelectedMember } from './Permissions'

const AddUserModal = ({
	isAddPeopleModal,
	setAddPeopleModal,
	permissionType,
	discussionId,
	permissionChangeCallback = () => {},
}) => {
	const {
		data: addUsers,
		setData: setAddUsers,
		filters,
		setFilters,
	} = useGetList(
		`members/${discussionId}`,
		{ Limit: 4, [`Permissions.${permissionType}`]: false },
		false,
		true,
		true,
		[]
	)

	const { isLoading: permissionLoading, updateData } = useUpdateData()

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

	const handleSubmitPermissions = () => {
		const memberIds = addedMembers.map((member) => {
			return member.UserDetails.DocId
		})
		const dataToSend = {
			PermissionField: permissionType,
			UserIds: memberIds,
		}
		return updateData({
			endpoint: `members/${discussionId}/permissions`,
			payload: dataToSend,
			onsuccess: (result) => {
				if (result === true) {
					permissionChangeCallback()
					setAddedMembers([])
					setAddPeopleModal(false)
				}
			},
		})
	}

	return (
		<>
			<Modal isOpen={isAddPeopleModal}>
				<Modal.Header>
					<p className='text-lg font-medium'>Add people</p>
					<button onClick={() => setAddPeopleModal(false)}>
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
							searchKey={filters.Keyword}
							setSearchKey={(value) => setFilters((prev) => ({ ...prev, Keyword: value }))}
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
						{permissionLoading && <Spinner />}
						{!permissionLoading && (
							<>
								<Button
									disabled={permissionLoading}
									size='md'
									variant='outline'
									onClick={() => setAddPeopleModal(false)}>
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

export default AddUserModal
