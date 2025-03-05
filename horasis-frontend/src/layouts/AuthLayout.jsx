import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'

const AuthLayout = () => {
	const { currentUserData } = useAuth()
	return !currentUserData ? <Navigate to='login' /> : <Outlet />
}

export default AuthLayout
