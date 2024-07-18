import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReportPostButton from './ReportPost/ReportPostButton'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useToast } from '../Toast/ToastService'

const ActivityDropdown = ({ activity }) => {
	const [isOpen, setIsOpen] = useState(false)
	const toast = useToast()
	const dropdownRef = useRef(null)
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

	return (
		<div className='relative inline-block text-left' ref={dropdownRef}>
			<button
				type='button'
				className='inline-flex justify-center w-full rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
				onClick={() => setIsOpen(!isOpen)}>
				•••
			</button>
			{isOpen && (
				<div className='origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5'>
					<div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
						<span
							className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
							role='menuitem'>
							Save
						</span>
						<span
							className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
							role='menuitem'>
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

						<ReportPostButton />
					</div>
				</div>
			)}
		</div>
	)
}

export default ActivityDropdown
