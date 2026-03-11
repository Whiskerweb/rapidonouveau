import { createClient } from '@/lib/supabase/server';
import { checkUserAccess } from '@/lib/access';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Check Access
        const access = await checkUserAccess();
        if (!access.hasAccess) {
            return NextResponse.json({ error: 'No active subscription or credits' }, { status: 403 });
        }

        const body = await req.json();
        const {
            property_type,
            surface_m2,
            address,
            postal_code,
            city,
            description,
            files, // array of { url, filename, type }
            work_categories,
            // Nouveaux champs questionnaire intelligent
            questionnaire_responses,
            project_type,
            location_department,
            ai_prompt,
        } = body;

        // 2. Logic starts...

        // A. Deduct Credit if applicable
        let packId = null;
        if (access.accessType === 'pack') {
            const { data: packs, error: fetchError } = await supabase
                .from('packs')
                .select('id, credits_total, credits_used')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (fetchError) throw fetchError;
            const packToDeduct = packs?.find(p => p.credits_used < p.credits_total);

            if (!packToDeduct) {
                return NextResponse.json({ error: 'No remaining credits' }, { status: 403 });
            }
            packId = packToDeduct.id;

            const { error: updateError } = await supabase
                .from('packs')
                .update({ credits_used: packToDeduct.credits_used + 1 })
                .eq('id', packToDeduct.id);

            if (updateError) throw updateError;
        }

        // B. Create Estimation
        const { data: estimation, error: insertError } = await supabase
            .from('estimations')
            .insert({
                user_id: user.id,
                status: 'submitted',
                property_type: property_type || 'autre',
                surface_m2: surface_m2 ? parseFloat(surface_m2) : null,
                address,
                postal_code: postal_code || null,
                city: city || null,
                notes: description,
                questionnaire_responses: questionnaire_responses || null,
                project_type: project_type || null,
                location_department: location_department || null,
                ai_prompt: ai_prompt || null,
                submitted_at: new Date().toISOString()
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // C. Insert Credit Transaction log
        if (packId) {
            await supabase.from('credit_transactions').insert({
                user_id: user.id,
                pack_id: packId,
                estimation_id: estimation.id,
                type: 'debit',
                amount: -1,
                balance_after: (access.creditsRemaining || 0) - 1,
                description: `Estimation: ${address || 'Sans adresse'}`
            });
        }

        // D. Insert Attachments
        if (files && files.length > 0) {
            const attachmentData = files.map((f: any) => ({
                estimation_id: estimation.id,
                type: f.type || 'photo',
                storage_path: f.url,
                filename: f.filename
            }));

            const { error: attachError } = await supabase
                .from('attachments')
                .insert(attachmentData);

            if (attachError) console.error('Attachment insertion error:', attachError);
        }

        // E. Insert Estimation Items (Work categories)
        if (work_categories && work_categories.length > 0) {
            const itemData = work_categories.map((cat: string) => ({
                estimation_id: estimation.id,
                category: cat,
                level: 'complete'
            }));

            const { error: itemError } = await supabase
                .from('estimation_items')
                .insert(itemData);

            if (itemError) console.error('Item insertion error:', itemError);
        }

        return NextResponse.json({
            success: true,
            estimationId: estimation.id
        });

    } catch (err: any) {
        console.error('Submission Error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: estimations, error } = await supabase
            .from('estimations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(estimations);

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
