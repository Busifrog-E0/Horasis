import { twMerge } from 'tailwind-merge'
import { inputVariants } from '../../utils/app/FormElements'
import { useState, useEffect, useRef } from 'react'

const Select = ({
	variant,
	size,
	width,
	withIcon,
	className,
	inputlabel,
	name,
	value,
	type,
	placeholder,
	icon,
	setValue,
	extra,
	iconpos,
	error,
	required,
	iconClick,
	options,
	isSearchable = false,
	...props
}) => {
	const [selected, setSelected] = useState(value)
	const [showOptions, setShowOptions] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const dropdownRef = useRef(null)

	// Filter options based on search term
	const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))

	// Handle keyboard input to search
	const handleKeyDown = (e) => {
		if (isSearchable === true) {
			if (e.key.length === 1) {
				// Add key to searchTerm if it's a regular character
				setSearchTerm((prev) => prev + e.key)
			} else if (e.key === 'Backspace') {
				// Handle backspace to remove the last character
				setSearchTerm((prev) => prev.slice(0, -1))
			}
		}
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowOptions(false)
				setSearchTerm('')
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div
			className={`flex flex-col my-1 ${
				width === 'full' ? 'w-[100%]' : 'w-max'
			} outline-none border-none focus:outline-none`}>
			<div className='flex flex-row items-start justify-between flex-wrap'>
				{inputlabel && (
					<label htmlFor={name} className='font-medium text-sm text-system-primary-text'>
						{inputlabel} {required && '*'}
					</label>
				)}
				{extra && <div className='hidden lg:block lg:m-0 text-sm'>{extra}</div>}
			</div>

			<div className='relative' onKeyDown={handleKeyDown} tabIndex={0} ref={dropdownRef}>
				<div
					onClick={() => setShowOptions((prev) => !prev)}
					className={
						twMerge(inputVariants({ variant, size, width, withIcon, className })) +
						' hover:shadow-inner focus:bg-system-secondary-bg focus:border-2 focus:border-system-primary-accent cursor-pointer'
					}>
					{value === '' && placeholder ? (
						<>
							<p className='w-full text-system-secondary-text text-base'>{placeholder}</p>
						</>
					) : (
						<>
							<p className='w-full text-base'>{searchTerm ? searchTerm : value}</p>
						</>
					)}
					{showOptions ? (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							height='24px'
							viewBox='0 -960 960 960'
							width='24px'
							fill='var(--system-primary-accent)'>
							<path d='M480-554 283-357l-43-43 240-240 240 240-43 43-197-197Z' />
						</svg>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							height='24px'
							viewBox='0 -960 960 960'
							width='24px'
							fill='var(--system-primary-accent)'>
							<path d='M480-344 240-584l43-43 197 197 197-197 43 43-240 240Z' />
						</svg>
					)}
				</div>

				{showOptions && (
					<div
						className={
							'border-2 border-system-primary-bg rounded-lg text-base w-full z-50 bg-white flex flex-col max-h-40 overflow-auto absolute left-0 top-12 mb-10'
						}>
						{/* Display filtered options */}
						{filteredOptions.length > 0 ? (
							filteredOptions.map((item) => {
								return (
									<p
										key={item}
										className='px-5 py-2 hover:bg-system-primary-bg rounded-md cursor-pointer w-full select-none'
										onClick={() => {
											setShowOptions(false)
											setValue(item)
											setSearchTerm('') // Clear search after selection
										}}>
										{item}
									</p>
								)
							})
						) : (
							<p className='px-5 py-2 text-system-secondary-text'>No options found</p>
						)}
					</div>
				)}
			</div>

			{extra && <div className='mt-2 lg:hidden'>{extra}</div>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	)
}

export default Select
