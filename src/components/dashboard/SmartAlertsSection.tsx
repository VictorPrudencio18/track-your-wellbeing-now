
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  Award, 
  Lightbulb, 
  Clock,
  X,
  ExternalLink
} from 'lucide-react';
import { useSmartAlerts } from '@/hooks/useSmartAlerts';
import { Link } from 'react-router-dom';

export function SmartAlertsSection() {
  const { data: alerts, isLoading, error } = useSmartAlerts();
  const [dismissedAlerts, setDismissedAlerts] = React.useState<string[]>([]);

  if (isLoading) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-navy-700 rounded w-1/2 mb-4"></div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-navy-700/50 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !alerts) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5 text-accent-orange" />
            Alertas Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-navy-500 mx-auto mb-4" />
            <p className="text-navy-400">
              Erro ao carregar alertas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'celebration': return <Award className="w-5 h-5 text-green-400" />;
      case 'insight': return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-purple-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-400/20 bg-red-400/5';
      case 'celebration': return 'border-green-400/20 bg-green-400/5';
      case 'insight': return 'border-blue-400/20 bg-blue-400/5';
      default: return 'border-purple-400/20 bg-purple-400/5';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (visibleAlerts.length === 0) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5 text-accent-orange" />
            Alertas Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Tudo em dia! 🎉
            </h3>
            <p className="text-navy-400">
              Não há alertas pendentes no momento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-navy-700/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent-orange" />
            Alertas Inteligentes
          </div>
          <Badge variant="outline" className="text-accent-orange border-accent-orange/30">
            {visibleAlerts.length}
          </Badge>
        </CardTitle>
        <p className="text-navy-400 text-sm">
          Notificações personalizadas baseadas nos seus padrões
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {visibleAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getTypeColor(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(alert.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">
                      {alert.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getPriorityColor(alert.priority)}
                      >
                        {alert.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(alert.id)}
                        className="h-6 w-6 p-0 text-navy-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300">
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {alert.actionText && alert.actionUrl && (
                      <Button 
                        asChild 
                        size="sm" 
                        variant="outline"
                        className="text-accent-orange border-accent-orange/30 hover:bg-accent-orange/10"
                      >
                        <Link to={alert.actionUrl}>
                          {alert.actionText}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-navy-500 ml-auto">
                      <Clock className="w-3 h-3" />
                      <span>{alert.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
