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
      body_metrics: {
        Args: {
          id?: string
          user_id?: string
          log_date?: string
          weight_kg?: number
          height_cm?: number
          body_fat_percent?: number
          muscle_mass_kg?: number
          created_at?: string
        }
        Row: {
          id: string
          user_id: string
          log_date: string
          weight_kg: number | null
          height_cm: number | null
          body_fat_percent: number | null
          muscle_mass_kg: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          log_date?: string
          weight_kg?: number | null
          height_cm?: number | null
          body_fat_percent?: number | null
          muscle_mass_kg?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          weight_kg?: number | null
          height_cm?: number | null
          body_fat_percent?: number | null
          muscle_mass_kg?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'body_metrics_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      mood_logs: {
        Args: {
          id?: string
          user_id?: string
          log_date?: string
          mood_level?: string
          created_at?: string
        }
        Row: {
          id: string
          user_id: string
          log_date: string
          mood_level: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          log_date?: string
          mood_level?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          mood_level?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'mood_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      nutrition_logs: {
        Args: {
          id?: string
          user_id?: string
          log_date?: string
          food_item?: string
          calories?: number
          protein_g?: number
          carbs_g?: number
          fat_g?: number
          created_at?: string
        }
        Row: {
          id: string
          user_id: string
          log_date: string
          food_item: string
          calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fat_g: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          log_date?: string
          food_item?: string
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          food_item?: string
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'nutrition_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      planned_workouts: {
        Args: {
          id?: string
          user_id?: string
          planned_date?: string
          workout_name?: string
          duration_minutes?: number
          created_at?: string
        }
        Row: {
          id: string
          user_id: string
          planned_date: string
          workout_name: string
          duration_minutes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          planned_date?: string
          workout_name?: string
          duration_minutes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          planned_date?: string
          workout_name?: string
          duration_minutes?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'planned_workouts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Args: {
          id?: string
          name?: string
          fitness_goal?: string
          activity_level?: string
          created_at?: string
        }
        Row: {
          id: string
          name: string | null
          fitness_goal: string | null
          activity_level: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          fitness_goal?: string | null
          activity_level?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          fitness_goal?: string | null
          activity_level?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      water_logs: {
        Args: {
          id?: string
          user_id?: string
          log_date?: string
          amount_ml?: number
          goal_ml?: number
          created_at?: string
        }
        Row: {
          id: string
          user_id: string
          log_date: string
          amount_ml: number
          goal_ml: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          log_date?: string
          amount_ml?: number
          goal_ml?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          amount_ml?: number
          goal_ml?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'water_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      workout_logs: {
        Args: {
          id?: string
          user_id?: string
          log_date?: string
          workout_type?: string
          duration_minutes?: number
          calories_burned?: number
          notes?: string
          created_at?: string
        }
        Row: {
          id: string
          user_id: string
          log_date: string
          workout_type: string
          duration_minutes: number
          calories_burned: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          log_date?: string
          workout_type?: string
          duration_minutes?: number
          calories_burned?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          workout_type?: string
          duration_minutes?: number
          calories_burned?: number | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workout_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
    PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
    PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never
