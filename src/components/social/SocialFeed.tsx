
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Heart } from 'lucide-react';

export function SocialFeed() {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-accent-orange" />
          Feed Social
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card border-navy-600/20 bg-navy-800/20 p-4 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-orange/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent-orange" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Usuário {index + 1}</h4>
                  <p className="text-navy-400 text-sm mt-1">
                    Completou uma corrida de 5km em 25 minutos!
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <button className="flex items-center gap-1 text-navy-400 hover:text-red-400 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">12</span>
                    </button>
                    <button className="flex items-center gap-1 text-navy-400 hover:text-blue-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">3</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
