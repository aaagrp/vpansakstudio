import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: any;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

if (!supabaseClient) {
  console.warn(
    'Supabase credentials are not defined. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'
  );

  // Return a safe dummy client to prevent app-wide browser crashes
  const dummyFn = () => ({
    select: dummyFn,
    insert: dummyFn,
    update: dummyFn,
    delete: dummyFn,
    eq: dummyFn,
    neq: dummyFn,
    single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
    then: (resolve: any) => resolve({ data: null, error: new Error('Supabase not configured') })
  });

  supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: dummyFn,
      insert: dummyFn,
      update: dummyFn,
      delete: dummyFn,
      eq: dummyFn,
      order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') })
    }),
    rpc: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
  };
}

export const supabase = supabaseClient;
