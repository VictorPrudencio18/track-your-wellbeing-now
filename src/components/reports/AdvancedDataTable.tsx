
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHealth } from '@/contexts/HealthContext';
import { ChevronDown, ChevronUp, Filter, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AdvancedDataTable() {
  const { activities } = useHealth();
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState('');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedActivities = activities
    .filter(activity => 
      activity.name.toLowerCase().includes(filterText.toLowerCase()) ||
      activity.type.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'calories':
          aValue = a.calories;
          bValue = b.calories;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'distance':
          aValue = a.distance || 0;
          bValue = b.distance || 0;
          break;
        default:
          aValue = a[sortField as keyof typeof a];
          bValue = b[sortField as keyof typeof b];
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="text-white hover:bg-navy-700/50 p-0 h-auto font-medium"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
        <ChevronUp className="w-4 h-4 ml-1" /> : 
        <ChevronDown className="w-4 h-4 ml-1" />
      )}
    </Button>
  );

  const getActivityTypeColor = (type: string) => {
    const colors = {
      run: 'bg-red-500/10 text-red-400 border-red-500/20',
      walk: 'bg-green-500/10 text-green-400 border-green-500/20',
      cycle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      gym: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      yoga: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      swim: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  return (
    <Card className="glass-card border-navy-600/20 bg-navy-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-accent-orange" />
            Dados Detalhados das Atividades
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
              <Input
                placeholder="Filtrar atividades..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 bg-navy-700/50 border-navy-600 text-white w-64"
              />
            </div>
            <Button size="sm" className="bg-accent-orange hover:bg-accent-orange/90">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-navy-600/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-navy-600/30 hover:bg-navy-700/30">
                <TableHead className="text-navy-300">
                  <SortButton field="date">Data</SortButton>
                </TableHead>
                <TableHead className="text-navy-300">
                  <SortButton field="name">Atividade</SortButton>
                </TableHead>
                <TableHead className="text-navy-300">Tipo</TableHead>
                <TableHead className="text-navy-300">
                  <SortButton field="duration">Duração</SortButton>
                </TableHead>
                <TableHead className="text-navy-300">
                  <SortButton field="calories">Calorias</SortButton>
                </TableHead>
                <TableHead className="text-navy-300">
                  <SortButton field="distance">Distância</SortButton>
                </TableHead>
                <TableHead className="text-navy-300">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedActivities.map((activity, index) => (
                <motion.tr
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-navy-600/30 hover:bg-navy-700/20 transition-colors"
                >
                  <TableCell className="text-white">
                    {activity.date.toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {activity.name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getActivityTypeColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">
                    {Math.floor(activity.duration / 60)}h {activity.duration % 60}min
                  </TableCell>
                  <TableCell className="text-white">
                    <span className="font-medium">{activity.calories}</span>
                    <span className="text-navy-400 text-sm ml-1">cal</span>
                  </TableCell>
                  <TableCell className="text-white">
                    {activity.distance ? `${activity.distance.toFixed(1)} km` : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-navy-600 rounded-full h-2">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                          style={{ width: `${Math.min((activity.calories / 500) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-navy-400">
                        {Math.round((activity.calories / 500) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-navy-400">
          <span>Mostrando {filteredAndSortedActivities.length} de {activities.length} atividades</span>
          <div className="flex items-center gap-2">
            <span>Página 1 de 1</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
