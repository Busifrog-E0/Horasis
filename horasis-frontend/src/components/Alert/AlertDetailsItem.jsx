import React from 'react'
import { relativeTime } from '../../utils/date'

const Alert = () => {
	return (
		<div className='p-3 px-5 border-b border-system-file-border'>
			<div className='flex items-start gap-2'>
				<img
					className='w-12 h-12 rounded-full'
					src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
					alt='Rounded avatar'
				/>

				<div className='flex-1'>
					<h4 className='font-semibold text-md text-system-primary-accent'>James Lim</h4>
					<h4 className='text-sm font-medium text-system-primary-text'>Lorem ipsum dolor sit amet.</h4>
				</div>
				<div>
					<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
				</div>
			</div>
		</div>
	)
}

export default Alert
