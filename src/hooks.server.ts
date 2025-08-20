import type { Handle } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

// Debug environment variables
console.log('Env check - URL exists:', !!env.PUBLIC_SUPABASE_URL);
console.log('Env check - Service key exists:', !!env.SUPABASE_SERVICE_ROLE_KEY);

// Create client with fallback for URL if needed
const supabase = createClient(
  // Use the URL directly from .env file as a fallback
  env.PUBLIC_SUPABASE_URL || "https://dspjvuundkrmqwophfjf.supabase.co",
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = supabase;

  // Rest of your code...
  const accessToken = event.cookies.get('sb-access-token');
  if (accessToken) {
    supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
    const { data } = await supabase.auth.getUser();
    event.locals.user = data?.user || null;
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};