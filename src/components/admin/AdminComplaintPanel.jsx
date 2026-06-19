import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { PriorityBadge } from '../ui/Badges'
import { Spinner } from '../ui/Spinner'
import { STATUSES, CATEGORY_ICONS, STATUS_CONFIG } from '../../lib/constants'
import { Paperclip, User, Calendar } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function AdminComplaintPanel({ complaint, isOpen, onClose, onUpdate }) {
  const [status, setStatus] = useState(complaint?.status || 'Pending')
  const [remark, setRemark] = useState(complaint?.resolution_remark || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!complaint) return null

  async function handleSave() {
    if (!status) { setError('Please select a status.'); return }
    setLoading(true)
    setError('')
    try {
      await onUpdate(complaint.id, { status, resolution_remark: remark })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update complaint.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Complaint" maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{CATEGORY_ICONS[complaint.category]}</span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{complaint.category}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{complaint.title}</h3>
          </div>
          <PriorityBadge priority={complaint.priority} />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-3">{complaint.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Submitted by</p>
            <div className="flex items-center gap-1.5 text-slate-700"><User className="w-3.5 h-3.5 text-slate-400" />{complaint.profiles?.full_name || 'Unknown'}</div>
            <p className="text-xs text-slate-400 mt-0.5 ml-5">{complaint.profiles?.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Filed on</p>
            <div className="flex items-center gap-1.5 text-slate-700"><Calendar className="w-3.5 h-3.5 text-slate-400" />{formatDate(complaint.created_at)}</div>
          </div>
        </div>

        {complaint.attachment_url && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Attachment</p>
            <a href={complaint.attachment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-sm">
              <Paperclip className="w-4 h-4 text-slate-500" />{complaint.attachment_name || 'View attachment'}
            </a>
          </div>
        )}

        <div className="border-t border-slate-100" />

        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-900">Update Status</p>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map(s => {
              const config = STATUS_CONFIG[s]
              const selected = status === s
              return (
                <button key={s} type="button" onClick={() => setStatus(s)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${selected ? `${config.bg} ${config.text} ${config.border} ring-2 ring-offset-1 ring-current` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <span className={`w-2 h-2 rounded-full ${selected ? config.dot : 'bg-slate-300'}`} />{s}
                </button>
              )
            })}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Resolution remark <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={3} placeholder="Explain what action was taken…" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none" />
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">Cancel</button>
          <button type="button" onClick={handleSave} disabled={loading} className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            {loading ? <><Spinner size="sm" />Saving…</> : 'Save changes'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
