import { useState, useMemo } from 'react'
import { useComplaints } from '../hooks/useComplaints'
import { Navbar } from '../components/ui/Navbar'
import { StatCard } from '../components/complaints/StatCard'
import { StatusBadge, PriorityBadge } from '../components/ui/Badges'
import { AdminComplaintPanel } from '../components/admin/AdminComplaintPanel'
import { Toast } from '../components/ui/Toast'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { CATEGORY_ICONS, STATUSES, PRIORITIES, CATEGORIES } from '../lib/constants'
import { FileText, Clock, CheckCircle, XCircle, Search, Filter, AlertCircle, User, ChevronRight, Inbox, RefreshCw } from 'lucide-react'

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function AdminDashboard() {
  const { complaints, loading, error, stats, updateComplaintStatus, refetch } = useComplaints()
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [refreshing, setRefreshing] = useState(false)

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()) || c.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || c.profiles?.email?.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'All' || c.status === filterStatus
      const matchPriority = filterPriority === 'All' || c.priority === filterPriority
      const matchCategory = filterCategory === 'All' || c.category === filterCategory
      return matchSearch && matchStatus && matchPriority && matchCategory
    })
  }, [complaints, search, filterStatus, filterPriority, filterCategory])

  async function handleUpdate(complaintId, updates) {
    await updateComplaintStatus(complaintId, updates)
    setToast({ message: 'Complaint updated successfully.', type: 'success' })
    setSelected(null)
  }

  async function handleRefresh() {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Admin Dashboard
              <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Admin</span>
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and resolve incoming complaints</p>
          </div>
          <button onClick={handleRefresh} disabled={refreshing} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total" value={stats.total} icon={FileText} color="slate" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
          <StatCard label="In Progress" value={stats.inProgress} icon={AlertCircle} color="blue" />
          <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" />
          <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="red" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, description, or user…" className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="All">All statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="All">All priorities</option>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="All">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {(filterStatus !== 'All' || filterPriority !== 'All' || filterCategory !== 'All' || search) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-slate-500">Showing <strong className="text-slate-700">{filtered.length}</strong> of {complaints.length} complaints</span>
              <button onClick={() => { setFilterStatus('All'); setFilterPriority('All'); setFilterCategory('All'); setSearch('') }} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Clear filters</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Spinner /></div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-red-600 text-sm gap-2"><XCircle className="w-5 h-5" />{error}</div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Inbox} title="No complaints found" description="Try adjusting your search or filter criteria." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Complaint</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Filed</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(complaint => (
                    <tr key={complaint.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-2.5">
                          <span className="text-lg mt-0.5 shrink-0">{CATEGORY_ICONS[complaint.category]}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate max-w-xs">{complaint.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{complaint.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-slate-700">{complaint.profiles?.full_name}</p>
                            <p className="text-xs text-slate-400">{complaint.profiles?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">{complaint.category}</span>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={complaint.status} /></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell"><PriorityBadge priority={complaint.priority} /></td>
                      <td className="px-4 py-3.5 hidden xl:table-cell">
                        <p className="text-xs text-slate-500">{formatShortDate(complaint.created_at)}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button onClick={() => setSelected(complaint)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium transition-colors">
                          Review<ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-slate-400 text-center mt-4">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''} displayed</p>
        )}
      </main>

      {selected && <AdminComplaintPanel isOpen={!!selected} complaint={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
