export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type ProfileType = 'artisan' | 'immobilier' | 'particulier'
export type UserRole = 'client' | 'admin' | 'super_admin'
export type EstimationStatus = 'draft' | 'submitted' | 'in_progress' | 'validated' | 'delivered'
export type DocumentType = 'estimation_pdf' | 'devis_detaille' | 'plan' | 'photo' | 'autre'
export type ImmobilierRole = 'agent' | 'marchand_biens' | 'promoteur' | 'diagnostiqueur'

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    first_name: string | null
                    last_name: string | null
                    phone: string | null
                    company: string | null
                    role: UserRole
                    profile_type: ProfileType | null
                    avatar_url: string | null
                    address_city: string | null
                    address_department: string | null
                    address_lat: number | null
                    address_lng: number | null
                    is_verified: boolean
                    logo_url: string | null
                    stripe_customer_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string
                    full_name?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    phone?: string | null
                    company?: string | null
                    role?: UserRole
                    profile_type?: ProfileType | null
                    avatar_url?: string | null
                    address_city?: string | null
                    address_department?: string | null
                    address_lat?: number | null
                    address_lng?: number | null
                    is_verified?: boolean
                    logo_url?: string | null
                    stripe_customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    phone?: string | null
                    company?: string | null
                    role?: UserRole
                    profile_type?: ProfileType | null
                    avatar_url?: string | null
                    address_city?: string | null
                    address_department?: string | null
                    address_lat?: number | null
                    address_lng?: number | null
                    is_verified?: boolean
                    logo_url?: string | null
                    stripe_customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            artisan_profiles: {
                Row: {
                    user_id: string
                    siret: string
                    company_name: string | null
                    main_trade: string
                    specializations: string[]
                    insurance_decennale_number: string | null
                    insurance_expiry: string | null
                    certifications: string[]
                    intervention_radius_km: number
                    hourly_rate: number | null
                    is_available: boolean
                    rating: number
                    total_reviews: number
                    verified_documents: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    siret: string
                    company_name?: string | null
                    main_trade: string
                    specializations?: string[]
                    insurance_decennale_number?: string | null
                    insurance_expiry?: string | null
                    certifications?: string[]
                    intervention_radius_km?: number
                    hourly_rate?: number | null
                    is_available?: boolean
                    rating?: number
                    total_reviews?: number
                    verified_documents?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    siret?: string
                    company_name?: string | null
                    main_trade?: string
                    specializations?: string[]
                    insurance_decennale_number?: string | null
                    insurance_expiry?: string | null
                    certifications?: string[]
                    intervention_radius_km?: number
                    hourly_rate?: number | null
                    is_available?: boolean
                    rating?: number
                    total_reviews?: number
                    verified_documents?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            immobilier_profiles: {
                Row: {
                    user_id: string
                    siret: string | null
                    company_name: string | null
                    immobilier_role: ImmobilierRole | null
                    agency_name: string | null
                    network: string | null
                    annual_volume: number | null
                    portfolio_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    siret?: string | null
                    company_name?: string | null
                    immobilier_role?: ImmobilierRole | null
                    agency_name?: string | null
                    network?: string | null
                    annual_volume?: number | null
                    portfolio_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    siret?: string | null
                    company_name?: string | null
                    immobilier_role?: ImmobilierRole | null
                    agency_name?: string | null
                    network?: string | null
                    annual_volume?: number | null
                    portfolio_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            particulier_profiles: {
                Row: {
                    user_id: string
                    is_owner: boolean
                    property_type: string | null
                    estimated_budget_range: string | null
                    is_first_project: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    is_owner?: boolean
                    property_type?: string | null
                    estimated_budget_range?: string | null
                    is_first_project?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    is_owner?: boolean
                    property_type?: string | null
                    estimated_budget_range?: string | null
                    is_first_project?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            estimations: {
                Row: {
                    id: string
                    user_id: string
                    status: EstimationStatus
                    property_type: string | null
                    surface_m2: number | null
                    address: string | null
                    postal_code: string | null
                    city: string | null
                    year_built: number | null
                    rooms: number | null
                    levels: number | null
                    notes: string | null
                    assigned_admin_id: string | null
                    questionnaire_responses: Json | null
                    ai_prompt: string | null
                    ai_estimation: Json | null
                    final_estimation: Json | null
                    reviewed_by: string | null
                    project_type: string | null
                    location_department: string | null
                    created_at: string
                    updated_at: string
                    submitted_at: string | null
                    delivered_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    status?: EstimationStatus
                    property_type?: string | null
                    surface_m2?: number | null
                    address?: string | null
                    postal_code?: string | null
                    city?: string | null
                    year_built?: number | null
                    rooms?: number | null
                    levels?: number | null
                    notes?: string | null
                    assigned_admin_id?: string | null
                    questionnaire_responses?: Json | null
                    ai_prompt?: string | null
                    ai_estimation?: Json | null
                    final_estimation?: Json | null
                    reviewed_by?: string | null
                    project_type?: string | null
                    location_department?: string | null
                    created_at?: string
                    updated_at?: string
                    submitted_at?: string | null
                    delivered_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    status?: EstimationStatus
                    property_type?: string | null
                    surface_m2?: number | null
                    address?: string | null
                    postal_code?: string | null
                    city?: string | null
                    year_built?: number | null
                    rooms?: number | null
                    levels?: number | null
                    notes?: string | null
                    assigned_admin_id?: string | null
                    questionnaire_responses?: Json | null
                    ai_prompt?: string | null
                    ai_estimation?: Json | null
                    final_estimation?: Json | null
                    reviewed_by?: string | null
                    project_type?: string | null
                    location_department?: string | null
                    created_at?: string
                    updated_at?: string
                    submitted_at?: string | null
                    delivered_at?: string | null
                }
            }
            estimation_items: {
                Row: {
                    id: string
                    estimation_id: string
                    category: string
                    level: string
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    estimation_id: string
                    category: string
                    level?: string
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    estimation_id?: string
                    category?: string
                    level?: string
                    notes?: string | null
                    created_at?: string
                }
            }
            attachments: {
                Row: {
                    id: string
                    estimation_id: string
                    type: string
                    storage_path: string
                    filename: string
                    size_bytes: number | null
                    uploaded_at: string
                }
                Insert: {
                    id?: string
                    estimation_id: string
                    type?: string
                    storage_path: string
                    filename: string
                    size_bytes?: number | null
                    uploaded_at?: string
                }
                Update: {
                    id?: string
                    estimation_id?: string
                    type?: string
                    storage_path?: string
                    filename?: string
                    size_bytes?: number | null
                    uploaded_at?: string
                }
            }
            estimation_documents: {
                Row: {
                    id: string
                    estimation_id: string
                    uploaded_by: string | null
                    document_type: DocumentType
                    storage_path: string
                    filename: string
                    file_size: number | null
                    is_visible_to_user: boolean
                    notified_at: string | null
                    viewed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    estimation_id: string
                    uploaded_by?: string | null
                    document_type?: DocumentType
                    storage_path: string
                    filename: string
                    file_size?: number | null
                    is_visible_to_user?: boolean
                    notified_at?: string | null
                    viewed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    estimation_id?: string
                    uploaded_by?: string | null
                    document_type?: DocumentType
                    storage_path?: string
                    filename?: string
                    file_size?: number | null
                    is_visible_to_user?: boolean
                    notified_at?: string | null
                    viewed_at?: string | null
                    created_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    title: string
                    body: string | null
                    data: Json
                    read_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: string
                    title: string
                    body?: string | null
                    data?: Json
                    read_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: string
                    title?: string
                    body?: string | null
                    data?: Json
                    read_at?: string | null
                    created_at?: string
                }
            }
            quotes: {
                Row: {
                    id: string
                    estimation_id: string
                    admin_id: string
                    pdf_storage_path: string | null
                    total_amount_min: number | null
                    total_amount_max: number | null
                    notes_internal: string | null
                    created_at: string
                    validated_at: string | null
                    sent_at: string | null
                }
                Insert: {
                    id?: string
                    estimation_id: string
                    admin_id: string
                    pdf_storage_path?: string | null
                    total_amount_min?: number | null
                    total_amount_max?: number | null
                    notes_internal?: string | null
                    created_at?: string
                    validated_at?: string | null
                    sent_at?: string | null
                }
                Update: {
                    id?: string
                    estimation_id?: string
                    admin_id?: string
                    pdf_storage_path?: string | null
                    total_amount_min?: number | null
                    total_amount_max?: number | null
                    notes_internal?: string | null
                    created_at?: string
                    validated_at?: string | null
                    sent_at?: string | null
                }
            }
            quote_items: {
                Row: {
                    id: string
                    quote_id: string
                    category: string
                    label: string
                    amount_min: number
                    amount_max: number
                    notes: string | null
                    sort_order: number
                }
                Insert: {
                    id?: string
                    quote_id: string
                    category: string
                    label: string
                    amount_min?: number
                    amount_max?: number
                    notes?: string | null
                    sort_order?: number
                }
                Update: {
                    id?: string
                    quote_id?: string
                    category?: string
                    label?: string
                    amount_min?: number
                    amount_max?: number
                    notes?: string | null
                    sort_order?: number
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    stripe_subscription_id: string | null
                    plan: 'essentiel' | 'expert' | string
                    status: string
                    current_period_start: string
                    current_period_end: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    stripe_subscription_id?: string | null
                    plan?: string
                    status?: string
                    current_period_start?: string
                    current_period_end?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    stripe_subscription_id?: string | null
                    plan?: string
                    status?: string
                    current_period_start?: string
                    current_period_end?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            packs: {
                Row: {
                    id: string
                    user_id: string
                    credits_total: number
                    credits_used: number
                    expires_at: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    credits_total: number
                    credits_used?: number
                    expires_at: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    credits_total?: number
                    credits_used?: number
                    expires_at?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            credit_transactions: {
                Row: {
                    id: string
                    user_id: string
                    pack_id: string | null
                    estimation_id: string | null
                    type: string
                    amount: number
                    balance_after: number
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    pack_id?: string | null
                    estimation_id?: string | null
                    type: string
                    amount: number
                    balance_after: number
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    pack_id?: string | null
                    estimation_id?: string | null
                    type?: string
                    amount?: number
                    balance_after?: number
                    description?: string | null
                    created_at?: string
                }
            }
            promo_codes: {
                Row: {
                    id: string
                    code: string
                    stripe_coupon_id: string | null
                    stripe_promo_code_id: string | null
                    type: string
                    value: number
                    applies_to: string[]
                    duration: string
                    duration_in_months: number | null
                    starts_at: string | null
                    expires_at: string | null
                    max_redemptions: number | null
                    times_redeemed: number
                    first_time_only: boolean
                    is_active: boolean
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    stripe_coupon_id?: string | null
                    stripe_promo_code_id?: string | null
                    type?: string
                    value: number
                    applies_to?: string[]
                    duration?: string
                    duration_in_months?: number | null
                    starts_at?: string | null
                    expires_at?: string | null
                    max_redemptions?: number | null
                    times_redeemed?: number
                    first_time_only?: boolean
                    is_active?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    stripe_coupon_id?: string | null
                    stripe_promo_code_id?: string | null
                    type?: string
                    value?: number
                    applies_to?: string[]
                    duration?: string
                    duration_in_months?: number | null
                    starts_at?: string | null
                    expires_at?: string | null
                    max_redemptions?: number | null
                    times_redeemed?: number
                    first_time_only?: boolean
                    is_active?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            site_content: {
                Row: {
                    id: string
                    section: string
                    key: string
                    value: Json
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    section: string
                    key: string
                    value: Json
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    section?: string
                    key?: string
                    value?: Json
                    updated_at?: string
                    updated_by?: string | null
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    excerpt: string | null
                    content: string
                    category: string
                    author_id: string | null
                    featured_image_url: string | null
                    seo_title: string | null
                    seo_description: string | null
                    status: string
                    published_at: string | null
                    scheduled_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    excerpt?: string | null
                    content: string
                    category?: string
                    author_id?: string | null
                    featured_image_url?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    status?: string
                    published_at?: string | null
                    scheduled_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    excerpt?: string | null
                    content?: string
                    category?: string
                    author_id?: string | null
                    featured_image_url?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    status?: string
                    published_at?: string | null
                    scheduled_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            email_templates: {
                Row: {
                    id: string
                    trigger: string
                    subject: string
                    body_html: string
                    variables: string[]
                    is_active: boolean
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    trigger: string
                    subject: string
                    body_html: string
                    variables?: string[]
                    is_active?: boolean
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    trigger?: string
                    subject?: string
                    body_html?: string
                    variables?: string[]
                    is_active?: boolean
                    updated_at?: string
                    updated_by?: string | null
                }
            }
            admin_activity_log: {
                Row: {
                    id: string
                    admin_id: string
                    action: string
                    entity_type: string | null
                    entity_id: string | null
                    details: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    admin_id: string
                    action: string
                    entity_type?: string | null
                    entity_id?: string | null
                    details?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    admin_id?: string
                    action?: string
                    entity_type?: string | null
                    entity_id?: string | null
                    details?: Json | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_admin: {
                Args: Record<string, never>
                Returns: boolean
            }
        }
        Enums: {
            user_role: 'client' | 'admin' | 'super_admin'
            subscription_plan: 'essentiel' | 'expert'
            subscription_status: 'active' | 'past_due' | 'cancelled' | 'trialing'
            estimation_status: 'draft' | 'submitted' | 'in_progress' | 'validated' | 'delivered'
            property_type: 'maison' | 'appartement' | 'immeuble' | 'local_commercial' | 'autre'
            work_category: 'isolation_interieure' | 'isolation_exterieure' | 'electricite' | 'plomberie' | 'menuiserie' | 'assainissement' | 'toiture' | 'chauffage' | 'peinture'
            work_level: 'partial' | 'complete'
            attachment_type: 'photo' | 'plan' | 'other'
            blog_status: 'draft' | 'scheduled' | 'published' | 'archived'
            promo_duration: 'once' | 'repeating' | 'forever'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
