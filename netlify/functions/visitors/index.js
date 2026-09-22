import { createClient } from '@supabase/supabase-js'

/**
 * ----------------------------------------
 * Environment variables
 * ----------------------------------------
 */

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  )
}

/**
 * ----------------------------------------
 * Supabase client
 * ----------------------------------------
 */

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

/**
 * ----------------------------------------
 * Parse cookies
 * ----------------------------------------
 */

function parseCookies(cookieHeader) {
  const cookies = {}

  if (!cookieHeader) {
    return cookies
  }

  cookieHeader.split(';').forEach((pair) => {
    const [name, ...rest] = pair.trim().split('=')

    if (name && rest.length) {
      cookies[name] = decodeURIComponent(
        rest.join('=')
      )
    }
  })

  return cookies
}

/**
 * ----------------------------------------
 * Main Netlify Function
 * ----------------------------------------
 */

export async function handler(event) {
  try {
    /**
     * ------------------------------------
     * Get existing visitor cookie
     * ------------------------------------
     */

    const cookies = parseCookies(
      event.headers?.cookie || ''
    )

    let visitorId = cookies.visitor_id
    let isNewVisitor = false

    /**
     * ------------------------------------
     * Create visitor ID for new visitor
     * ------------------------------------
     */

    if (!visitorId) {
      visitorId = crypto.randomUUID()
      isNewVisitor = true

      const { error: insertError } = await supabase
        .from('visitors')
        .insert({
          visitor_id: visitorId,
        })

      /**
       * PostgreSQL error 23505 = duplicate key.
       *
       * This is safe to ignore because the visitor
       * already exists in the database.
       */

      if (
        insertError &&
        insertError.code !== '23505'
      ) {
        console.error(
          'Visitor insert failed:',
          insertError
        )

        throw insertError
      }
    }

    /**
     * ------------------------------------
     * Get total unique visitors
     * ------------------------------------
     */

    const {
      count,
      error: countError,
    } = await supabase
      .from('visitors')
      .select('id', {
        count: 'exact',
        head: true,
      })

    if (countError) {
      console.error(
        'Visitor count failed:',
        countError
      )

      throw countError
    }

    /**
     * ------------------------------------
     * Response headers
     * ------------------------------------
     */

    const headers = {
      'Content-Type': 'application/json',

      // Prevent browser/CDN caching.
      'Cache-Control':
        'no-store, no-cache, must-revalidate',
    }

    /**
     * ------------------------------------
     * Set visitor cookie for new visitors
     * ------------------------------------
     */

    if (isNewVisitor) {
      headers['Set-Cookie'] =
        `visitor_id=${visitorId}; ` +
        `Path=/; ` +
        `HttpOnly; ` +
        `SameSite=Lax; ` +
        `Max-Age=31536000`
    }

    /**
     * ------------------------------------
     * Successful response
     * ------------------------------------
     */

    return {
      statusCode: 200,
      headers,

      body: JSON.stringify({
        count: count ?? 0,
      }),
    }
  } catch (error) {
    /**
     * ------------------------------------
     * IMPORTANT:
     *
     * Do NOT hide the actual error.
     * This makes debugging much easier.
     * ------------------------------------
     */

    console.error(
      'Visitor function error:',
      error
    )

    return {
      statusCode: 500,

      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },

      body: JSON.stringify({
        error: 'Failed to process visitor',
        message:
          error instanceof Error
            ? error.message
            : String(error),
      }),
    }
  }
}
