import React from 'react'
import AdminTag from '../../components/Superadmin/AdminTag'

const AdminTags = () => {
	return (
		<div className='flex-1 p-4 lg:px-6 lg:py-6 overflow-y-auto bg-system-secondary-bg'>
			<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
				<div className='lg:col-span-4'>
					<AdminTag />
				</div>
			</div>
		</div>
	)
}

export default AdminTags
