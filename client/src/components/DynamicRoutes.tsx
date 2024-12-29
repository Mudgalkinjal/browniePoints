import { Navigate } from 'react-router-dom'

const DynamicRoute = () => {
  const token = localStorage.getItem('authToken')

  return token ? <Navigate to="/app" /> : <Navigate to="/homepage" />
}

export default DynamicRoute
