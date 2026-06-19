import { StatusBadge, PriorityBadge } from '../ui/Badges'
import { CATEGORY_ICONS } from '../../lib/constants'
import { ChevronRight, Paperclip } from 'lucide-react'

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ComplaintRow({ complaint, onClick }) {
  return (
    <tr onClick={onClick} className="hover:bg-slate-50 cursor-pointer transition-colors group">
      <td className="px-4 py-3.5">
        <div className="flex items-start gap-2.5">
          <span className="text-lg mt-0.5 shrink-0">{CATEGORY_ICONS[complaint.category]}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate max-w-xs">{complaint.title}</p>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{complaint.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell">
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">{complaint.category}</span>
      </td>
      <td className="px-4 py-3.5"><StatusBadge status={complaint.status} /></td>
      <td className="px-4 py-3.5 hidden md:table-cell"><PriorityBadge priority={complaint.priority} /></td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <p className="text-xs text-slate-500">{formatShortDate(complaint.created_at)}</p>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-end gap-2">
          {complaint.attachment_url && <Paperclip className="w-3.5 h-3.5 text-slate-400" />}
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>
      </td>
    </tr>
  )
}
