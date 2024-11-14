import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import close from '../../../assets/icons/close.svg'
import useDeleteData from '../../../hooks/useDeleteData'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import Permissions from '../Permissions/Permissions'

const DiscussionSettings = ({ discussionId, from = 'settings', discussion }) => {
	const navigate = useNavigate()
	const [deleteModal, setDeleteModal] = useState(false)
	
	const { isLoading, deleteData: deleteDiscussion } = useDeleteData(`discussions/${discussionId}`, {
		onSuccess: (result) => {
			if (result === true) {
				navigate('/Discussions')
			}
		},
		onError: (err) => {},
	})

	const viewDiscussionPage = () => navigate(`/Discussions/${discussionId}`)



	return (
		<>
			<Modal isOpen={deleteModal}>
				<Modal.Header>
					<p className='text-lg font-medium'>You are about delete the discussion</p>
					<button
						onClick={() => {
							setDeleteModal(false)
						}}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<div className='flex items-center justify-end gap-2'>
						<Button variant='outline' onClick={() => setDeleteModal(false)}>
							Cancel
						</Button>
						<Button variant='danger' onClick={deleteDiscussion}>
							Delete Discussion
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<div className='flex flex-col gap-4'>
				{from === 'create' && (
					<div className='self-end'>
						<p className='text-system-primary-accent font-medium cursor-pointer' onClick={() => viewDiscussionPage()}>
							Skip for now
						</p>
					</div>
				)}

				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanInviteOthers' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanPostActivity' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanUploadPhoto' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanCreateAlbum' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanUploadVideo' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='IsAdmin' />

				{from === 'settings' && (
					<div className='border flex flex-col p-4 rounded-md justify-between'>
						<div className='flex flex-col md:flex-row gap-2 justify-between mb-6 md:mb-0 md:items-center'>
							<div>
								<h1 className='text-system-error font-medium text-lg'>Delete the discussion</h1>
								<p className='text-brand-gray mt-1 mb-2 text-base'>
									Deleting discussion will remove all the activity and data in the discussion.
								</p>
							</div>
							<div className='flex gap-4 items-start'>
								<Button variant='danger_outlined' size='md' onClick={() => setDeleteModal(true)}>
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

export default DiscussionSettings
