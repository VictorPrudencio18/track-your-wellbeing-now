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
