import { twMerge } from 'tailwind-merge'
import { inputVariants } from '../../utils/app/FormElements'
import { useEffect, useRef } from 'react'

const TextArea = ({
	variant,
	size,
	width,
	withIcon,
	className,
	inputlabel,
	name,
	value,
	placeholder,
	setValue,
	extra,
	icon,
	iconpos,
	error,
	required,
	rows,
	resizable=true,
	...props
}) => {
	const textareaRef = useRef()
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto' // Reset height to auto to shrink if needed
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Set height based on scroll height
		}
	}, [value])
	return (
		<div className={`flex flex-col my-1 ${width === 'full' ? 'w-[100%]' : 'w-max'}`}>
			<div className='flex flex-row items-start justify-between flex-wrap'>
				{inputlabel && (
					<label htmlFor={name} className='font-medium text-sm text-system-primary-text'>
						{inputlabel} {required && '*'}
					</label>
				)}
				{extra && <div className='hidden lg:block lg:m-0 text-sm'>{extra}</div>}
			</div>
			{icon ? (
				<div
					className={`flex ${
						iconpos === 'right' ? 'flex-row-reverse pl-4 pr-4' : ' pl-2 '
					} items-center bg-system-secondary-bg ${
						width === 'full' ? 'w-[100%]' : 'w-max'
					} focus-within:border focus-within:border-system-primary-accent focus-within:bg-system-secondary-bg rounded-lg gap-x-2 border border-system-file-border`}>
					<textarea
						rows={rows}
						onChange={(e) => setValue(e.target.value, e)}
						name={name}
						value={value}
						placeholder={placeholder}
						className={
							twMerge(inputVariants({ variant, size, width, withIcon, className })) +
							`focus:bg-system-secondary-bg outline-none ${!resizable && 'resize-none'}`
						}
						required={required}
						ref={textareaRef}
						{...props}
					/>
				</div>
			) : (
				<textarea
					rows={rows}
					onChange={(e) => setValue(e.target.value, e)}
					name={name}
					value={value}
					placeholder={placeholder}
					ref={textareaRef}
					className={
						twMerge(inputVariants({ variant, size, width, withIcon, className })) +
						` hover:shadow-inner focus:bg-system-secondary-bg focus:border focus:border-system-primary-accent ${
							!resizable && 'resize-none'
						}`
					}
					required={required}
					{...props}
				/>
			)}
			{extra && <div className='mt-2 lg:hidden'>{extra}</div>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	)
}

export default TextArea
