// rrd
import { Outlet } from 'react-router-dom'

// components
import ChatPopup from '../components/Chat/ChatPopup'
import DashboardBottomNavbar from '../components/DashboardBottomNavbar'
import DashboardHeader from '../components/DashboardHeader'
import { useChatPopup } from '../context/ChatPopup/ChatPopupService'
import { useAuth } from '../utils/AuthProvider'

function DashboardLayout() {
	const { scrollRef } = useAuth()
	const { userIds } = useChatPopup()
	return (
		<div className='flex flex-col overflow-hidden w-full items-center' style={{ height: '100svh' }}>
			<DashboardHeader />
			<div className='h-full overflow-y-auto  overflow-x-hidden w-full max-w-screen-2xl '>
				<div ref={scrollRef}></div>
				<Outlet />
			</div>

			{userIds.length > 0 && <ChatPopup />}
			<DashboardBottomNavbar />
		</div>
	)
}
export default DashboardLayout
