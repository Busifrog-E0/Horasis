import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useDeleteData from '../../../hooks/useDeleteData'
import Modal from '../../ui/Modal'
import close from '../../../assets/icons/close.svg'
import Button from '../../ui/Button'
import Permissions from './Permissions'

const EntityTypes = {
	Discussion: { api: 'discussions', navigationPath: '/Discussions/', label: 'Discussion' },
	Event: { api: 'events', navigationPath: '/Events/', label: 'Event' },
	Podcast: { api: 'podcasts', navigationPath: '/Podcasts/', label: 'Podcast' },
}

const Settings = ({
	EntityId,
	Type,
	Entity,
	from = 'settings',
	permissionsToShow = { Invitation: true, Activity: true, Photo: true, Album: true, Video: true, Admin: true },
}) => {
	const navigate = useNavigate()
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)

	const { isLoading, deleteData: deleteEntity } = useDeleteData(`${EntityTypes[Type].api}/${EntityId}`, {
		onSuccess: (result) => {
			if (result === true) {
				navigate(EntityTypes[Type].navigationPath)
			}
		},
		onError: (err) => {},
	})

	const viewEntityPage = () => navigate(`${EntityTypes[Type].navigationPath}${EntityId}`)

	return (
		<>
			<Modal isOpen={isDeleteOpen}>
				<Modal.Header>
					<p className='text-lg font-medium'>You are about delete the {EntityTypes[Type].label}</p>
					<button onClick={() => setIsDeleteOpen(false)}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<div className='flex items-center justify-end gap-2'>
						<Button variant='outline' onClick={() => setIsDeleteOpen(false)}>
							Cancel
						</Button>
						<Button variant='danger' onClick={deleteEntity}>
							Delete {EntityTypes[Type].label}
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<div className='flex flex-col gap-4'>
				{from === 'create' && (
					<div className='self-end'>
						<p className='text-system-primary-accent font-medium cursor-pointer' onClick={() => viewEntityPage()}>
							Skip for now
						</p>
					</div>
				)}

				{/* Permissions list */}
				{permissionsToShow.Invitation === true && (
					<Permissions PermissionType='CanInviteOthers' Entity={Entity} EntityId={EntityId} EntityType={Type} />
				)}
				{permissionsToShow.Activity === true && (
					<Permissions PermissionType='CanPostActivity' Entity={Entity} EntityId={EntityId} EntityType={Type} />
				)}
				{permissionsToShow.Photo === true && (
					<Permissions PermissionType='CanUploadPhoto' Entity={Entity} EntityId={EntityId} EntityType={Type} />
				)}
				{permissionsToShow.Album === true && (
					<Permissions PermissionType='CanCreateAlbum' Entity={Entity} EntityId={EntityId} EntityType={Type} />
				)}
				{permissionsToShow.Video === true && (
					<Permissions PermissionType='CanUploadVideo' Entity={Entity} EntityId={EntityId} EntityType={Type} />
				)}
				{permissionsToShow.Admin === true && (
					<Permissions PermissionType='IsAdmin' Entity={Entity} EntityId={EntityId} EntityType={Type} />
				)}

				{/* Delete entity */}
				{from === 'settings' && (
					<div className='border flex flex-col p-4 rounded-md justify-between'>
						<div className='flex flex-col md:flex-row gap-2 justify-between mb-6 md:mb-0 md:items-center'>
							<div>
								<h1 className='text-system-error font-medium text-lg'>Delete the {EntityTypes[Type].label}</h1>
								<p className='text-brand-gray mt-1 mb-2 text-base'>
									Deleting {EntityTypes[Type].label} will remove all the activity and data in the{' '}
									{EntityTypes[Type].label}.
								</p>
							</div>
							<div className='flex gap-4 items-start'>
								<Button variant='danger_outlined' size='md' onClick={() => setIsDeleteOpen(true)}>
									Delete
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default Settings
