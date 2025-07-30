import { useState } from 'react'
import Logo from '../../components/Common/Logo'
import { useSuperAuth } from '../../context/SuperAdmin/SuperAuthService'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const SuperAdminHeader = () => {
	const { logout } = useSuperAuth()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openLogoutModal = () => setIsModalOpen(true)

	const closeLogoutModal = () => setIsModalOpen(false)

	return (
		<>
			<Modal isOpen={isModalOpen}>
				<Modal.Header>
					<p className='text-lg font-medium'>Logout Super Admin?</p>
					<button onClick={closeLogoutModal}>{/* <img src={close} className='h-6  cursor-pointer' alt='' /> */}</button>
				</Modal.Header>
				<Modal.Body padding={0}>
					<div className='flex items-end justify-end gap-4 px-4'>
						<Button variant='outline' className='px-8 py-3' onClick={closeLogoutModal}>
							Cancel
						</Button>
						<Button variant='black' className='px-8  py-3' onClick={logout}>
							Logout
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<div className='bg-system-secondary-bg py-2 md:py-3 px-1 lg:px-10  border-b border-system-file-border'>
				<div className='flex flex-row justify-between items-center'>
					<div className='text-4xl font-bold text-brand-violet scale-75 md:scale-90'>
						<Logo />
					</div>
					<div className='flex flex-row flex-wrap items-center gap-4 md:gap-4'>
						<button type='button' className='inline-flex justify-center rounded-full border-2 border-system-error bg-system-secondary-bg text-md px-6 py-1 font-medium text-brand-red' onClick={openLogoutModal}>
							Logout
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default SuperAdminHeader
