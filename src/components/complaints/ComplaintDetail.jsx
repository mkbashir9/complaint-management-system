import { Modal } from '../ui/Modal'
import { StatusBadge, PriorityBadge } from '../ui/Badges'
import { CATEGORY_ICONS } from '../../lib/constants'
import { Calendar, Paperclip, User, Clock, CheckCircle2 } from 'lucide-react'

function Field({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function ComplaintDetail({ complaint, isOpen, onClose }) {
  if (!complaint) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complaint Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{CATEGORY_ICONS[complaint.category]}</span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{complaint.category}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{complaint.title}</h3>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>

        <Field label="Description">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Submitted by">
            <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" />{complaint.profiles?.full_name || 'Unknown'}</div>
          </Field>
          <Field label="Filed on">
            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />{formatDate(complaint.created_at)}</div>
          </Field>
          {complaint.resolved_at && (
            <Field label="Resolved on">
              <div className="flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" />{formatDate(complaint.resolved_at)}</div>
            </Field>
          )}
        </div>

        {complaint.attachment_url && (
          <Field label="Attachment">
            <a href={complaint.attachment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors">
              <Paperclip className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{complaint.attachment_name || 'View attachment'}</span>
            </a>
          </Field>
        )}

        {complaint.resolution_remark && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-700 mb-1 uppercase tracking-wide">Resolution Remark</p>
            <p className="text-sm text-emerald-900 leading-relaxed">{complaint.resolution_remark}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
