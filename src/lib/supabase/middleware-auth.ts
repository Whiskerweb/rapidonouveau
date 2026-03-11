import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protected routes for authenticated users
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/estimations') || pathname.startsWith('/compte') || pathname.startsWith('/abonnement') || pathname.startsWith('/notifications')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/connexion'
      return NextResponse.redirect(url)
    }

    // Gating d'accès pour créer une nouvelle estimation uniquement
    if (pathname === '/estimations/nouveau') {
      // Here we need to check access. But we can't do it directly here safely without breaking
      // SSR rules if checkUserAccess creates its own cookies instance.
      // We will do a direct database check here in the middleware to avoid cookie conflicts.
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .gte('current_period_end', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let hasAccess = !!subscription;

      if (!hasAccess) {
        const { data: packs } = await supabase
          .from('packs')
          .select('*')
          .eq('user_id', user.id)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (packs && packs.length > 0) {
          const totalCredits = packs.reduce((sum, p: any) => sum + p.credits_total, 0);
          const usedCredits = packs.reduce((sum, p: any) => sum + p.credits_used, 0);
          const remaining = totalCredits - usedCredits;

          if (remaining > 0) {
            hasAccess = true;
          }
        }
      }

      if (!hasAccess) {
        const url = request.nextUrl.clone()
        url.pathname = '/nos-tarifs'
        url.searchParams.set('reason', 'no-access')
        return NextResponse.redirect(url)
      }
    }
  }

  // Protected routes for admins only
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/connexion'
      return NextResponse.redirect(url)
    }

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const profile = data as any;
    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirect to onboarding if profile_type is not set
  if (user && !pathname.startsWith('/onboarding') && !pathname.startsWith('/api') && !pathname.startsWith('/connexion') && !pathname.startsWith('/inscription')) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('profile_type')
      .eq('id', user.id)
      .single()

    if (profileData && !profileData.profile_type) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  // Redirect signed-in users away from auth pages
  if ((pathname === '/connexion' || pathname === '/inscription') && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
