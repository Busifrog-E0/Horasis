import Logo from '../../components/Common/Logo'

const SuperAdminHeader = () => {
	return (
		<>
			<div className='bg-system-secondary-bg py-2 md:py-3 px-1 lg:px-10  border-b border-system-file-border'>
				<div className='flex flex-row justify-between items-center'>
					<div className='text-4xl font-bold text-brand-violet scale-75 md:scale-90'>
						<Logo />
					</div>
				</div>
			</div>
		</>
	)
}

export default SuperAdminHeader
