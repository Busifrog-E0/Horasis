import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useToast } from '../Toast/ToastService'
import Spinner from '../ui/Spinner'

const ActivityDropdown = ({ activity, onSaveClicked, onRemoveClicked, isSaving }) => {
	const [isOpen, setIsOpen] = useState(false)
	const toast = useToast()
	const dropdownRef = useRef(null)
	const buttonRef = useRef(null)
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
	const [issueType, setIssueType] = useState('')

	const openReasonsModal = () => {
		setIsModalOpen(true)
	}

	const closeReasonModal = () => setIsModalOpen(false)

	return (
		<>
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
					<div className='flex flex-col gap-4'>
						<p className='text-system-secondary-text'>
							We rely on our community to help us maintain a safe and welcoming environment. Please report any posts
							that violate our guidelines.
						</p>
						<p className='text'>Report this post for :</p>
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
							{
								isSaving ? <Spinner />
									:
									activity.HasSaved ?
										<span onClick={onRemoveClicked}
											className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
											role='menuitem'>
											Remove
										</span>
										:
										<span onClick={onSaveClicked}
											className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
											role='menuitem'>
											Save
										</span>
							}

							<span
								className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
								role='menuitem'
								onClick={() => {
									navigate(`/ViewProfile/${activity.UserId}`)
								}}>
								View this profile
							</span>
							<span
								className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
								role='menuitem'
								onClick={handleCopyPost}>
								Copy the post
							</span>
							<span
								className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
								role='menuitem'
								onClick={() => navigate(`/Activities/${activity.DocId}`)}>
								View the post
							</span>
							<span
								onClick={openReasonsModal}
								className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
								role='menuitem'>
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
