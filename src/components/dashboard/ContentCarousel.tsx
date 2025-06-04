
import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useContentPosts } from "@/hooks/useSupabaseContent";

export function ContentCarousel() {
  const { data: posts, isLoading, error } = useContentPosts();

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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="space-y-4 sm:space-y-6"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
            Conteúdos Exclusivos
          </h2>
          <p className="text-sm sm:text-base text-navy-400">
            Artigos e dicas criados pelos nossos especialistas
          </p>
        </div>
        <Alert className="glass-card border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-white">
            Erro ao carregar conteúdos. Tente atualizar a página.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="space-y-4 sm:space-y-6"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
            Conteúdos Exclusivos
          </h2>
          <p className="text-sm sm:text-base text-navy-400">
            Artigos e dicas criados pelos nossos especialistas
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="animate-pulse">
                <div className="h-32 bg-navy-700/30 rounded-xl mb-4"></div>
                <div className="h-4 bg-navy-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-navy-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="space-y-4 sm:space-y-6"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
            Conteúdos Exclusivos
          </h2>
          <p className="text-sm sm:text-base text-navy-400">
            Artigos e dicas criados pelos nossos especialistas
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-navy-400 text-sm">
            Nenhum conteúdo disponível no momento.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
            Conteúdos Exclusivos
          </h2>
          <p className="text-sm sm:text-base text-navy-400">
            Artigos e dicas criados pelos nossos especialistas
          </p>
        </div>
      </div>

      <div className="relative">
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {posts.map((post, index) => (
              <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2 xl:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="glass-card border-navy-700/30 hover:border-accent-orange/30 transition-all duration-300 h-full group cursor-pointer">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className={`h-32 sm:h-40 lg:h-48 bg-gradient-to-br ${post.gradient_class || 'from-blue-500/20 to-cyan-500/20'} rounded-t-lg relative overflow-hidden flex-shrink-0`}>
                        <div className="absolute inset-0 bg-navy-900/20" />
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                          <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg line-clamp-2 group-hover:text-accent-orange transition-colors leading-tight">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 flex flex-col">
                        <p className="text-navy-300 text-xs sm:text-sm line-clamp-3 leading-relaxed flex-1">
                          {post.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent-orange/20 rounded-full flex items-center justify-center text-xs font-semibold text-accent-orange flex-shrink-0">
                              {post.author_avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-xs sm:text-sm font-medium truncate">{post.author_name}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-navy-400 pt-2 border-t border-navy-700/30">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="text-xs">{formatDate(post.publish_date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{post.read_time}</span>
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
          
          {/* Navigation buttons - hidden on small screens */}
          <div className="hidden sm:block">
            <CarouselPrevious className="glass-card border-navy-700/30 text-white hover:bg-accent-orange/20 hover:border-accent-orange/40 -left-6 lg:-left-12 w-10 h-10 lg:w-12 lg:h-12" />
            <CarouselNext className="glass-card border-navy-700/30 text-white hover:bg-accent-orange/20 hover:border-accent-orange/40 -right-6 lg:-right-12 w-10 h-10 lg:w-12 lg:h-12" />
          </div>
        </Carousel>
        
        {/* Mobile navigation dots - visible only on small screens */}
        <div className="sm:hidden flex justify-center mt-4 gap-2">
          {posts.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-navy-600/50"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
