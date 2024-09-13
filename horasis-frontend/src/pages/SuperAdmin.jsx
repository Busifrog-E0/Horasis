import AdminUser from '../components/Superadmin/AdminUser'
import SuperAdminHeader from '../components/Superadmin/SuperAdminHeader'

const SuperAdmin = () => {
	return (
		<div className='h-[100svh] w-full flex items-center justify-center bg-system-primary-bg p-2 '>
			<div className='max-w-[1400px] w-full h-full bg-system-secondary-bg flex flex-col rounded-md overflow-hidden'>
				<SuperAdminHeader />
				<div className=' p-2 lg:px-6 lg:py-6 overflow-y-auto'>
					<div className='grid  lg:grid-cols-4 gap-3 lg:gap-12'>
						<div className='lg:col-span-4'>
							<div className='w-full'>
								<AdminUser />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SuperAdmin
