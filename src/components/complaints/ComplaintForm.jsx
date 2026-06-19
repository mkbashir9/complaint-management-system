import { useState, useRef } from 'react'
import { Modal } from '../ui/Modal'
import { Spinner } from '../ui/Spinner'
import { CATEGORIES, PRIORITIES, PRIORITY_CONFIG } from '../../lib/constants'
import { Paperclip, X, Upload } from 'lucide-react'

const INITIAL_FORM = { title: '', description: '', category: '', priority: 'Medium', attachment: null }

export function ComplaintForm({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(err => ({ ...err, [name]: '' }))
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErrors(err => ({ ...err, attachment: 'File must be smaller than 5 MB.' })); return }
    setForm(f => ({ ...f, attachment: file }))
    setErrors(err => ({ ...err, attachment: '' }))
  }

  function removeFile() {
    setForm(f => ({ ...f, attachment: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters.'
    if (!form.description.trim()) e.description = 'Description is required.'
    if (form.description.trim().length < 20) e.description = 'Please describe the issue in at least 20 characters.'
    if (!form.category) e.category = 'Please select a category.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await onSubmit({ title: form.title.trim(), description: form.description.trim(), category: form.category, priority: form.priority, attachment: form.attachment })
      setForm(INITIAL_FORM)
      onClose()
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to submit complaint.' })
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setForm(INITIAL_FORM)
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="File a New Complaint" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Complaint title <span className="text-red-500">*</span></label>
          <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Brief summary of the issue" className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.title ? 'border-red-400 bg-red-50' : 'border-slate-300'}`} />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
            <select name="category" value={form.category} onChange={handleChange} className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none bg-white ${errors.category ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}>
              <option value="">Select a category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => {
                const config = PRIORITY_CONFIG[p]
                const selected = form.priority === p
                return (
                  <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${selected ? `${config.bg} ${config.text} ${config.border} ring-2 ${config.activeRing}` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                    {p}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Please describe the issue in detail…" className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-300'}`} />
          <div className="flex items-center justify-between mt-1">
            {errors.description ? <p className="text-xs text-red-600">{errors.description}</p> : <span />}
            <p className="text-xs text-slate-400">{form.description.length} chars</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Attachment <span className="text-slate-400 font-normal">(optional, max 5 MB)</span></label>
          {form.attachment ? (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-200 bg-indigo-50">
              <Paperclip className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-indigo-800 truncate">{form.attachment.name}</p>
                <p className="text-xs text-indigo-600">{(form.attachment.size / 1024).toFixed(1)} KB</p>
              </div>
              <button type="button" onClick={removeFile} className="p-1 rounded-lg text-indigo-400 hover:text-indigo-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-slate-400" />
              <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400">PNG, JPG, PDF, DOCX</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFile} className="hidden" />
          {errors.attachment && <p className="mt-1 text-xs text-red-600">{errors.attachment}</p>}
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button type="button" onClick={handleClose} disabled={loading} className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            {loading ? <><Spinner size="sm" />Submitting…</> : 'Submit complaint'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
