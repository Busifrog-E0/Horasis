import { useState } from 'react'
import avatar from '../../../assets/icons/avatar.svg'
import close from '../../../assets/icons/close.svg'
import deleteIcon from '../../../assets/icons/delete.svg'
import useGetList from '../../../hooks/useGetList'
import useUpdateData from '../../../hooks/useUpdateData'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import Spinner from '../../ui/Spinner'
import Switch from '../../ui/Switch'
import AddUserModal from './AddUserModal'

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

const Permissions = ({ permissionType, discussionId, discussion, from = 'settings' }) => {
	const {
		data: users,
		isLoading,
		getList: fetchUsers,
	} = useGetList(
		`members/${discussionId}`,
		{ Limit: 3, [`Permissions.${permissionType}`]: true },
		false,
		true,
		true,
		[]
	)

	const { isLoading: isRemoving, updateData } = useUpdateData()

	const removeUserPermission = (member) => {
		updateData({
			endpoint: `members/${discussionId}/permissions/${member.UserDetails.DocId}/remove`,
			payload: { PermissionField: `${permissionType}` },
			onsuccess: (result) => {
				if (result === true) {
					fetchUsers([])
				}
			},
			onerror: (err) => {},
		})
	}

	const [permitEveryone, setPermitEveryone] = useState(() => discussion.MemberPermissions[`${permissionType}`])
	const [isEveryoneModal, setIsEveryoneModal] = useState(false)
	const [isAddPeopleModal, setAddPeopleModal] = useState(false)

	const permissionForEveryone = () =>
		updateData({
			endpoint: `/members/${discussionId}/members/permissions/everyone`,
			payload: { [`MemberPermissions.${permissionType}`]: true },
			onsuccess: (result) => {
				setIsEveryoneModal(false)
				setPermitEveryone(true)
			},
			onerror: (err) => {},
		})

	const removePermissionForEveryone = () =>
		updateData({
			endpoint: `/members/${discussionId}/members/permissions/everyone`,
			payload: {
				[`MemberPermissions.${permissionType}`]: false,
			},
			onsuccess: (result) => {
				setIsEveryoneModal(false)
				setPermitEveryone(false)
			},
			onerror: (err) => {},
		})

	return (
		<>
			<AddUserModal
				isAddPeopleModal={isAddPeopleModal}
				setAddPeopleModal={setAddPeopleModal}
				permissionType={permissionType}
				discussionId={discussionId}
				permissionChangeCallback={fetchUsers}
			/>

			<Modal isOpen={isEveryoneModal}>
				<Modal.Header>
					{!permitEveryone && <p className='text-lg font-medium'>Grant permission to everyone?</p>}
					{permitEveryone && <p className='text-lg font-medium'>Remove all member permission access?</p>}
					<button onClick={() => setIsEveryoneModal(false)}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<div className='flex justify-end gap-2'>
						<Button variant='outline' onClick={() => setIsEveryoneModal(false)}>
							Cancel
						</Button>
						{!permitEveryone && (
							<Button variant='black' onClick={() => permissionForEveryone()}>
								Grant
							</Button>
						)}
						{permitEveryone && (
							<Button variant='black' onClick={() => removePermissionForEveryone()}>
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
								<Button variant='outline' onClick={() => setAddPeopleModal(true)}>
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
								<Switch checked={permitEveryone} onChange={(e) => setIsEveryoneModal(true)} />
							</div>
						)}
					</div>
				</div>
				{isLoading || isRemoving ? (
					<div className='h-10 py-20'>
						<Spinner />
					</div>
				) : (
					<>
						{!permitEveryone && (
							<>
								<div className='flex flex-col'>
									{users.map((member, index) => {
										const lastItem = users.length - 1 === index
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
