
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ContentPost {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  gradient: string;
}

const mockPosts: ContentPost[] = [
  {
    id: "1",
    title: "5 Exercícios para Melhorar sua Saúde Mental",
    description: "Descubra exercícios simples que podem transformar seu bem-estar emocional e reduzir o estresse do dia a dia.",
    category: "Saúde Mental",
    readTime: "5 min",
    publishDate: "2024-06-01",
    author: {
      name: "Dr. Ana Silva",
      avatar: "AS"
    },
    image: "/placeholder.svg",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: "2",
    title: "Nutrição Inteligente: Alimentação Consciente",
    description: "Aprenda a fazer escolhas alimentares que nutrem seu corpo e mente para uma vida mais equilibrada.",
    category: "Nutrição",
    readTime: "7 min",
    publishDate: "2024-05-28",
    author: {
      name: "Nutri. Carlos Lima",
      avatar: "CL"
    },
    image: "/placeholder.svg",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: "3",
    title: "Sono Reparador: Técnicas para Dormir Melhor",
    description: "Estratégias comprovadas para melhorar a qualidade do seu sono e acordar mais disposto todos os dias.",
    category: "Bem-estar",
    readTime: "6 min",
    publishDate: "2024-05-25",
    author: {
      name: "Dr. Maria Santos",
      avatar: "MS"
    },
    image: "/placeholder.svg",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: "4",
    title: "Mindfulness no Trabalho: Produtividade Consciente",
    description: "Como aplicar técnicas de atenção plena no ambiente profissional para reduzir estresse e aumentar o foco.",
    category: "Produtividade",
    readTime: "8 min",
    publishDate: "2024-05-22",
    author: {
      name: "Coach Roberto Dias",
      avatar: "RD"
    },
    image: "/placeholder.svg",
    gradient: "from-orange-500/20 to-yellow-500/20"
  }
];

export function ContentCarousel() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Saúde Mental': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Nutrição': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Bem-estar': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Produtividade': 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    };
    return colors[category as keyof typeof colors] || 'bg-navy-500/10 text-navy-400 border-navy-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Conteúdos Exclusivos
          </h2>
          <p className="text-navy-400">
            Artigos e dicas criados pelos nossos especialistas
          </p>
        </div>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {mockPosts.map((post, index) => (
            <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-navy-700/30 hover:border-accent-orange/30 transition-all duration-300 h-full group cursor-pointer">
                  <CardContent className="p-0">
                    <div className={`h-48 bg-gradient-to-br ${post.gradient} rounded-t-lg relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-navy-900/20" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-accent-orange transition-colors">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <p className="text-navy-300 text-sm line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent-orange/20 rounded-full flex items-center justify-center text-xs font-semibold text-accent-orange">
                            {post.author.avatar}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{post.author.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-navy-400 pt-2 border-t border-navy-700/30">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.publishDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="glass-card border-navy-700/30 text-white hover:bg-accent-orange/20 hover:border-accent-orange/40" />
        <CarouselNext className="glass-card border-navy-700/30 text-white hover:bg-accent-orange/20 hover:border-accent-orange/40" />
      </Carousel>
    </motion.div>
  );
}
