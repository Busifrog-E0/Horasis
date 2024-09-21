import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../utils/AuthProvider"

const UnAuthLayout = () => {
  const { currentUserData } = useAuth()
  return currentUserData && currentUserData.CurrentUser ? <Navigate to="/" /> : <Outlet />
}

export default UnAuthLayout
