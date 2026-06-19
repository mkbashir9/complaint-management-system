import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})

export async function uploadAttachment(userId, file) {
  const ext = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${ext}`
  const { data, error } = await supabase.storage
    .from('complaint-attachments')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data: urlData } = supabase.storage
    .from('complaint-attachments')
    .getPublicUrl(data.path)
  return { url: urlData.publicUrl, name: file.name }
}
