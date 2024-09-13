import { twMerge } from 'tailwind-merge'
import { inputVariants } from '../../utils/app/FormElements'
import { useState } from 'react'

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
	...props
}) => {
	const [selected, setSelected] = useState(value)
	const [showOptions, setShowOptions] = useState(false)
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

			{/* <select
				onChange={(e) => setValue(e.target.value, e)}
				type={type}
				name={name}
				value={value}
				placeholder={placeholder}
				className={
					twMerge(inputVariants({ variant, size, width, withIcon, className })) +
					' hover:shadow-inner focus:bg-system-secondary-bg focus:border-2 focus:border-system-primary-accent'
				}
				required={required}
				{...props}></select> */}
			<div className='relative'>
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
							<p className='w-full text-base'>{value}</p>
						</>
					)}
					{showOptions ? (
						<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='var(--system-primary-accent)'>
							<path d='M480-554 283-357l-43-43 240-240 240 240-43 43-197-197Z' />
						</svg>
					) : (
						<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='var(--system-primary-accent)'>
							<path d='M480-344 240-584l43-43 197 197 197-197 43 43-240 240Z' />
						</svg>
					)}
				</div>

				{showOptions && (
					<div
						className={
							'border-2 border-system-primary-bg rounded-lg text-base w-full z-50 bg-white flex flex-col max-h-40 overflow-auto absolute left-0 top-12 mb-10'
						}>
						{options.map((item) => {
							return (
								<p
									key={item}
									className='px-5 py-2 hover:bg-system-primary-bg rounded-md cursor-pointer w-full select-none'
									onClick={() => {
										setShowOptions(false)
										setValue(item)
									}}>
									{item}
								</p>
							)
						})}
					</div>
				)}
			</div>

			{extra && <div className='mt-2 lg:hidden'>{extra}</div>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	)
}

export default Select
