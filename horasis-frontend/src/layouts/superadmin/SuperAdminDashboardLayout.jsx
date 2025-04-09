import React, { useState } from 'react'
import SuperAdminHeader from '../../components/Superadmin/SuperAdminHeader'
import { Outlet } from 'react-router-dom'
import SuperadminSidebar from '../../components/Superadmin/SuperadminSidebar'
import menu from '../../assets/icons/menu_black.svg'

const SuperAdminDashboardLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}
	return (
		<div className='h-screen w-full flex items-center justify-center bg-system-primary-bg p-2'>
			<div className='max-w-[1600px] w-full h-full bg-system-secondary-bg flex flex-col rounded-md lg:overflow-hidden'>
				{/* Header */}
				<SuperAdminHeader />

				{/* Main Content with Sidebar */}
				<div className='flex flex-1 overflow-hidden relative'>
					{/* Sidebar */}
					<div
						className={`fixed inset-y-0 left-0 w-64 bg-system-secondary-bg text-system-primary-text transform ${
							isSidebarOpen ? 'translate-x-0 z-50 lg:z-20' : '-translate-x-full z-10'
						} transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64`}>
						<SuperadminSidebar toggleSidebar={toggleSidebar} />
					</div>

					{/* Main Content */}
					<div className='flex-1 flex flex-col overflow-x-hidden lg:overflow-auto'>
						{/* Mobile Menu Button */}
						<div className='lg:hidden p-4 bg-system-secondary-bg text-system-primary-text flex justify-end items-center'>
							<button onClick={toggleSidebar} className='text-lg font-semibold'>
								<img src={menu} className='h-8' />
							</button>
						</div>

						{/* Main Content Area */}
						<Outlet />
					</div>
				</div>

				{/* Overlay for mobile sidebar */}
				{isSidebarOpen && (
					<div className='fixed inset-0 bg-black opacity-50 lg:hidden z-40' onClick={toggleSidebar}></div>
				)}
			</div>
		</div>
	)
}

export default SuperAdminDashboardLayout
