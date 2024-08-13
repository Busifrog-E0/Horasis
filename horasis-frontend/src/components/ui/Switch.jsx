import { forwardRef } from 'react'

const Switch = forwardRef((props, forwardRef) => (
	<label className='cursor-pointer'>
		<input type='checkbox' className='hidden' ref={forwardRef} {...props} />
		<div className={`w-10 p-1 rounded-full ${props.checked ? 'bg-system-primary-accent-light' : 'bg-system-primary-bg'}`}>
			<div
				className={`w-fit p-0.5 shadow-sm rounded-full transition-all duration-300 text-system-secondary-bg ${
					props.checked ? 'bg-system-primary-accent translate-x-3' : 'bg-system-secondary-text -rotate-180'
				}`}>
				{props.checked ? (
					<>
						<div className='h-4 w-4 '></div>
					</>
				) : (
					<>
						<div className='h-4 w-4'></div>
					</>
				)}
			</div>
		</div>
	</label>
))

export default Switch
