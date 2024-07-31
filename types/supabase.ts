export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            assignment_project: {
                Row: {
                    assignee: string
                    project_id: number
                }
                Insert: {
                    assignee: string
                    project_id: number
                }
                Update: {
                    assignee?: string
                    project_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "assignment_project_assignee_fkey"
                        columns: ["assignee"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "assignment_project_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "project"
                        referencedColumns: ["id"]
                    },
                ]
            }
            assignment_task: {
                Row: {
                    assignee: string
                    project_id: number
                    task_id: number
                }
                Insert: {
                    assignee: string
                    project_id: number
                    task_id: number
                }
                Update: {
                    assignee?: string
                    project_id?: number
                    task_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "assignment_assignee_fkey"
                        columns: ["assignee"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "assignment_task_id_fkey"
                        columns: ["task_id"]
                        isOneToOne: false
                        referencedRelation: "task"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "assignment_task_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "project"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profile: {
                Row: {
                    avatar_url: string | null
                    full_name: string | null
                    id: string
                    updated_at: string | null
                    username: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id: string
                    updated_at?: string | null
                    username?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profile_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            project: {
                Row: {
                    changed_at: string | null
                    created_at: string
                    description: string | null
                    id: number
                    name: string
                    owner: string
                }
                Insert: {
                    changed_at?: string | null
                    created_at?: string
                    description?: string | null
                    id?: number
                    name: string
                    owner: string
                }
                Update: {
                    changed_at?: string | null
                    created_at?: string
                    description?: string | null
                    id?: number
                    name?: string
                    owner?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "project1_owner_fkey"
                        columns: ["owner"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            project_user: {
                Row: {
                    project_id: number
                    user_id: string
                }
                Insert: {
                    project_id: number
                    user_id: string
                }
                Update: {
                    project_id?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "project_user_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "project"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "project_users_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            task: {
                Row: {
                    changed_at: string | null
                    content: string | null
                    created_at: string
                    id: number
                    name: string
                    priority: number | null
                    project: number | null
                    status: Database["public"]["Enums"]["status"] | null
                }
                Insert: {
                    changed_at?: string | null
                    content?: string | null
                    created_at?: string
                    id?: number
                    name: string
                    priority?: number | null
                    project?: number | null
                    status?: Database["public"]["Enums"]["status"] | null
                }
                Update: {
                    changed_at?: string | null
                    content?: string | null
                    created_at?: string
                    id?: number
                    name?: string
                    priority?: number | null
                    project?: number | null
                    status?: Database["public"]["Enums"]["status"] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "task_project_fkey"
                        columns: ["project"]
                        isOneToOne: false
                        referencedRelation: "project"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            status: "To-Do" | "In progress" | "Done"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
            Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
        ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
                Row: infer R
            }
            ? R
            : never
        : never

export type TablesInsert<
    PublicTableNameOrOptions extends | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Insert: infer I
        }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
                Insert: infer I
            }
            ? I
            : never
        : never

export type TablesUpdate<
    PublicTableNameOrOptions extends | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Update: infer U
        }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
                Update: infer U
            }
            ? U
            : never
        : never

export type Enums<
    PublicEnumNameOrOptions extends | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
        : never
