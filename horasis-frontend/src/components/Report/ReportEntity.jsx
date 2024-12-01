import { useState } from 'react'
import report from '../../assets/icons/report.svg'
import close from '../../assets/icons/close.svg'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import useEntityReportManager from '../../hooks/useEntityReportManager'

const ReportEntity = ({ renderComponent, EntityId, Type }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openReasonsModal = () => setIsModalOpen(true)
	const closeReasonModal = () => setIsModalOpen(false)

	const { isReporting, reportData, handleChange, reportEntity } = useEntityReportManager({
		EntityId: EntityId,
		Type: Type,
		successCallback: () => {
			console.log('Reported', Type, EntityId)
			closeReasonModal()
		},
		errorCallback: () => {},
	})
	return (
		<>
			<Modal isOpen={isModalOpen} maxWidth='max-w-xl' className='rounded-lg shadow-lg bg-system-primary-bg'>
				<Modal.Header className='flex items-center justify-between p-6'>
					<p className='text-xl font-semibold text-system-primary-text'>Report Content</p>
					<button
						onClick={closeReasonModal}
						aria-label='Close modal'
						className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
						<img src={close} className='h-5 w-5' alt='Close' />
					</button>
				</Modal.Header>
				<Modal.Body className='p-6'>
					<div className='flex flex-col space-y-4'>
						<p className='text-sm text-system-secondary-text leading-relaxed'>
							We rely on our community to help us maintain a safe and welcoming environment. Please report any content
							that violates our guidelines.
						</p>
						<p className='text-base font-medium text-system-primary-text'>Report this content for:</p>
						<div className='space-y-3'>
							{[
								{ id: 'scam', label: 'Scam or Fraudulent Activity' },
								{ id: 'misleading', label: 'Misleading Information' },
								{ id: 'inappropriate', label: 'Inappropriate Content' },
								{ id: 'suspicious', label: 'Suspicious Content' },
							].map((option) => (
								<div key={option.id} className='flex items-center'>
									<input
										type='radio'
										id={option.id}
										name='issueType'
										value={option.label}
										checked={reportData.ReportType === option.id}
										onChange={() => handleChange('ReportType', option.id)}
										className='h-4 w-4 accent-system-primary-accent focus:ring focus:ring-system-primary-accent/50'
									/>
									<label
										htmlFor={option.id}
										className='ml-3 text-sm font-medium text-system-primary-text cursor-pointer hover:text-system-primary-accent transition-colors'
										onClick={() => handleChange('ReportType', option.id)}>
										{option.label}
									</label>
								</div>
							))}
						</div>
						<div className='mt-6'>
							<label htmlFor='additionalDetails' className='block text-sm font-medium text-system-primary-text'>
								Additional Details
							</label>
							<textarea
								id='additionalDetails'
								name='additionalDetails'
								value={reportData.Content}
								onChange={(e) => handleChange('Content', e.target.value)}
								rows='4'
								className='w-full mt-2 p-3 border border-gray-300 rounded-lg text-system-primary-text focus:outline-none focus:ring-2 focus:ring-system-primary-accent/50 focus:border-system-primary-accent text-md'
								placeholder='Provide more information about your report...'></textarea>
						</div>
						<div className='flex justify-end mt-4'>
							<Button
								disabled={isReporting || reportData.ReportType === '' || reportData.Content === ''}
								size='md'
								variant='black'
								className='bg-system-primary-accent text-system-primary-bg px-5 py-2 rounded-lg hover:bg-system-primary-accent-dark focus:ring-2 focus:ring-offset-2 focus:ring-system-primary-accent-dark transition-all'
								onClick={reportEntity}>
								{isReporting ? 'Reporting...' : 'Report'}
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
			{renderComponent ? (
				renderComponent(openReasonsModal)
			) : (
				<>
					<span
						onClick={openReasonsModal}
						className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
						role='menuitem'>
						<img src={report} alt='' className='h-6' />
						Report Content
					</span>
				</>
			)}
		</>
	)
}

export default ReportEntity
