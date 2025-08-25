import AdminContentReport from '../../components/Superadmin/AdminContentReport'

const AdminContentReports = () => {
	return (
		<div className='flex-1 p-4  overflow-y-auto bg-system-secondary-bg'>
			<div className='grid lg:grid-cols-4 '>
				<div className='lg:col-span-4'>
					<AdminContentReport />
				</div>
			</div>
		</div>
	)
}

export default AdminContentReports
