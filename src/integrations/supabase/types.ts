export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          badge_color: string | null
          badge_icon: string | null
          created_at: string | null
          criteria: Json
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          points_reward: number | null
          rarity: string | null
        }
        Insert: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          badge_color?: string | null
          badge_icon?: string | null
          created_at?: string | null
          criteria: Json
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points_reward?: number | null
          rarity?: string | null
        }
        Update: {
          achievement_type?: Database["public"]["Enums"]["achievement_type"]
          badge_color?: string | null
          badge_icon?: string | null
          created_at?: string | null
          criteria?: Json
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_reward?: number | null
          rarity?: string | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          avg_heart_rate: number | null
          calories: number | null
          completed_at: string | null
          created_at: string | null
          difficulty_level: number | null
          distance: number | null
          duration: number
          elevation_gain: number | null
          equipment: Json | null
          gps_data: Json | null
          id: string
          max_heart_rate: number | null
          name: string | null
          notes: string | null
          pace: number | null
          performance_zones: Json | null
          points_earned: number | null
          route_data: Json | null
          route_summary: Json | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_at: string | null
          user_id: string | null
          weather_conditions: Json | null
          weather_data: Json | null
        }
        Insert: {
          avg_heart_rate?: number | null
          calories?: number | null
          completed_at?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          distance?: number | null
          duration: number
          elevation_gain?: number | null
          equipment?: Json | null
          gps_data?: Json | null
          id?: string
          max_heart_rate?: number | null
          name?: string | null
          notes?: string | null
          pace?: number | null
          performance_zones?: Json | null
          points_earned?: number | null
          route_data?: Json | null
          route_summary?: Json | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
          user_id?: string | null
          weather_conditions?: Json | null
          weather_data?: Json | null
        }
        Update: {
          avg_heart_rate?: number | null
          calories?: number | null
          completed_at?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          distance?: number | null
          duration?: number
          elevation_gain?: number | null
          equipment?: Json | null
          gps_data?: Json | null
          id?: string
          max_heart_rate?: number | null
          name?: string | null
          notes?: string | null
          pace?: number | null
          performance_zones?: Json | null
          points_earned?: number | null
          route_data?: Json | null
          route_summary?: Json | null
          type?: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
          user_id?: string | null
          weather_conditions?: Json | null
          weather_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_gps_points: {
        Row: {
          accuracy: number | null
          activity_id: string
          altitude: number | null
          created_at: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string
        }
        Insert: {
          accuracy?: number | null
          activity_id: string
          altitude?: number | null
          created_at?: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          timestamp: string
        }
        Update: {
          accuracy?: number | null
          activity_id?: string
          altitude?: number | null
          created_at?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_gps_points_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_metrics: {
        Row: {
          activity_id: string
          cadence: number | null
          calories_total: number | null
          created_at: string
          distance_total: number | null
          elevation_total: number | null
          heart_rate: number | null
          id: string
          pace: number | null
          power: number | null
          speed: number | null
          temperature: number | null
          timestamp: string
        }
        Insert: {
          activity_id: string
          cadence?: number | null
          calories_total?: number | null
          created_at?: string
          distance_total?: number | null
          elevation_total?: number | null
          heart_rate?: number | null
          id?: string
          pace?: number | null
          power?: number | null
          speed?: number | null
          temperature?: number | null
          timestamp: string
        }
        Update: {
          activity_id?: string
          cadence?: number | null
          calories_total?: number | null
          created_at?: string
          distance_total?: number | null
          elevation_total?: number | null
          heart_rate?: number | null
          id?: string
          pace?: number | null
          power?: number | null
          speed?: number | null
          temperature?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_metrics_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_segments: {
        Row: {
          activity_id: string
          avg_pace: number | null
          avg_speed: number | null
          created_at: string
          distance: number | null
          duration: number | null
          elevation_gain: number | null
          elevation_loss: number | null
          end_point_id: string | null
          id: string
          max_speed: number | null
          segment_type: string
          start_point_id: string | null
        }
        Insert: {
          activity_id: string
          avg_pace?: number | null
          avg_speed?: number | null
          created_at?: string
          distance?: number | null
          duration?: number | null
          elevation_gain?: number | null
          elevation_loss?: number | null
          end_point_id?: string | null
          id?: string
          max_speed?: number | null
          segment_type: string
          start_point_id?: string | null
        }
        Update: {
          activity_id?: string
          avg_pace?: number | null
          avg_speed?: number | null
          created_at?: string
          distance?: number | null
          duration?: number | null
          elevation_gain?: number | null
          elevation_loss?: number | null
          end_point_id?: string | null
          id?: string
          max_speed?: number | null
          segment_type?: string
          start_point_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_segments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_segments_end_point_id_fkey"
            columns: ["end_point_id"]
            isOneToOne: false
            referencedRelation: "activity_gps_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_segments_start_point_id_fkey"
            columns: ["start_point_id"]
            isOneToOne: false
            referencedRelation: "activity_gps_points"
            referencedColumns: ["id"]
          },
        ]
      }
      advanced_health_metrics: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          measurement_date: string | null
          metric_category: string
          metric_name: string
          time_of_day: string | null
          trends: Json | null
          unit: string | null
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          measurement_date?: string | null
          metric_category: string
          metric_name: string
          time_of_day?: string | null
          trends?: Json | null
          unit?: string | null
          updated_at?: string | null
          user_id: string
          value: number
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          measurement_date?: string | null
          metric_category?: string
          metric_name?: string
          time_of_day?: string | null
          trends?: Json | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      assessment_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          weight?: number | null
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          category_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          options: Json | null
          question_key: string
          question_text: string
          question_type: string
          scoring_weight: number | null
          validation_rules: Json | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          options?: Json | null
          question_key: string
          question_text: string
          question_type: string
          scoring_weight?: number | null
          validation_rules?: Json | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          options?: Json | null
          question_key?: string
          question_text?: string
          question_type?: string
          scoring_weight?: number | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "assessment_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          created_by: string | null
          criteria: Json
          description: string | null
          end_date: string
          id: string
          is_premium: boolean | null
          max_participants: number | null
          points_reward: number | null
          start_date: string
          status: Database["public"]["Enums"]["challenge_status"] | null
          title: string
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          criteria: Json
          description?: string | null
          end_date: string
          id?: string
          is_premium?: boolean | null
          max_participants?: number | null
          points_reward?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["challenge_status"] | null
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          criteria?: Json
          description?: string | null
          end_date?: string
          id?: string
          is_premium?: boolean | null
          max_participants?: number | null
          points_reward?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["challenge_status"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checkin_prompts: {
        Row: {
          category: string | null
          conditions: Json | null
          context_triggers: string[] | null
          created_at: string
          frequency: string | null
          id: string
          is_active: boolean | null
          options: Json | null
          priority: number | null
          prompt_key: string
          question: string
          response_type: string
          scoring_weight: number | null
          subcategory: string | null
          time_ranges: string[] | null
        }
        Insert: {
          category?: string | null
          conditions?: Json | null
          context_triggers?: string[] | null
          created_at?: string
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          priority?: number | null
          prompt_key: string
          question: string
          response_type: string
          scoring_weight?: number | null
          subcategory?: string | null
          time_ranges?: string[] | null
        }
        Update: {
          category?: string | null
          conditions?: Json | null
          context_triggers?: string[] | null
          created_at?: string
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          priority?: number | null
          prompt_key?: string
          question?: string
          response_type?: string
          scoring_weight?: number | null
          subcategory?: string | null
          time_ranges?: string[] | null
        }
        Relationships: []
      }
      daily_checkin_responses: {
        Row: {
          category: string
          category_score: number | null
          checkin_date: string | null
          id: string
          prompt_key: string
          responded_at: string | null
          response_value: Json
          subcategory: string | null
          user_id: string
        }
        Insert: {
          category: string
          category_score?: number | null
          checkin_date?: string | null
          id?: string
          prompt_key: string
          responded_at?: string | null
          response_value: Json
          subcategory?: string | null
          user_id: string
        }
        Update: {
          category?: string
          category_score?: number | null
          checkin_date?: string | null
          id?: string
          prompt_key?: string
          responded_at?: string | null
          response_value?: Json
          subcategory?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_goal_progress: {
        Row: {
          activities_count: number | null
          created_at: string | null
          cumulative_value: number | null
          daily_value: number | null
          id: string
          mood_after_progress: number | null
          notes: string | null
          progress_date: string
          updated_at: string | null
          user_id: string
          weekly_goal_id: string
        }
        Insert: {
          activities_count?: number | null
          created_at?: string | null
          cumulative_value?: number | null
          daily_value?: number | null
          id?: string
          mood_after_progress?: number | null
          notes?: string | null
          progress_date: string
          updated_at?: string | null
          user_id: string
          weekly_goal_id: string
        }
        Update: {
          activities_count?: number | null
          created_at?: string | null
          cumulative_value?: number | null
          daily_value?: number | null
          id?: string
          mood_after_progress?: number | null
          notes?: string | null
          progress_date?: string
          updated_at?: string | null
          user_id?: string
          weekly_goal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_goal_progress_weekly_goal_id_fkey"
            columns: ["weekly_goal_id"]
            isOneToOne: false
            referencedRelation: "weekly_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_health_checkins: {
        Row: {
          ate_healthy: boolean | null
          checkin_date: string
          created_at: string
          energy_level: number | null
          exercise_completed: boolean | null
          exercise_planned: boolean | null
          exercise_type: string | null
          had_dinner: boolean | null
          had_lunch: boolean | null
          hydration_glasses: number | null
          id: string
          mood_rating: number | null
          notes: string | null
          sleep_hours: number | null
          sleep_quality: number | null
          stress_level: number | null
          updated_at: string
          user_id: string
          wellness_score: number | null
          work_satisfaction: number | null
        }
        Insert: {
          ate_healthy?: boolean | null
          checkin_date?: string
          created_at?: string
          energy_level?: number | null
          exercise_completed?: boolean | null
          exercise_planned?: boolean | null
          exercise_type?: string | null
          had_dinner?: boolean | null
          had_lunch?: boolean | null
          hydration_glasses?: number | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id: string
          wellness_score?: number | null
          work_satisfaction?: number | null
        }
        Update: {
          ate_healthy?: boolean | null
          checkin_date?: string
          created_at?: string
          energy_level?: number | null
          exercise_completed?: boolean | null
          exercise_planned?: boolean | null
          exercise_type?: string | null
          had_dinner?: boolean | null
          had_lunch?: boolean | null
          hydration_glasses?: number | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id?: string
          wellness_score?: number | null
          work_satisfaction?: number | null
        }
        Relationships: []
      }
      device_integrations: {
        Row: {
          created_at: string | null
          data_types: Json | null
          device_brand: string | null
          device_model: string | null
          device_type: string
          id: string
          integration_status: string | null
          last_sync_at: string | null
          settings: Json | null
          sync_frequency: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_types?: Json | null
          device_brand?: string | null
          device_model?: string | null
          device_type: string
          id?: string
          integration_status?: string | null
          last_sync_at?: string | null
          settings?: Json | null
          sync_frequency?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_types?: Json | null
          device_brand?: string | null
          device_model?: string | null
          device_type?: string
          id?: string
          integration_status?: string | null
          last_sync_at?: string | null
          settings?: Json | null
          sync_frequency?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string | null
          created_at: string | null
          id: string
          requester_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          addressee_id?: string | null
          created_at?: string | null
          id?: string
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          addressee_id?: string | null
          created_at?: string | null
          id?: string
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_recommendations: {
        Row: {
          applied_at: string | null
          based_on_data: Json | null
          confidence_score: number | null
          created_at: string | null
          id: string
          reasoning: string | null
          recommended_description: string | null
          recommended_goal_type: Database["public"]["Enums"]["goal_type"]
          recommended_target_value: number
          recommended_title: string
          recommended_unit: string
          status: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          based_on_data?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          reasoning?: string | null
          recommended_description?: string | null
          recommended_goal_type: Database["public"]["Enums"]["goal_type"]
          recommended_target_value: number
          recommended_title: string
          recommended_unit: string
          status?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          based_on_data?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          reasoning?: string | null
          recommended_description?: string | null
          recommended_goal_type?: Database["public"]["Enums"]["goal_type"]
          recommended_target_value?: number
          recommended_title?: string
          recommended_unit?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          description: string | null
          goal_type: Database["public"]["Enums"]["goal_type"]
          id: string
          is_active: boolean | null
          is_completed: boolean | null
          progress_data: Json | null
          target_date: string | null
          target_value: number
          title: string
          unit: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type: Database["public"]["Enums"]["goal_type"]
          id?: string
          is_active?: boolean | null
          is_completed?: boolean | null
          progress_data?: Json | null
          target_date?: string | null
          target_value: number
          title: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          is_active?: boolean | null
          is_completed?: boolean | null
          progress_data?: Json | null
          target_date?: string | null
          target_value?: number
          title?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          goal_category: string
          goal_description: string | null
          goal_title: string
          id: string
          is_active: boolean | null
          milestones: Json | null
          priority: number | null
          progress_tracking: Json | null
          rewards: Json | null
          target_date: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          goal_category: string
          goal_description?: string | null
          goal_title: string
          id?: string
          is_active?: boolean | null
          milestones?: Json | null
          priority?: number | null
          progress_tracking?: Json | null
          rewards?: Json | null
          target_date?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          goal_category?: string
          goal_description?: string | null
          goal_title?: string
          id?: string
          is_active?: boolean | null
          milestones?: Json | null
          priority?: number | null
          progress_tracking?: Json | null
          rewards?: Json | null
          target_date?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_insights: {
        Row: {
          actionable_steps: Json | null
          category: string
          confidence_score: number | null
          content: string
          created_at: string | null
          data_sources: Json | null
          id: string
          insight_type: string
          is_archived: boolean | null
          is_read: boolean | null
          severity: string | null
          title: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          actionable_steps?: Json | null
          category: string
          confidence_score?: number | null
          content: string
          created_at?: string | null
          data_sources?: Json | null
          id?: string
          insight_type: string
          is_archived?: boolean | null
          is_read?: boolean | null
          severity?: string | null
          title: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          actionable_steps?: Json | null
          category?: string
          confidence_score?: number | null
          content?: string
          created_at?: string | null
          data_sources?: Json | null
          id?: string
          insight_type?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          severity?: string | null
          title?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          additional_data: Json | null
          created_at: string | null
          device_info: Json | null
          id: string
          metric_type: string
          recorded_at: string | null
          source: string | null
          sync_status: string | null
          unit: string | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          metric_type: string
          recorded_at?: string | null
          source?: string | null
          sync_status?: string | null
          unit?: string | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          additional_data?: Json | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          metric_type?: string
          recorded_at?: string | null
          source?: string | null
          sync_status?: string | null
          unit?: string | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_logs: {
        Row: {
          created_at: string | null
          foods: Json | null
          id: string
          macros: Json | null
          meal_name: string | null
          meal_time: string | null
          meal_type: string
          notes: string | null
          nutrition_plan_id: string | null
          photos: Json | null
          satisfaction_rating: number | null
          total_calories: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          foods?: Json | null
          id?: string
          macros?: Json | null
          meal_name?: string | null
          meal_time?: string | null
          meal_type: string
          notes?: string | null
          nutrition_plan_id?: string | null
          photos?: Json | null
          satisfaction_rating?: number | null
          total_calories?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          foods?: Json | null
          id?: string
          macros?: Json | null
          meal_name?: string | null
          meal_time?: string | null
          meal_type?: string
          notes?: string | null
          nutrition_plan_id?: string | null
          photos?: Json | null
          satisfaction_rating?: number | null
          total_calories?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_nutrition_plan_id_fkey"
            columns: ["nutrition_plan_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          appointment_date: string | null
          attachments: Json | null
          created_at: string | null
          description: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          healthcare_provider: string | null
          id: string
          privacy_level: string | null
          record_type: string
          results: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_date?: string | null
          attachments?: Json | null
          created_at?: string | null
          description?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          healthcare_provider?: string | null
          id?: string
          privacy_level?: string | null
          record_type: string
          results?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string | null
          attachments?: Json | null
          created_at?: string | null
          description?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          healthcare_provider?: string | null
          id?: string
          privacy_level?: string | null
          record_type?: string
          results?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      micro_checkins: {
        Row: {
          checkin_type: string
          context: Json | null
          created_at: string
          id: string
          max_value: number | null
          metric_key: string
          recorded_at: string
          session_id: string | null
          user_id: string
          value: number
        }
        Insert: {
          checkin_type: string
          context?: Json | null
          created_at?: string
          id?: string
          max_value?: number | null
          metric_key: string
          recorded_at?: string
          session_id?: string | null
          user_id: string
          value: number
        }
        Update: {
          checkin_type?: string
          context?: Json | null
          created_at?: string
          id?: string
          max_value?: number | null
          metric_key?: string
          recorded_at?: string
          session_id?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          frequency_hours: number | null
          id: string
          is_enabled: boolean | null
          last_shown_at: string | null
          metric_key: string
          preferred_times: string[] | null
          snooze_until: string | null
          total_dismissals: number | null
          total_responses: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency_hours?: number | null
          id?: string
          is_enabled?: boolean | null
          last_shown_at?: string | null
          metric_key: string
          preferred_times?: string[] | null
          snooze_until?: string | null
          total_dismissals?: number | null
          total_responses?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency_hours?: number | null
          id?: string
          is_enabled?: boolean | null
          last_shown_at?: string | null
          metric_key?: string
          preferred_times?: string[] | null
          snooze_until?: string | null
          total_dismissals?: number | null
          total_responses?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      nutrition_plans: {
        Row: {
          calorie_target: number | null
          created_at: string | null
          created_by_nutritionist: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          macros_target: Json | null
          meal_schedule: Json | null
          plan_name: string
          plan_type: string | null
          restrictions: Json | null
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calorie_target?: number | null
          created_at?: string | null
          created_by_nutritionist?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          macros_target?: Json | null
          meal_schedule?: Json | null
          plan_name: string
          plan_type?: string | null
          restrictions?: Json | null
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calorie_target?: number | null
          created_at?: string | null
          created_by_nutritionist?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          macros_target?: Json | null
          meal_schedule?: Json | null
          plan_name?: string
          plan_type?: string | null
          restrictions?: Json | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      offline_cache: {
        Row: {
          cache_data: Json
          cache_key: string
          created_at: string | null
          expires_at: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cache_data: Json
          cache_key: string
          created_at?: string | null
          expires_at: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cache_data?: Json
          cache_key?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          completed_steps: Json | null
          current_step: number | null
          data_snapshot: Json | null
          id: string
          is_completed: boolean | null
          last_active_at: string | null
          started_at: string | null
          total_steps: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: Json | null
          current_step?: number | null
          data_snapshot?: Json | null
          id?: string
          is_completed?: boolean | null
          last_active_at?: string | null
          started_at?: string | null
          total_steps?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_steps?: Json | null
          current_step?: number | null
          data_snapshot?: Json | null
          id?: string
          is_completed?: boolean | null
          last_active_at?: string | null
          started_at?: string | null
          total_steps?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          data_version: number | null
          full_name: string | null
          gender: string | null
          height: number | null
          id: string
          is_premium: boolean | null
          last_backup_at: string | null
          notification_settings: Json | null
          onboarding_completed: boolean | null
          preferences: Json | null
          privacy_settings: Json | null
          timezone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          data_version?: number | null
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id: string
          is_premium?: boolean | null
          last_backup_at?: string | null
          notification_settings?: Json | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          privacy_settings?: Json | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          data_version?: number | null
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          is_premium?: boolean | null
          last_backup_at?: string | null
          notification_settings?: Json | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          privacy_settings?: Json | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      sleep_correlations: {
        Row: {
          confidence_score: number | null
          correlation_coefficient: number | null
          created_at: string | null
          factor_name: string
          factor_type: string
          id: string
          impact_level: string | null
          insights: Json | null
          last_calculated: string | null
          sample_size: number | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          correlation_coefficient?: number | null
          created_at?: string | null
          factor_name: string
          factor_type: string
          id?: string
          impact_level?: string | null
          insights?: Json | null
          last_calculated?: string | null
          sample_size?: number | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          correlation_coefficient?: number | null
          created_at?: string | null
          factor_name?: string
          factor_type?: string
          id?: string
          impact_level?: string | null
          insights?: Json | null
          last_calculated?: string | null
          sample_size?: number | null
          user_id?: string
        }
        Relationships: []
      }
      sleep_goals: {
        Row: {
          consistency_goal: number | null
          created_at: string
          id: string
          is_active: boolean | null
          quality_goal: number | null
          target_bedtime: string
          target_duration: number
          target_wake_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consistency_goal?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          quality_goal?: number | null
          target_bedtime: string
          target_duration: number
          target_wake_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consistency_goal?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          quality_goal?: number | null
          target_bedtime?: string
          target_duration?: number
          target_wake_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_insights: {
        Row: {
          created_at: string
          data_points: Json | null
          description: string
          expires_at: string | null
          id: string
          insight_date: string
          insight_type: string
          is_read: boolean | null
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_points?: Json | null
          description: string
          expires_at?: string | null
          id?: string
          insight_date?: string
          insight_type: string
          is_read?: boolean | null
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_points?: Json | null
          description?: string
          expires_at?: string | null
          id?: string
          insight_date?: string
          insight_type?: string
          is_read?: boolean | null
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_journal: {
        Row: {
          alcohol_consumption: boolean | null
          bedtime_routine_followed: boolean | null
          caffeine_intake_time: string | null
          created_at: string | null
          dreams_description: string | null
          dreams_quality: number | null
          exercise_timing: string | null
          factors_affecting_sleep: string[] | null
          gratitude_notes: string | null
          id: string
          mood_after_sleep: number | null
          mood_before_sleep: number | null
          pre_sleep_activities: string[] | null
          screen_time_before_bed: number | null
          sleep_date: string
          sleep_environment_rating: number | null
          stress_events: string[] | null
          supplements_taken: string[] | null
          tomorrow_priorities: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alcohol_consumption?: boolean | null
          bedtime_routine_followed?: boolean | null
          caffeine_intake_time?: string | null
          created_at?: string | null
          dreams_description?: string | null
          dreams_quality?: number | null
          exercise_timing?: string | null
          factors_affecting_sleep?: string[] | null
          gratitude_notes?: string | null
          id?: string
          mood_after_sleep?: number | null
          mood_before_sleep?: number | null
          pre_sleep_activities?: string[] | null
          screen_time_before_bed?: number | null
          sleep_date: string
          sleep_environment_rating?: number | null
          stress_events?: string[] | null
          supplements_taken?: string[] | null
          tomorrow_priorities?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alcohol_consumption?: boolean | null
          bedtime_routine_followed?: boolean | null
          caffeine_intake_time?: string | null
          created_at?: string | null
          dreams_description?: string | null
          dreams_quality?: number | null
          exercise_timing?: string | null
          factors_affecting_sleep?: string[] | null
          gratitude_notes?: string | null
          id?: string
          mood_after_sleep?: number | null
          mood_before_sleep?: number | null
          pre_sleep_activities?: string[] | null
          screen_time_before_bed?: number | null
          sleep_date?: string
          sleep_environment_rating?: number | null
          stress_events?: string[] | null
          supplements_taken?: string[] | null
          tomorrow_priorities?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sleep_recommendations: {
        Row: {
          based_on_data: Json | null
          confidence_score: number | null
          created_at: string | null
          description: string
          expected_improvement: number | null
          expires_at: string | null
          id: string
          priority: number | null
          recommendation_type: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          based_on_data?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          description: string
          expected_improvement?: number | null
          expires_at?: string | null
          id?: string
          priority?: number | null
          recommendation_type: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          based_on_data?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          expected_improvement?: number | null
          expires_at?: string | null
          id?: string
          priority?: number | null
          recommendation_type?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sleep_records: {
        Row: {
          awake_duration: number | null
          bedtime: string | null
          calculated_scores: Json | null
          comfort_level: number | null
          created_at: string
          deep_sleep_duration: number | null
          environmental_factors: Json | null
          id: string
          insomnia_indicators: Json | null
          lifestyle_factors: Json | null
          light_level: number | null
          light_sleep_duration: number | null
          noise_level: number | null
          notes: string | null
          rem_sleep_duration: number | null
          room_temperature: number | null
          sleep_date: string
          sleep_debt: number | null
          sleep_duration: number | null
          sleep_efficiency: number | null
          sleep_latency: number | null
          sleep_score: number | null
          subjective_quality: number | null
          updated_at: string
          user_id: string
          wake_count: number | null
          wake_time: string | null
        }
        Insert: {
          awake_duration?: number | null
          bedtime?: string | null
          calculated_scores?: Json | null
          comfort_level?: number | null
          created_at?: string
          deep_sleep_duration?: number | null
          environmental_factors?: Json | null
          id?: string
          insomnia_indicators?: Json | null
          lifestyle_factors?: Json | null
          light_level?: number | null
          light_sleep_duration?: number | null
          noise_level?: number | null
          notes?: string | null
          rem_sleep_duration?: number | null
          room_temperature?: number | null
          sleep_date: string
          sleep_debt?: number | null
          sleep_duration?: number | null
          sleep_efficiency?: number | null
          sleep_latency?: number | null
          sleep_score?: number | null
          subjective_quality?: number | null
          updated_at?: string
          user_id: string
          wake_count?: number | null
          wake_time?: string | null
        }
        Update: {
          awake_duration?: number | null
          bedtime?: string | null
          calculated_scores?: Json | null
          comfort_level?: number | null
          created_at?: string
          deep_sleep_duration?: number | null
          environmental_factors?: Json | null
          id?: string
          insomnia_indicators?: Json | null
          lifestyle_factors?: Json | null
          light_level?: number | null
          light_sleep_duration?: number | null
          noise_level?: number | null
          notes?: string | null
          rem_sleep_duration?: number | null
          room_temperature?: number | null
          sleep_date?: string
          sleep_debt?: number | null
          sleep_duration?: number | null
          sleep_efficiency?: number | null
          sleep_latency?: number | null
          sleep_score?: number | null
          subjective_quality?: number | null
          updated_at?: string
          user_id?: string
          wake_count?: number | null
          wake_time?: string | null
        }
        Relationships: []
      }
      sleep_sessions: {
        Row: {
          actual_duration: number | null
          audio_analysis: Json | null
          created_at: string | null
          heart_rate_data: Json | null
          id: string
          movement_data: Json | null
          session_end: string | null
          session_start: string | null
          session_status: string | null
          session_type: string | null
          sleep_phases: Json | null
          target_duration: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_duration?: number | null
          audio_analysis?: Json | null
          created_at?: string | null
          heart_rate_data?: Json | null
          id?: string
          movement_data?: Json | null
          session_end?: string | null
          session_start?: string | null
          session_status?: string | null
          session_type?: string | null
          sleep_phases?: Json | null
          target_duration?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_duration?: number | null
          audio_analysis?: Json | null
          created_at?: string | null
          heart_rate_data?: Json | null
          id?: string
          movement_data?: Json | null
          session_end?: string | null
          session_start?: string | null
          session_status?: string | null
          session_type?: string | null
          sleep_phases?: Json | null
          target_duration?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      smart_alarms: {
        Row: {
          alarm_sound: string | null
          alarm_time: string
          created_at: string | null
          days_of_week: number[] | null
          id: string
          is_active: boolean | null
          smart_window_minutes: number | null
          updated_at: string | null
          user_id: string
          vibration_enabled: boolean | null
        }
        Insert: {
          alarm_sound?: string | null
          alarm_time: string
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          smart_window_minutes?: number | null
          updated_at?: string | null
          user_id: string
          vibration_enabled?: boolean | null
        }
        Update: {
          alarm_sound?: string | null
          alarm_time?: string
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          smart_window_minutes?: number | null
          updated_at?: string | null
          user_id?: string
          vibration_enabled?: boolean | null
        }
        Relationships: []
      }
      social_feed: {
        Row: {
          activity_id: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string
          is_milestone: boolean | null
          likes_count: number | null
          media_urls: string[] | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          activity_id?: string | null
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_milestone?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          activity_id?: string | null
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_milestone?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_feed_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_feed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_interactions: {
        Row: {
          content: string | null
          created_at: string | null
          feed_id: string | null
          id: string
          interaction_type: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          feed_id?: string | null
          id?: string
          interaction_type: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          feed_id?: string | null
          id?: string
          interaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_interactions_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "social_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          id: string
          progress_data: Json | null
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          id?: string
          progress_data?: Json | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          id?: string
          progress_data?: Json | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_assessment_scores: {
        Row: {
          calculated_at: string | null
          calculation_metadata: Json | null
          category_name: string
          id: string
          score_value: number
          user_id: string | null
        }
        Insert: {
          calculated_at?: string | null
          calculation_metadata?: Json | null
          category_name: string
          id?: string
          score_value: number
          user_id?: string | null
        }
        Update: {
          calculated_at?: string | null
          calculation_metadata?: Json | null
          category_name?: string
          id?: string
          score_value?: number
          user_id?: string | null
        }
        Relationships: []
      }
      user_challenges: {
        Row: {
          challenge_id: string | null
          completed_at: string | null
          current_value: number | null
          id: string
          is_completed: boolean | null
          joined_at: string | null
          progress: number | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          current_value?: number | null
          id?: string
          is_completed?: boolean | null
          joined_at?: string | null
          progress?: number | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          current_value?: number | null
          id?: string
          is_completed?: boolean | null
          joined_at?: string | null
          progress?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_assessment: {
        Row: {
          category_name: string
          completed_at: string | null
          encrypted_data: string | null
          id: string
          question_key: string
          response_value: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category_name: string
          completed_at?: string | null
          encrypted_data?: string | null
          id?: string
          question_key: string
          response_value: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category_name?: string
          completed_at?: string | null
          encrypted_data?: string | null
          id?: string
          question_key?: string
          response_value?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_scores: {
        Row: {
          created_at: string | null
          current_level: number | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          month_start: string | null
          monthly_points: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string | null
          week_start: string | null
          weekly_points: number | null
        }
        Insert: {
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          month_start?: string | null
          monthly_points?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
          week_start?: string | null
          weekly_points?: number | null
        }
        Update: {
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          month_start?: string | null
          monthly_points?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
          week_start?: string | null
          weekly_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_goals: {
        Row: {
          auto_generated: boolean | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          current_value: number | null
          description: string | null
          difficulty_level: number | null
          goal_type: Database["public"]["Enums"]["goal_type"]
          id: string
          is_completed: boolean | null
          milestone_rewards: Json | null
          parent_goal_id: string | null
          priority: number | null
          target_value: number
          title: string
          tracking_data: Json | null
          unit: string
          updated_at: string | null
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          auto_generated?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          difficulty_level?: number | null
          goal_type: Database["public"]["Enums"]["goal_type"]
          id?: string
          is_completed?: boolean | null
          milestone_rewards?: Json | null
          parent_goal_id?: string | null
          priority?: number | null
          target_value: number
          title: string
          tracking_data?: Json | null
          unit: string
          updated_at?: string | null
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          auto_generated?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          difficulty_level?: number | null
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          is_completed?: boolean | null
          milestone_rewards?: Json | null
          parent_goal_id?: string | null
          priority?: number | null
          target_value?: number
          title?: string
          tracking_data?: Json | null
          unit?: string
          updated_at?: string | null
          user_id?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_goals_parent_goal_id_fkey"
            columns: ["parent_goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      wellness_scores: {
        Row: {
          calculation_date: string
          contributing_metrics: Json | null
          created_at: string
          id: string
          insights: Json | null
          max_score: number | null
          score_type: string
          score_value: number
          trend_30d: number | null
          trend_7d: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calculation_date?: string
          contributing_metrics?: Json | null
          created_at?: string
          id?: string
          insights?: Json | null
          max_score?: number | null
          score_type: string
          score_value?: number
          trend_30d?: number | null
          trend_7d?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calculation_date?: string
          contributing_metrics?: Json | null
          created_at?: string
          id?: string
          insights?: Json | null
          max_score?: number | null
          score_type?: string
          score_value?: number
          trend_30d?: number | null
          trend_7d?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string | null
          created_by_trainer: string | null
          description: string | null
          difficulty_level: number | null
          duration_weeks: number | null
          id: string
          is_active: boolean | null
          name: string
          progress_tracking: Json | null
          updated_at: string | null
          user_id: string
          workout_data: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by_trainer?: string | null
          description?: string | null
          difficulty_level?: number | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          progress_tracking?: Json | null
          updated_at?: string | null
          user_id: string
          workout_data?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by_trainer?: string | null
          description?: string | null
          difficulty_level?: number | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          progress_tracking?: Json | null
          updated_at?: string | null
          user_id?: string
          workout_data?: Json | null
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          created_at: string | null
          duration: number | null
          exercises: Json | null
          id: string
          intensity_level: number | null
          notes: string | null
          session_data: Json | null
          session_name: string
          user_id: string
          workout_plan_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration?: number | null
          exercises?: Json | null
          id?: string
          intensity_level?: number | null
          notes?: string | null
          session_data?: Json | null
          session_name: string
          user_id: string
          workout_plan_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration?: number | null
          exercises?: Json | null
          id?: string
          intensity_level?: number | null
          notes?: string | null
          session_data?: Json | null
          session_name?: string
          user_id?: string
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_activity_points: {
        Args: {
          activity_duration: number
          activity_distance?: number
          activity_calories?: number
          activity_type?: Database["public"]["Enums"]["activity_type"]
        }
        Returns: number
      }
      calculate_assessment_score: {
        Args: { p_user_id: string; p_category_name: string }
        Returns: number
      }
      calculate_category_score: {
        Args: { p_user_id: string; p_category: string; p_date?: string }
        Returns: number
      }
      calculate_overall_health_score: {
        Args: { p_user_id: string }
        Returns: number
      }
      calculate_sleep_efficiency: {
        Args: { p_sleep_duration: number; p_time_in_bed: number }
        Returns: number
      }
      calculate_sleep_score: {
        Args: {
          p_duration: number
          p_target_duration: number
          p_quality: number
          p_latency?: number
          p_wake_count?: number
          p_consistency_days?: number
        }
        Returns: number
      }
      calculate_weekly_goal_progress: {
        Args: {
          p_user_id: string
          p_weekly_goal_id: string
          p_week_start: string
          p_week_end: string
        }
        Returns: number
      }
      calculate_wellness_score: {
        Args: {
          sleep_qual: number
          stress_lvl: number
          energy_lvl: number
          mood_rat: number
          exercise_done: boolean
          hydration_glasses: number
        }
        Returns: number
      }
      calculate_wellness_scores: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      generate_goal_recommendations: {
        Args: { p_user_id: string }
        Returns: number
      }
      log_user_action: {
        Args: {
          action_type_param: string
          entity_type_param: string
          entity_id_param?: string
          details_param?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      achievement_type:
        | "streak"
        | "distance"
        | "calories"
        | "time"
        | "frequency"
        | "milestone"
      activity_type:
        | "running"
        | "cycling"
        | "swimming"
        | "walking"
        | "gym"
        | "yoga"
        | "dance"
        | "hiking"
        | "pilates"
        | "hits"
      challenge_status: "active" | "completed" | "expired" | "upcoming"
      goal_type:
        | "weight_loss"
        | "muscle_gain"
        | "endurance"
        | "strength"
        | "flexibility"
        | "wellness"
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
      achievement_type: [
        "streak",
        "distance",
        "calories",
        "time",
        "frequency",
        "milestone",
      ],
      activity_type: [
        "running",
        "cycling",
        "swimming",
        "walking",
        "gym",
        "yoga",
        "dance",
        "hiking",
        "pilates",
        "hits",
      ],
      challenge_status: ["active", "completed", "expired", "upcoming"],
      goal_type: [
        "weight_loss",
        "muscle_gain",
        "endurance",
        "strength",
        "flexibility",
        "wellness",
      ],
    },
  },
} as const
