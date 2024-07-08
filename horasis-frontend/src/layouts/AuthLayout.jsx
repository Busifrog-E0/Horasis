import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../utils/AuthProvider"

const AuthLayout = () => {
  const { currentUserData } = useContext(AuthContext)
  return !currentUserData ? <Navigate to="login" /> : <Outlet />
}

export default AuthLayout
