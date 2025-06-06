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
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          venue_id: string | null
          created_at: string
          updated_at: string
          organizer_id: string
          status: Database["public"]["Enums"]["event_status"]
          category: string
          max_attendees: number | null
          price: number | null
          currency: string
          featured_image: string | null
          is_featured: boolean
          timezone: string
          refund_policy: string | null
          tags: string[] | null
          private_notes: string | null
          public_notes: string | null
          website_url: string | null
          sales_start_date: string | null
          sales_end_date: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          venue_id?: string | null
          created_at?: string
          updated_at?: string
          organizer_id: string
          status?: Database["public"]["Enums"]["event_status"]
          category?: string
          max_attendees?: number | null
          price?: number | null
          currency?: string
          featured_image?: string | null
          is_featured?: boolean
          timezone?: string
          refund_policy?: string | null
          tags?: string[] | null
          private_notes?: string | null
          public_notes?: string | null
          website_url?: string | null
          sales_start_date?: string | null
          sales_end_date?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          venue_id?: string | null
          created_at?: string
          updated_at?: string
          organizer_id?: string
          status?: Database["public"]["Enums"]["event_status"]
          category?: string
          max_attendees?: number | null
          price?: number | null
          currency?: string
          featured_image?: string | null
          is_featured?: boolean
          timezone?: string
          refund_policy?: string | null
          tags?: string[] | null
          private_notes?: string | null
          public_notes?: string | null
          website_url?: string | null
          sales_start_date?: string | null
          sales_end_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          }
        ]
      }
      venues: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          country: string
          postal_code: string
          capacity: number | null
          description: string | null
          contact_email: string | null
          contact_phone: string | null
          website: string | null
          created_at: string
          updated_at: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          amenities: string[] | null
          images: string[] | null
          accessibility_features: string[] | null
          parking_info: string | null
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          country: string
          postal_code: string
          capacity?: number | null
          description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          amenities?: string[] | null
          images?: string[] | null
          accessibility_features?: string[] | null
          parking_info?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          country?: string
          postal_code?: string
          capacity?: number | null
          description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          amenities?: string[] | null
          images?: string[] | null
          accessibility_features?: string[] | null
          parking_info?: string | null
        }
        Relationships: []
      }
      uploaded_files: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string | null
          storage_path: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type?: string | null
          storage_path: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string | null
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "buyer" | "organizer" | "instructor" | "admin" | "event_staff" | "sales_agent"
      event_status: "draft" | "published" | "cancelled" | "completed" | "postponed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["buyer", "organizer", "instructor", "admin", "event_staff", "sales_agent"],
      event_status: ["draft", "published", "cancelled", "completed", "postponed"],
    },
  },
} as const
