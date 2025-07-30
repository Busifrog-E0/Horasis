import { Navigate, Outlet } from 'react-router-dom'
import { useSuperAuth } from '../../context/SuperAdmin/SuperAuthService'

const SuperAdminAuthLayout = () => {
	const { currentUserData } = useSuperAuth()
	return !currentUserData ? <Navigate to='/SuperAdmin/Login' /> : <Outlet />
}

export default SuperAdminAuthLayout
