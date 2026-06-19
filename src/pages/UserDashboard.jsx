import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useComplaints } from '../hooks/useComplaints'
import { Navbar } from '../components/ui/Navbar'
import { StatCard } from '../components/complaints/StatCard'
import { ComplaintRow } from '../components/complaints/ComplaintRow'
import { ComplaintForm } from '../components/complaints/ComplaintForm'
import { ComplaintDetail } from '../components/complaints/ComplaintDetail'
import { Toast } from '../components/ui/Toast'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { Plus, Inbox, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export function UserDashboard() {
  const { profile } = useAuth()
  const { complaints, loading, error, stats, createComplaint } = useComplaints()
  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')

  const filters = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected']
  const filtered = statusFilter === 'All' ? complaints : complaints.filter(c => c.status === statusFilter)

  async function handleCreate(data) {
    await createComplaint(data)
    setToast({ message: 'Complaint submitted successfully.', type: 'success' })
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hello, {firstName} 👋</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track and manage your submitted complaints</p>
          </div>
          <button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors shrink-0">
            <Plus className="w-4 h-4" />File a complaint
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={stats.total} icon={FileText} color="slate" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
          <StatCard label="In Progress" value={stats.inProgress} icon={AlertCircle} color="blue" />
          <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">My Complaints</h2>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {filters.map(f => (
                <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === f ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Spinner /></div>
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-red-600 text-sm gap-2"><XCircle className="w-5 h-5" />{error}</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={statusFilter === 'All' ? 'No complaints yet' : `No ${statusFilter.toLowerCase()} complaints`}
              description={statusFilter === 'All' ? 'File your first complaint using the button above.' : 'Try selecting a different filter.'}
              action={statusFilter === 'All' && (
                <button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
                  <Plus className="w-4 h-4" />File a complaint
                </button>
              )}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Complaint</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Filed</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(complaint => (
                    <ComplaintRow key={complaint.id} complaint={complaint} onClick={() => setSelected(complaint)} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ComplaintForm isOpen={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />
      <ComplaintDetail isOpen={!!selected} complaint={selected} onClose={() => setSelected(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
