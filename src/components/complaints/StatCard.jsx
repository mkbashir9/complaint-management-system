export function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    slate: { bg: 'bg-slate-50', icon: 'bg-slate-200 text-slate-600', value: 'text-slate-900' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', value: 'text-amber-900' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', value: 'text-blue-900' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', value: 'text-emerald-900' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', value: 'text-red-900' },
  }
  const c = colorMap[color] || colorMap.slate
  return (
    <div className={`${c.bg} rounded-2xl p-5 border border-white shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>
            <Icon style={{ width: 18, height: 18 }} />
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
    </div>
  )
}
