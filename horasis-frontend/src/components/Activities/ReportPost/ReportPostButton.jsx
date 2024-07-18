import { useState } from 'react'
import Modal from '../../ui/Modal'
import Input from '../../ui/Input'
import Button from '../../ui/Button'

const ReportPostButton = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [issueType, setIssueType] = useState('')

	const openReasonsModal = () => {
		setIsModalOpen(true)
	}

	const closeReasonModal = () => setIsModalOpen(false)

	return (
		<>
			<span
				onClick={openReasonsModal}
				className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
				role='menuitem'>
				Report Post
			</span>
			<Modal isOpen={isModalOpen} maxWidth={`max-w-xl`}>
				<Modal.Header>
					<p className='text-lg font-medium'>Report Post</p>
					<button
						onClick={() => {
							setIsModalOpen(false)
						}}>
						close
					</button>
				</Modal.Header>
				<Modal.Body>
					<div className='flex flex-col gap-4 px-10'>
						<p className='text-system-secondary-text'>
							We rely on our community to help us maintain a safe and welcoming environment. Please report any posts
							that violate our guidelines.
						</p>
						<p>Report this post for :</p>
						<div className='mb-4'>
							<div className='flex flex-col gap-2'>
								<div>
									<input
										type='radio'
										id='scam'
										name='issueType'
										value='Scam or Fradulent Activity'
										checked={issueType === 'Scam or Fradulent Activity'}
										onChange={() => setIssueType('Scam or Fradulent Activity')}
										className='mr-2 cursor-pointer'
									/>
									<span
										className='cursor-pointer text-md text-system-primary-text'
										onClick={() => setIssueType('Scam or Fradulent Activity')}>
										Scam or Fradulent Activity
									</span>
								</div>

								<div>
									<input
										type='radio'
										id='misleading'
										name='issueType'
										value='Misleading Information'
										checked={issueType === 'Misleading Information'}
										onChange={() => setIssueType('Misleading Information')}
										className='mr-2 cursor-pointer'
									/>
									<span
										className='cursor-pointer text-md text-system-primary-text'
										onClick={() => setIssueType('Misleading Information')}>
										Misleading Information
									</span>
								</div>
								<div>
									<input
										type='radio'
										id='inappropriate'
										name='issueType'
										value='Inappropriate Content'
										checked={issueType === 'Inappropriate Content'}
										onChange={() => setIssueType('Inappropriate Content')}
										className='mr-2 cursor-pointer'
									/>
									<span
										className='cursor-pointer text-md text-system-primary-text'
										onClick={() => setIssueType('Inappropriate Content')}>
										Inappropriate Content
									</span>
								</div>
								<div>
									<input
										type='radio'
										id='supsicious'
										name='issueType'
										value='Suspicious Content'
										checked={issueType === 'Suspicious Content'}
										onChange={() => setIssueType('Suspicious Content')}
										className='mr-2 cursor-pointer'
									/>
									<span
										className='cursor-pointer text-md text-system-primary-text'
										onClick={() => setIssueType('Suspicious Content')}>
										Suspicious Content
									</span>
								</div>
							</div>
						</div>
						<div className='flex items-end justify-end'>
							<Button size='md' variant='black' className='' onClick={closeReasonModal}>
								Report Post
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default ReportPostButton
