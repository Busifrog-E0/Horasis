import { Navigate, Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../utils/AuthProvider"

const UnAuthLayout = () => {
  const { currentUserData } = useContext(AuthContext)
  return currentUserData && currentUserData.CurrentUser ? <Navigate to="/" /> : <Outlet />
}

export default UnAuthLayout
