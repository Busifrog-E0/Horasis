import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useToast } from '../Toast/ToastService'
import Spinner from '../ui/Spinner'
import close from '../../assets/icons/close.svg'
import graysave from '../../assets/icons/graysave.svg'
import graysavefill from '../../assets/icons/graysavefill.svg'
import person from '../../assets/icons/person.svg'
import viewpost from '../../assets/icons/viewpost.svg'
import copy from '../../assets/icons/copy.svg'
import report from '../../assets/icons/report.svg'
import ReportEntity from '../Report/ReportEntity'
import useEntityReportManager from '../../hooks/useEntityReportManager'

const ActivityDropdown = ({ activity, onSaveClicked, onRemoveClicked, isSaving }) => {
	const [isOpen, setIsOpen] = useState(false)
	const toast = useToast()
	const dropdownRef = useRef(null)
	const buttonRef = useRef(null)
	const modalRef = useRef(null)
	const navigate = useNavigate()

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		if (isOpen) {
			const dropdown = dropdownRef.current
			const button = buttonRef.current
			const rect = dropdown.getBoundingClientRect()
			const buttonRect = button.getBoundingClientRect()

			// Adjust position if dropdown is out of viewport
			if (rect.right > window.innerWidth) {
				dropdown.style.right = 'auto'
				dropdown.style.left = '0'
			} else {
				dropdown.style.left = 'auto'
				dropdown.style.right = '0'
			}

			if (rect.bottom > window.innerHeight) {
				dropdown.style.top = 'auto'
				dropdown.style.bottom = `${buttonRect.height}px`
			} else {
				dropdown.style.bottom = 'auto'
				dropdown.style.top = `${buttonRect.height}px`
			}
		}
	}, [isOpen])

	const handleCopyPost = () => {
		const { protocol, hostname } = window.location
		let baseUrl = `${protocol}//${hostname}`
		if (hostname === 'localhost') {
			baseUrl = baseUrl + ':5173'
		}
		const copyLink = `${baseUrl}/Activities/${activity.DocId}`
		navigator.clipboard
			.writeText(copyLink)
			.then(() => {
				toast.open('success', 'Copied', 'Post link has been copied!')
			})
			.catch((err) => {
				toast.open('error', 'Failed', 'Post link not copied')
			})
	}

	const [isModalOpen, setIsModalOpen] = useState(false)

	const { isReporting, reportData, handleChange, reportEntity, resetState } = useEntityReportManager({
		EntityId: activity.DocId,
		Type: 'Activity',
		successCallback: () => closeReasonModal(),
		errorCallback: () => {},
	})
	const openReasonsModal = () => setIsModalOpen(true)
	const closeReasonModal = () => {
		resetState()
		setIsModalOpen(false)
	}

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
			<div className='relative inline-block text-left' ref={buttonRef}>
				<button
					type='button'
					className='inline-flex justify-center w-full rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
					onClick={() => {
						setIsOpen((prev) => !prev)
					}}>
					•••
				</button>
				{isOpen && (
					<div
						className='origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5'
						ref={dropdownRef}>
						<div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
							{isSaving ? (
								<Spinner />
							) : activity.HasSaved ? (
								<span
									onClick={onRemoveClicked}
									className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
									role='menuitem'>
									<img src={graysavefill} alt='' className='h-6' />
									Remove from collection
								</span>
							) : (
								<span
									onClick={onSaveClicked}
									className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
									role='menuitem'>
									<img src={graysave} alt='' className='h-6' />
									Save to collection
								</span>
							)}

							<span
								className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
								role='menuitem'
								onClick={() => {
									navigate(`/ViewProfile/${activity.UserId}`)
								}}>
								<img src={person} alt='' className='h-6' />
								View this profile
							</span>
							<span
								className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
								role='menuitem'
								onClick={handleCopyPost}>
								<img src={copy} alt='' className='h-6' />
								Copy the post
							</span>
							<span
								className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
								role='menuitem'
								onClick={() => navigate(`/Activities/${activity.DocId}`)}>
								<img src={viewpost} alt='' className='h-6' />
								View the post
							</span>

							<span
								onClick={openReasonsModal}
								className='cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
								role='menuitem'>
								<img src={report} alt='' className='h-6' />
								Report Post
							</span>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default ActivityDropdown
