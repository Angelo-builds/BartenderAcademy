
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURAZIONE SUPABASE
// ------------------------------------------------------------------

const supabaseUrl = 'https://mryyuzqpawrrrnkuiywn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yeXl1enFwYXdycnJua3VpeXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDk5NDAsImV4cCI6MjA4Njk4NTk0MH0.buHRPtfoLQJwDdLphoHjXgzk8KxqQHNYR7U9VvvyOp4';

// Inizializzazione diretta senza controlli condizionali che potrebbero fallire
export const supabase = createClient(supabaseUrl, supabaseKey);
