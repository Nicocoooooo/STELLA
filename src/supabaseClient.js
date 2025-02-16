import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gmexrdmzzvuoovpddrby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZXhyZG16enZ1b292cGRkcmJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODc2MzUzNSwiZXhwIjoyMDU0MzM5NTM1fQ.Io3R2tEeE8PhsaIp_LhNs0w4B4a0laxIWf2PHqrZxXI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;