import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gmexrdmzzvuoovpddrby.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZXhyZG16enZ1b292cGRkcmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NjM1MzUsImV4cCI6MjA1NDMzOTUzNX0.y3_VCLNTjjiJg2qBvAas_S2XkZ1I-MuMQnh-RWPjd0U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)