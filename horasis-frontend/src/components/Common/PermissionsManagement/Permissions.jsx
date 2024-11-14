import { useState } from 'react'
import useGetList from '../../../hooks/useGetList'
import useUpdateData from '../../../hooks/useUpdateData'
import Modal from '../../ui/Modal'
import SearchComponent from '../../Search/SearchBox/SearchComponent'
import Button from '../../ui/Button'
import Spinner from '../../ui/Spinner'
import Switch from '../../ui/Switch'
import deleteIcon from '../../../assets/icons/delete.svg'

const EntityTypes = {
	Discussion: { api: 'discussions', navigationPath: '/Discussions/', label: 'Discussion' },
	Event: { api: 'events', navigationPath: '/Events/', label: 'Event' },
	Podcast: { api: 'podcasts', navigationPath: '/Podcasts/', label: 'Podcast' },
}

const componentContent = (Type) => ({
	CanInviteOthers: {
		Title: 'Group Invitations',
		Subtitle: `Which members of this ${EntityTypes[Type].label} are allowed to invite others?`,
	},
	CanPostActivity: {
		Title: 'Activity Feeds',
		Subtitle: `Which members of this ${EntityTypes[Type].label} are allowed to post into the activity feed?`,
	},
	CanUploadPhoto: {
		Title: 'Group Photos',
		Subtitle: `Which members of this ${EntityTypes[Type].label} are allowed to upload albums?`,
	},
	CanCreateAlbum: {
		Title: 'Group Albums',
		Subtitle: `Which members of this ${EntityTypes[Type].label} are allowed to create albums?`,
	},
	CanUploadVideo: {
		Title: 'Group Videos',
		Subtitle: `Which members of this ${EntityTypes[Type].label} are allowed to upload videos?`,
	},
	IsAdmin: {
		Title: 'Admin',
		Subtitle: `Which members of this ${EntityTypes[Type].label} are allowed to have admin permissions?`,
	},
})

const Permissions = ({ PermissionType, Entity, EntityId, EntityType }) => {
	const [permitEveryone, setPermitEveryone] = useState(() => Entity.MemberPermissions[`${PermissionType}`])

	const [isEveryoneOpen, setIsEveryoneOpen] = useState(false)
	const [isAddOpen, setIsAddOpen] = useState(false)

	const {
		data: entityMembers,
		isLoading,
		getList: getEntityMembers,
	} = useGetList(`members/${EntityId}`, { Limit: 3, [`Permissions.${PermissionType}`]: true }, false, true, true, [])

	const { isLoading: isRemovingPermission, updateData } = useUpdateData()

	const removeUserPermission = (member) =>
		updateData({
			endpoint: `members/${EntityId}/permissions/${member?.UserDetails?.DocId}/remove`,
			payload: { PermissionField: `${PermissionType}`, Type: EntityType },
			onsuccess: (result) => {
				if (result === true) {
					getEntityMembers([])
				}
			},
			onerror: (err) => {},
		})

	const removePermissionForEveryone = () =>
		updateData({
			endpoint: `${EntityTypes[EntityType].api}/${EntityId}/member/permissions/everyone`,
			payload: {
				[`MemberPermissions.${PermissionType}`]: false,
			},
			onsuccess: (result) => {
				setIsEveryoneOpen(false)
				setPermitEveryone(false)
			},
			onerror: (err) => {},
		})

	const addPermissionForEveryone = () =>
		updateData({
			endpoint: `${EntityTypes[EntityType].api}/${EntityId}/member/permissions/everyone`,
			payload: {
				[`MemberPermissions.${PermissionType}`]: true,
			},
			onsuccess: (result) => {
				setIsEveryoneOpen(false)
				setPermitEveryone(true)
			},
			onerror: (err) => {},
		})

	const {
		data: addUsers,
		setData: setAddUsers,
		filters,
		setFilters,
		getList: getAddUsers,
	} = useGetList(`members/${EntityId}`, { Limit: 4, [`Permissions.${PermissionType}`]: false }, false, false, true, [])

	const { isLoading: permissionLoading, updateData: updatePermission } = useUpdateData()

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
			PermissionField: PermissionType,
			UserIds: memberIds,
		}
		return updatePermission({
			endpoint: `members/${EntityId}/permissions`,
			payload: dataToSend,
			onsuccess: (result) => {
				if (result === true) {
					getEntityMembers([])
					setAddedMembers([])
					setIsAddOpen(false)
				}
			},
		})
	}

	return (
		<>
			<Modal isOpen={isAddOpen}>
				<Modal.Header>
					<p className='text-lg font-medium'>Add people</p>
					<button onClick={() => setIsAddOpen(false)}>
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
								<Button disabled={permissionLoading} size='md' variant='outline' onClick={() => setIsAddOpen(false)}>
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

			<Modal isOpen={isEveryoneOpen}>
				<Modal.Header>
					{!permitEveryone && <p className='text-lg font-medium'>Grant permission to everyone?</p>}
					{permitEveryone && <p className='text-lg font-medium'>Remove all member permission access?</p>}
					<button onClick={() => setIsEveryoneOpen(false)}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<div className='flex justify-end gap-2'>
						<Button variant='outline' onClick={() => setIsEveryoneOpen(false)}>
							Cancel
						</Button>
						{!permitEveryone && (
							<Button variant='black' onClick={() => addPermissionForEveryone()}>
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
						<h1 className='text-system-primary-text font-medium text-lg'>
							{componentContent(EntityType)[PermissionType].Title}
						</h1>
						<p className='text-brand-gray mt-1 mb-2 text-base'>
							{componentContent(EntityType)[PermissionType].Subtitle}
						</p>
					</div>
					<div className='flex gap-4 items-start'>
						{!permitEveryone && (
							<>
								<Button
									variant='outline'
									onClick={() => {
										getAddUsers([])
										setIsAddOpen(true)
									}}>
									Add People
								</Button>
							</>
						)}
						{PermissionType !== 'IsAdmin' && (
							<div
								className={`flex items-center gap-2 border-2 ${
									permitEveryone
										? 'border-system-primary-accent-light text-system-primary-accent '
										: 'border-system-primary-bg text-system-secondary-text '
								} py-1 px-4 rounded-xl cursor-pointer`}
								onClick={(e) => {
									e.stopPropagation()
									setIsEveryoneOpen(true)
								}}>
								<p className='font-medium'>Everyone</p>
								<Switch checked={permitEveryone} onChange={(e) => setIsEveryoneOpen(true)} />
							</div>
						)}
					</div>
				</div>
				{isLoading || isRemovingPermission ? (
					<div className='h-10 py-20'>
						<Spinner />
					</div>
				) : (
					<>
						{!permitEveryone && (
							<>
								<div className='flex flex-col'>
									{entityMembers.map((member, index) => {
										const lastItem = entityMembers.length - 1 === index
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
