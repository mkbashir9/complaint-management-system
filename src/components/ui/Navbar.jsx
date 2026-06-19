import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, ShieldCheck, LogOut, User, Menu, X, Bell } from 'lucide-react'

export function Navbar() {
  const { profile, signOut, isAdmin } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const navLinks = isAdmin
    ? [
        { to: '/dashboard', label: 'My Complaints', icon: LayoutDashboard },
        { to: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
      ]
    : [
        { to: '/dashboard', label: 'My Complaints', icon: LayoutDashboard },
      ]

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } catch (e) {
      console.error(e)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 hidden sm:block">
              ComplaintDesk
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to

              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-indigo-600" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-800 leading-none">
                  {profile?.full_name}
                </p>
                <p className="text-xs text-slate-500 leading-none mt-0.5 capitalize">
                  {profile?.role}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-1 bg-white">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-800">
                {profile?.full_name}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {profile?.role}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}