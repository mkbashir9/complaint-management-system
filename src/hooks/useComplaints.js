import { useState, useEffect, useCallback } from 'react'
import { supabase, uploadAttachment } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useComplaints() {
  const { session, profile, isAdmin } = useAuth()
  const userId = session?.user?.id

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchComplaints = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('complaints')
        .select('*, profiles:user_id (full_name, email)')
        .order('created_at', { ascending: false })

      if (!isAdmin) query = query.eq('user_id', userId)

      const { data, error } = await query
      if (error) throw error

      setComplaints(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId, isAdmin])

  useEffect(() => {
    fetchComplaints()
  }, [fetchComplaints])

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('complaints-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'complaints' },
        () => {
          fetchComplaints()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, fetchComplaints])

  async function createComplaint({ title, description, category, priority, attachment }) {
    if (!userId) throw new Error('Not authenticated')

    let attachmentUrl = null
    let attachmentName = null

    if (attachment) {
      const result = await uploadAttachment(userId, attachment)
      attachmentUrl = result.url
      attachmentName = result.name
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert([
        {
          user_id: userId,
          title,
          description,
          category,
          priority,
          status: 'Pending',
          attachment_url: attachmentUrl,
          attachment_name: attachmentName,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return data
  }

  async function updateComplaintStatus(complaintId, { status, resolution_remark }) {
    const updates = { status, resolution_remark: resolution_remark || null }

    if (status === 'Resolved') {
      updates.resolved_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', complaintId)
      .select()
      .single()

    if (error) throw error

    return data
  }

  async function deleteComplaint(complaintId) {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', complaintId)

    if (error) throw error
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    rejected: complaints.filter(c => c.status === 'Rejected').length,
  }

  return {
    complaints,
    loading,
    error,
    stats,
    createComplaint,
    updateComplaintStatus,
    deleteComplaint,
    refetch: fetchComplaints,
  }
}