
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContentPost {
  id: string;
  title: string;
  description: string | null;
  category: string;
  read_time: string;
  publish_date: string;
  author_name: string;
  author_avatar: string;
  image_url: string | null;
  gradient_class: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useContentPosts() {
  return useQuery({
    queryKey: ['content-posts'],
    queryFn: async () => {
      console.log('Fetching content posts...');
      const { data, error } = await supabase
        .from('content_posts')
        .select('*')
        .eq('is_published', true)
        .order('publish_date', { ascending: false });

      if (error) {
        console.error('Error fetching content posts:', error);
        throw error;
      }
      
      console.log('Content posts fetched:', data);
      return data as ContentPost[];
    },
    retry: 3,
  });
}
