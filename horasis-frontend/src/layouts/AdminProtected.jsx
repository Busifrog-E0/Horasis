import { Navigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'

const AdminProtected = ({children}) => {
	const { currentUserData } = useAuth()
	const isPermitted = currentUserData.CurrentUser.Role.includes('Admin')
	return isPermitted ? children : <Navigate to='/' />
}

export default AdminProtected
