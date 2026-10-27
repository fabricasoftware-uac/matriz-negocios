export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "superadmin" | "admin" | "user" | "investor";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          legal_structure: string | null;
          ciiu_code: string | null;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          legal_structure?: string | null;
          ciiu_code?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          legal_structure?: string | null;
          ciiu_code?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      financial_assumptions: {
        Row: {
          project_id: string;
          annual_inflation_ipc: Json;
          annual_market_growth: Json;
          base_smlmv: number;
          discount_rate_wacc: number;
          receivable_days: number;
          payable_days: number;
          inventory_days: number;
          tax_rate_history: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          annual_inflation_ipc?: Json;
          annual_market_growth?: Json;
          base_smlmv?: number;
          discount_rate_wacc?: number;
          receivable_days?: number;
          payable_days?: number;
          inventory_days?: number;
          tax_rate_history?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          project_id?: string;
          annual_inflation_ipc?: Json;
          annual_market_growth?: Json;
          base_smlmv?: number;
          discount_rate_wacc?: number;
          receivable_days?: number;
          payable_days?: number;
          inventory_days?: number;
          tax_rate_history?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "financial_assumptions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: true;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      revenue_streams: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          unit_price: number;
          initial_quantity: number;
          growth_rate: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          unit_price?: number;
          initial_quantity?: number;
          growth_rate?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          unit_price?: number;
          initial_quantity?: number;
          growth_rate?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "revenue_streams_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      labor_positions: {
        Row: {
          id: string;
          project_id: string;
          role_name: string;
          headcount: number;
          base_monthly_salary: number;
          has_transport_allowance: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          role_name: string;
          headcount?: number;
          base_monthly_salary?: number;
          has_transport_allowance?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          role_name?: string;
          headcount?: number;
          base_monthly_salary?: number;
          has_transport_allowance?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "labor_positions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      direct_costs: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          monthly_amount: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          monthly_amount?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          monthly_amount?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "direct_costs_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      operating_expenses: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          monthly_amount: number;
          category: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          monthly_amount?: number;
          category?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          monthly_amount?: number;
          category?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "operating_expenses_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      capex_investments: {
        Row: {
          id: string;
          project_id: string;
          asset_name: string;
          category: string;
          cost: number;
          useful_life_years: number;
          salvage_value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          asset_name: string;
          category?: string;
          cost?: number;
          useful_life_years?: number;
          salvage_value?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          asset_name?: string;
          category?: string;
          cost?: number;
          useful_life_years?: number;
          salvage_value?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "capex_investments_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      market_competitors: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          scores: Json;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          scores?: Json;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          scores?: Json;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "market_competitors_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      risk_items: {
        Row: {
          id: string;
          project_id: string;
          process: string;
          objective: string | null;
          risk_description: string;
          probability: number;
          impact: number;
          severity: number;
          control_description: string | null;
          what_controls: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          process: string;
          objective?: string | null;
          risk_description: string;
          probability?: number;
          impact?: number;
          severity?: number;
          control_description?: string | null;
          what_controls?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          process?: string;
          objective?: string | null;
          risk_description?: string;
          probability?: number;
          impact?: number;
          severity?: number;
          control_description?: string | null;
          what_controls?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "risk_items_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      environmental_impacts: {
        Row: {
          id: string;
          project_id: string;
          component: string;
          element: string;
          impact_name: string;
          intensity_u: number;
          extension_ex: number;
          moment_mo: number;
          persistence_pe: number;
          reversibility_rv: number;
          recoverability_mc: number;
          effect_ef: number;
          periodicity_pr: number;
          character_sign: number;
          importance_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          component: string;
          element: string;
          impact_name: string;
          intensity_u?: number;
          extension_ex?: number;
          moment_mo?: number;
          persistence_pe?: number;
          reversibility_rv?: number;
          recoverability_mc?: number;
          effect_ef?: number;
          periodicity_pr?: number;
          character_sign?: number;
          importance_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          component?: string;
          element?: string;
          impact_name?: string;
          intensity_u?: number;
          extension_ex?: number;
          moment_mo?: number;
          persistence_pe?: number;
          reversibility_rv?: number;
          recoverability_mc?: number;
          effect_ef?: number;
          periodicity_pr?: number;
          character_sign?: number;
          importance_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "environmental_impacts_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      scenarios: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          variable_overrides: Json;
          result_cache: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          variable_overrides?: Json;
          result_cache?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          variable_overrides?: Json;
          result_cache?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "scenarios_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_superadmin: {
        Args: {
          user_id?: string;
        };
        Returns: boolean;
      };
      has_role: {
        Args: {
          user_id: string;
          required_role: UserRole;
        };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Helper utility types for domain models
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
