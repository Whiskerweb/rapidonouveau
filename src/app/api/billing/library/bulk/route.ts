import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { action, ids, value } = await request.json() as {
      action: 'delete' | 'category_change' | 'favorite'
      ids: string[]
      value?: string | boolean
    }

    if (!action || !ids?.length) {
      return NextResponse.json({ error: 'Action et IDs requis' }, { status: 400 })
    }

    switch (action) {
      case 'delete': {
        const { error } = await supabase
          .from('work_items_library')
          .delete()
          .in('id', ids)
          .eq('artisan_id', user.id)
        if (error) throw error
        break
      }
      case 'category_change': {
        const { error } = await supabase
          .from('work_items_library')
          .update({ category_id: (value as string) || null })
          .in('id', ids)
          .eq('artisan_id', user.id)
        if (error) throw error
        break
      }
      case 'favorite': {
        const { error } = await supabase
          .from('work_items_library')
          .update({ is_favorite: value as boolean })
          .in('id', ids)
          .eq('artisan_id', user.id)
        if (error) throw error
        break
      }
      default:
        return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
    }

    return NextResponse.json({ success: true, affected: ids.length })
  } catch (error) {
    console.error('Bulk library action error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
