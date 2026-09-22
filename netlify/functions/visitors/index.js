import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

function parseCookies(cookieHeader) {
  const cookies = {}
  if (!cookieHeader) return cookies
  cookieHeader.split(';').forEach((pair) => {
    const [name, ...rest] = pair.trim().split('=')
    if (name && rest.length) {
      cookies[name] = decodeURIComponent(rest.join('='))
    }
  })
  return cookies
}

export async function handler(event) {
  try {
    const cookies = parseCookies(event.headers?.cookie || '')
    let visitorId = cookies.visitor_id
    let isNew = false

    if (!visitorId) {
      visitorId = crypto.randomUUID()
      isNew = true
    }

    if (isNew) {
      const { error } = await supabase
        .from('visitors')
        .insert([{ visitor_id: visitorId }])
        .select()

      if (error && error.code !== '23505') {
        throw error
      }
    }

    const { count, error: countError } = await supabase
      .from('visitors')
      .select('*', { count: true, head: true })

    if (countError) {
      throw countError
    }

    const setCookieHeader = isNew
      ? `visitor_id=${visitorId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
      : null

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        ...(setCookieHeader ? { 'Set-Cookie': setCookieHeader } : {}),
      },
      body: JSON.stringify({ count: count || 0 }),
    }
  } catch (err) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({ count: 0 }),
    }
  }
}
