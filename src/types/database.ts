export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    phone: string | null
                    company: string | null
                    role: 'client' | 'admin' | 'super_admin'
                    stripe_customer_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string
                    full_name?: string | null
                    phone?: string | null
                    company?: string | null
                    role?: 'client' | 'admin' | 'super_admin'
                    stripe_customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    phone?: string | null
                    company?: string | null
                    role?: 'client' | 'admin' | 'super_admin'
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
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
