import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function PrivateRoute() {
  const { user } = useSelector((state) => state.user)
  const { currentUser } = user
  return currentUser ? <Outlet /> : <Navigate to="sign-in" />
}
