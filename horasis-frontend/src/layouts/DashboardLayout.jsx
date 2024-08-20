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
  const {userIds} = useChatPopup()
	return (
		<div className='flex flex-col overflow-hidden' style={{ height: '100svh' }}>
			<DashboardHeader />
			<div className='h-full overflow-y-auto overflow-x-hidden mt-2'>
				<div ref={scrollRef}></div>
				<div className=''>
					<Outlet />
				</div>
			</div>
			{userIds.length>0 && <ChatPopup/>}
			<DashboardBottomNavbar />
		</div>
	)
}
export default DashboardLayout
