import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilaxplcmuagheewhioni.supabase.co';
const supabaseKey = 'sb_publishable_g5ZLYi7FIl_Opla3Dev8MQ_ATzg46e_';

export const supabase = createClient(supabaseUrl, supabaseKey);