export const CATEGORIES = ['IT', 'Facilities', 'HR', 'Billing']
export const PRIORITIES = ['Low', 'Medium', 'High']
export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected']

export const STATUS_CONFIG = {
  Pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', border: 'border-amber-200' },
  'In Progress': { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', border: 'border-blue-200' },
  Resolved: { label: 'Resolved', bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  Rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', border: 'border-red-200' },
}

export const PRIORITY_CONFIG = {
  Low: { label: 'Low', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', activeRing: 'ring-slate-400' },
  Medium: { label: 'Medium', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', activeRing: 'ring-amber-400' },
  High: { label: 'High', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', activeRing: 'ring-red-400' },
}

export const CATEGORY_ICONS = { IT: '💻', Facilities: '🏢', HR: '👥', Billing: '💳' }
