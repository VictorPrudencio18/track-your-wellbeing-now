
import { motion } from 'framer-motion';
import { HealthDashboard } from '@/components/health/HealthDashboard';
import { DailyHistoryCarousel } from '@/components/health/DailyHistoryCarousel';
import { DailyCheckinManager } from '@/components/health/DailyCheckinManager';
import { CategorizedCheckinsCarousel } from '@/components/health/CategorizedCheckinsCarousel';

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-accent-orange to-white bg-clip-text text-transparent">
            Saúde & Bem-estar
          </h1>
          <p className="text-navy-400 text-lg max-w-2xl mx-auto">
            Monitore e melhore sua saúde com insights personalizados e check-ins inteligentes
          </p>
        </motion.div>

        {/* Check-ins Categorizados - Nova seção principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CategorizedCheckinsCarousel />
        </motion.div>

        {/* Dashboard de Saúde */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HealthDashboard />
        </motion.div>

        {/* Histórico de Atividades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <DailyHistoryCarousel />
        </motion.div>

        {/* Check-in Manager (sistema original mantido para compatibilidade) */}
        <DailyCheckinManager />
      </div>
    </div>
  );
}
