import React, { useState, useRef, useEffect } from 'react'

const DropdownMenu = () => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null)

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
							Option 1
						</span>
						<span
							className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
							role='menuitem'>
							Option 2
						</span>
						<span
							className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
							role='menuitem'>
							Option 3
						</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default DropdownMenu
