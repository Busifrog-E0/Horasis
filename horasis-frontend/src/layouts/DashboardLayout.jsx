// rrd
import { Outlet } from 'react-router-dom'

// components
import DashboardHeader from '../components/DashboardHeader'
import DashboardBottomNavbar from '../components/DashboardBottomNavbar'
import { useContext, useState } from 'react'
import { AuthContext } from '../utils/AuthProvider'
import ChatPopup from '../components/Chat/ChatPopup'
import { useChatPopup } from '../context/ChatPopup/ChatPopupService'

function DashboardLayout() {
	const { scrollRef } = useContext(AuthContext)
	const { userIds } = useChatPopup()
	return (
		<div className='flex flex-col overflow-hidden w-full items-center' style={{ height: '100svh' }}>
			<DashboardHeader />
			<div className='h-full overflow-y-auto no-scrollbar overflow-x-hidden w-full max-w-screen-2xl '>
				<div ref={scrollRef}></div>
				<Outlet />
			</div>

			{userIds.length > 0 && <ChatPopup />}
			<DashboardBottomNavbar />
		</div>
	)
}
export default DashboardLayout
