import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'

const AuthLayout = () => {
	const { currentUserData } = useAuth()
	return !currentUserData ? <Navigate to='home' /> : <Outlet />
}

export default AuthLayout
