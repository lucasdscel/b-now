/**
 * Auto-generado por: npm run types:db
 * NO editar manualmente — regenerar con el comando anterior.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ciudades: {
        Row: {
          activa: boolean
          created_at: string
          id: number
          nombre: string
          pais: string
          region: string
          slug: string
        }
        Insert: {
          activa?: boolean
          created_at?: string
          id?: number
          nombre: string
          pais?: string
          region: string
          slug: string
        }
        Update: {
          activa?: boolean
          created_at?: string
          id?: number
          nombre?: string
          pais?: string
          region?: string
          slug?: string
        }
        Relationships: []
      }
      contact_events: {
        Row: {
          ciudad_id: number | null
          cliente_user_id: string | null
          created_at: string
          id: string
          ip_hash: string | null
          profesional_id: string
          referrer: string | null
          tipo: Database["public"]["Enums"]["tipo_contacto"]
        }
        Insert: {
          ciudad_id?: number | null
          cliente_user_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          profesional_id: string
          referrer?: string | null
          tipo: Database["public"]["Enums"]["tipo_contacto"]
        }
        Update: {
          ciudad_id?: number | null
          cliente_user_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          profesional_id?: string
          referrer?: string | null
          tipo?: Database["public"]["Enums"]["tipo_contacto"]
        }
        Relationships: [
          {
            foreignKeyName: "contact_events_ciudad_id_fkey"
            columns: ["ciudad_id"]
            isOneToOne: false
            referencedRelation: "ciudades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_events_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
        ]
      }
      disponibilidad_slots: {
        Row: {
          activo: boolean
          created_at: string
          dia_semana: number
          hora_fin: string
          hora_inicio: string
          id: string
          profesional_id: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          dia_semana: number
          hora_fin: string
          hora_inicio: string
          id?: string
          profesional_id: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          dia_semana?: number
          hora_fin?: string
          hora_inicio?: string
          id?: string
          profesional_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disponibilidad_slots_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
        ]
      }
      fotos: {
        Row: {
          created_at: string
          descripcion: string | null
          es_portada: boolean
          id: string
          orden: number
          profesional_id: string
          url: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          es_portada?: boolean
          id?: string
          orden?: number
          profesional_id: string
          url: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          es_portada?: boolean
          id?: string
          orden?: number
          profesional_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotos_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
        ]
      }
      profesionales: {
        Row: {
          activo: boolean
          apellido: string
          avatar_url: string | null
          bio: string | null
          ciudad_id: number | null
          comuna: string | null
          created_at: string
          direccion: string | null
          email: string | null
          especialidades: string[]
          id: string
          instagram_url: string | null
          lat: number | null
          lng: number | null
          nombre: string
          plan: string
          rating_promedio: number | null
          slug: string
          telefono: string | null
          total_reviews: number
          updated_at: string
          user_id: string | null
          verificado: boolean
          whatsapp: string | null
        }
        Insert: {
          activo?: boolean
          apellido: string
          avatar_url?: string | null
          bio?: string | null
          ciudad_id?: number | null
          comuna?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          especialidades?: string[]
          id?: string
          instagram_url?: string | null
          lat?: number | null
          lng?: number | null
          nombre: string
          plan?: string
          rating_promedio?: number | null
          slug: string
          telefono?: string | null
          total_reviews?: number
          updated_at?: string
          user_id?: string | null
          verificado?: boolean
          whatsapp?: string | null
        }
        Update: {
          activo?: boolean
          apellido?: string
          avatar_url?: string | null
          bio?: string | null
          ciudad_id?: number | null
          comuna?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          especialidades?: string[]
          id?: string
          instagram_url?: string | null
          lat?: number | null
          lng?: number | null
          nombre?: string
          plan?: string
          rating_promedio?: number | null
          slug?: string
          telefono?: string | null
          total_reviews?: number
          updated_at?: string
          user_id?: string | null
          verificado?: boolean
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profesionales_ciudad_id_fkey"
            columns: ["ciudad_id"]
            isOneToOne: false
            referencedRelation: "ciudades"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          cliente_email: string | null
          cliente_nombre: string
          cliente_telefono: string | null
          cliente_user_id: string | null
          created_at: string
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha: string
          hora_fin: string
          hora_inicio: string
          id: string
          notas: string | null
          precio_acordado: number | null
          profesional_id: string
          servicio_id: string | null
          updated_at: string
        }
        Insert: {
          cliente_email?: string | null
          cliente_nombre: string
          cliente_telefono?: string | null
          cliente_user_id?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha: string
          hora_fin: string
          hora_inicio: string
          id?: string
          notas?: string | null
          precio_acordado?: number | null
          profesional_id: string
          servicio_id?: string | null
          updated_at?: string
        }
        Update: {
          cliente_email?: string | null
          cliente_nombre?: string
          cliente_telefono?: string | null
          cliente_user_id?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha?: string
          hora_fin?: string
          hora_inicio?: string
          id?: string
          notas?: string | null
          precio_acordado?: number | null
          profesional_id?: string
          servicio_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          cliente_nombre: string | null
          cliente_user_id: string | null
          comentario: string | null
          created_at: string
          id: string
          profesional_id: string
          publicada: boolean
          puntuacion: number
          reserva_id: string | null
          respuesta_profesional: string | null
          updated_at: string
        }
        Insert: {
          cliente_nombre?: string | null
          cliente_user_id?: string | null
          comentario?: string | null
          created_at?: string
          id?: string
          profesional_id: string
          publicada?: boolean
          puntuacion: number
          reserva_id?: string | null
          respuesta_profesional?: string | null
          updated_at?: string
        }
        Update: {
          cliente_nombre?: string | null
          cliente_user_id?: string | null
          comentario?: string | null
          created_at?: string
          id?: string
          profesional_id?: string
          publicada?: boolean
          puntuacion?: number
          reserva_id?: string | null
          respuesta_profesional?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: true
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      servicios: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          duracion_minutos: number
          id: string
          nombre: string
          precio: number | null
          precio_desde: number | null
          profesional_id: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          duracion_minutos?: number
          id?: string
          nombre: string
          precio?: number | null
          precio_desde?: number | null
          profesional_id: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          duracion_minutos?: number
          id?: string
          nombre?: string
          precio?: number | null
          precio_desde?: number | null
          profesional_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicios_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
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
      estado_reserva:
        | "pendiente"
        | "confirmada"
        | "cancelada"
        | "completada"
        | "no_show"
      tipo_contacto:
        | "whatsapp"
        | "telefono"
        | "instagram"
        | "formulario"
        | "ver_mapa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_reserva: [
        "pendiente",
        "confirmada",
        "cancelada",
        "completada",
        "no_show",
      ],
      tipo_contacto: [
        "whatsapp",
        "telefono",
        "instagram",
        "formulario",
        "ver_mapa",
      ],
    },
  },
} as const
