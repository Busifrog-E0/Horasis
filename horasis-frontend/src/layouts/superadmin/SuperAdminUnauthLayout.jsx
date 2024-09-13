import { Navigate, Outlet } from 'react-router-dom'
import { useSuperAuth } from '../../context/SuperAdmin/SuperAuthService'

const SuperAdminUnauthLayout = () => {
	const { currentUserData } = useSuperAuth()
	return currentUserData && currentUserData.CurrentUser ? <Navigate to='/SuperAdmin' /> : <Outlet />
}

export default SuperAdminUnauthLayout
