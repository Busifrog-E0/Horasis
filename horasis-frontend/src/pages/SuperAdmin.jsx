import SuperAdminHeader from '../components/Superadmin/SuperAdminHeader'

const SuperAdmin = () => {
	return (
		<div className='h-[100svh] w-full flex items-center justify-center bg-system-primary-bg'>
			<div className='max-w-[1400px] w-full h-full bg-system-secondary-bg flex flex-col'>
				<SuperAdminHeader />
				<div className='flex w-full h-full'>
					<div className='w-[240px] h-full'>
						<Sidebar />
					</div>
					<div className='flex-1 bg-orange-400'></div>
				</div>
			</div>
		</div>
	)
}

const tabs = ['Non-Admin Users', 'Admin Users']

const Sidebar = () => {
	return (
		<div className='flex flex-col items-start p-2 gap-2'>
			{tabs.map((item) => {
				return (
					<div key={item} className='px-4 py-2 bg-system-primary-transparent w-full rounded-md cursor-pointer'>
						<p className='text-system-primary-accent'>{item}</p>
					</div>
				)
			})}
		</div>
	)
}

export default SuperAdmin
