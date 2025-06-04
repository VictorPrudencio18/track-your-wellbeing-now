
import { useQuery } from '@tanstack/react-query';

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

// Mock data until content_posts table is properly created and reflected in types
const mockContentPosts: ContentPost[] = [
  {
    id: '1',
    title: '5 Exercícios para Melhorar sua Saúde Mental',
    description: 'Descubra exercícios simples que podem transformar seu bem-estar emocional e reduzir o estresse do dia a dia.',
    category: 'Saúde Mental',
    read_time: '5 min',
    publish_date: '2024-06-04',
    author_name: 'Dr. Ana Silva',
    author_avatar: 'AS',
    image_url: null,
    gradient_class: 'from-purple-500/20 to-pink-500/20',
    is_published: true,
    created_at: '2024-06-04T10:00:00Z',
    updated_at: '2024-06-04T10:00:00Z'
  },
  {
    id: '2',
    title: 'Nutrição Inteligente: Alimentação Consciente',
    description: 'Aprenda a fazer escolhas alimentares que nutrem seu corpo e mente para uma vida mais equilibrada.',
    category: 'Nutrição',
    read_time: '7 min',
    publish_date: '2024-06-03',
    author_name: 'Nutri. Carlos Lima',
    author_avatar: 'CL',
    image_url: null,
    gradient_class: 'from-green-500/20 to-emerald-500/20',
    is_published: true,
    created_at: '2024-06-03T10:00:00Z',
    updated_at: '2024-06-03T10:00:00Z'
  },
  {
    id: '3',
    title: 'Sono Reparador: Técnicas para Dormir Melhor',
    description: 'Estratégias comprovadas para melhorar a qualidade do seu sono e acordar mais disposto todos os dias.',
    category: 'Bem-estar',
    read_time: '6 min',
    publish_date: '2024-06-02',
    author_name: 'Dr. Maria Santos',
    author_avatar: 'MS',
    image_url: null,
    gradient_class: 'from-blue-500/20 to-cyan-500/20',
    is_published: true,
    created_at: '2024-06-02T10:00:00Z',
    updated_at: '2024-06-02T10:00:00Z'
  },
  {
    id: '4',
    title: 'Mindfulness no Trabalho: Produtividade Consciente',
    description: 'Como aplicar técnicas de atenção plena no ambiente profissional para reduzir estresse e aumentar o foco.',
    category: 'Produtividade',
    read_time: '8 min',
    publish_date: '2024-06-01',
    author_name: 'Coach Roberto Dias',
    author_avatar: 'RD',
    image_url: null,
    gradient_class: 'from-orange-500/20 to-yellow-500/20',
    is_published: true,
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z'
  }
];

export function useContentPosts() {
  return useQuery({
    queryKey: ['content-posts'],
    queryFn: async () => {
      console.log('Fetching content posts...');
      
      // For now, return mock data until content_posts table is available
      // TODO: Replace with actual Supabase query when table is created and types updated
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      console.log('Content posts fetched:', mockContentPosts);
      return mockContentPosts;
    },
    retry: 3,
  });
}
