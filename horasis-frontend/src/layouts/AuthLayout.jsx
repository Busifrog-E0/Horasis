import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../utils/AuthProvider'

const AuthLayout = () => {
	const { currentUserData } = useContext(AuthContext)
	return !currentUserData ? <Navigate to='home' /> : <Outlet />
}

export default AuthLayout
