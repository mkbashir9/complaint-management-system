import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function NotFound() {
  const { isAuthenticated, isAdmin } = useAuth()
  const homeLink = isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-8xl font-black text-slate-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to={homeLink} className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors">Go home</Link>
      </div>
    </div>
  )
}
