import React from 'react'
import AdminTagsManage from '../components/Tags/AdminTagsManage'

const Tags = () => {
	return (
		<div className='flex-1 p-4 lg:px-6 lg:py-6 overflow-y-auto bg-system-secondary-bg  lg:col-span-3 rounded-md'>
			<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
				<div className='lg:col-span-4'>
					<AdminTagsManage />
				</div>
			</div>
		</div>
	)
}

export default Tags
