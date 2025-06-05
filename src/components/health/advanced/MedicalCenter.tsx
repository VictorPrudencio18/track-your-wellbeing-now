
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { 
  Stethoscope, 
  Plus, 
  Calendar, 
  FileText,
  AlertTriangle,
  Heart,
  Activity,
  ClipboardList,
  Users,
  Pill
} from 'lucide-react';

export function MedicalCenter() {
  const { medicalRecords, createMedicalRecord } = useMedicalRecords();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);

  const [newRecord, setNewRecord] = useState({
    record_type: 'consultation',
    title: '',
    description: '',
    healthcare_provider: '',
    appointment_date: '',
    follow_up_required: false,
  });

  const handleCreateRecord = () => {
    createMedicalRecord.mutate(newRecord);
    setIsCreatingRecord(false);
    setNewRecord({
      record_type: 'consultation',
      title: '',
      description: '',
      healthcare_provider: '',
      appointment_date: '',
      follow_up_required: false,
    });
  };

  const recordTypeLabels = {
    consultation: 'Consulta',
    exam: 'Exame',
    prescription: 'Prescrição',
    vaccination: 'Vacinação',
  };

  const recordTypeIcons = {
    consultation: Stethoscope,
    exam: Activity,
    prescription: Pill,
    vaccination: Heart,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Centro Médico
        </h1>
        <p className="text-navy-400 max-w-2xl mx-auto">
          Gerencie seus registros médicos, consultas, exames e acompanhe seu histórico de saúde
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Total de Registros</p>
                  <p className="text-2xl font-bold text-white">
                    {medicalRecords.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Consultas</p>
                  <p className="text-2xl font-bold text-white">
                    {medicalRecords.filter(r => r.record_type === 'consultation').length}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Stethoscope className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Exames</p>
                  <p className="text-2xl font-bold text-white">
                    {medicalRecords.filter(r => r.record_type === 'exam').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Follow-ups</p>
                  <p className="text-2xl font-bold text-white">
                    {medicalRecords.filter(r => r.follow_up_required).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-navy-800/50 border border-navy-600/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-accent-orange">
            <ClipboardList className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="records" className="data-[state=active]:bg-accent-orange">
            <FileText className="w-4 h-4 mr-2" />
            Registros
          </TabsTrigger>
          <TabsTrigger value="providers" className="data-[state=active]:bg-accent-orange">
            <Users className="w-4 h-4 mr-2" />
            Profissionais
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-accent-orange">
            <Calendar className="w-4 h-4 mr-2" />
            Agenda
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registros Recentes */}
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white">Registros Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medicalRecords.slice(0, 5).map((record) => {
                    const IconComponent = recordTypeIcons[record.record_type as keyof typeof recordTypeIcons];
                    return (
                      <div key={record.id} className="flex items-center gap-3 p-3 bg-navy-900/30 rounded-lg">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <IconComponent className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{record.title}</p>
                          <p className="text-navy-400 text-xs">
                            {recordTypeLabels[record.record_type as keyof typeof recordTypeLabels]} • 
                            {new Date(record.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {medicalRecords.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-navy-400">Nenhum registro médico encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Follow-ups Pendentes */}
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Follow-ups Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medicalRecords.filter(r => r.follow_up_required).map((record) => (
                    <div key={record.id} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-white text-sm font-medium">{record.title}</p>
                      <p className="text-orange-400 text-xs">
                        {record.healthcare_provider && `${record.healthcare_provider} • `}
                        {record.follow_up_date ? 
                          `Agendar para ${new Date(record.follow_up_date).toLocaleDateString('pt-BR')}` :
                          'Data não definida'
                        }
                      </p>
                    </div>
                  ))}
                </div>
                {medicalRecords.filter(r => r.follow_up_required).length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-navy-400">Nenhum follow-up pendente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Registros */}
        <TabsContent value="records" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Registros Médicos</h2>
            <Button 
              onClick={() => setIsCreatingRecord(true)}
              className="bg-accent-orange hover:bg-accent-orange/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Registro
            </Button>
          </div>

          {isCreatingRecord && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-6 border border-navy-600/30"
            >
              <h3 className="text-xl font-bold text-white mb-4">Novo Registro Médico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-navy-300 text-sm">Tipo de Registro</label>
                  <select
                    value={newRecord.record_type}
                    onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value })}
                    className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
                  >
                    <option value="consultation">Consulta</option>
                    <option value="exam">Exame</option>
                    <option value="prescription">Prescrição</option>
                    <option value="vaccination">Vacinação</option>
                  </select>
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Título</label>
                  <Input
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                    placeholder="Ex: Consulta Cardiológica"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Profissional/Local</label>
                  <Input
                    value={newRecord.healthcare_provider}
                    onChange={(e) => setNewRecord({ ...newRecord, healthcare_provider: e.target.value })}
                    placeholder="Dr. João Silva - Hospital São Lucas"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Data da Consulta/Exame</label>
                  <Input
                    type="date"
                    value={newRecord.appointment_date}
                    onChange={(e) => setNewRecord({ ...newRecord, appointment_date: e.target.value })}
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-navy-300 text-sm">Descrição</label>
                  <Textarea
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                    placeholder="Descreva os detalhes da consulta, exame ou procedimento"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newRecord.follow_up_required}
                      onChange={(e) => setNewRecord({ ...newRecord, follow_up_required: e.target.checked })}
                      className="rounded border-navy-600"
                    />
                    <span className="text-navy-300 text-sm">Requer follow-up</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handleCreateRecord} className="bg-accent-orange hover:bg-accent-orange/80">
                  Criar Registro
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingRecord(false)}
                  className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {medicalRecords.map((record, index) => {
              const IconComponent = recordTypeIcons[record.record_type as keyof typeof recordTypeIcons];
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-500/10 rounded-xl">
                            <IconComponent className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-semibold">{record.title}</h3>
                              <Badge variant="outline">
                                {recordTypeLabels[record.record_type as keyof typeof recordTypeLabels]}
                              </Badge>
                              {record.follow_up_required && (
                                <Badge className="bg-orange-500/20 text-orange-400">
                                  Follow-up
                                </Badge>
                              )}
                            </div>
                            {record.healthcare_provider && (
                              <p className="text-navy-300 text-sm mb-1">{record.healthcare_provider}</p>
                            )}
                            {record.description && (
                              <p className="text-navy-400 text-sm mb-2">{record.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-navy-500">
                              {record.appointment_date && (
                                <span>Data: {new Date(record.appointment_date).toLocaleDateString('pt-BR')}</span>
                              )}
                              <span>Criado em {new Date(record.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Profissionais */}
        <TabsContent value="providers" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Profissionais de Saúde</h2>
          
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gerenciamento em Desenvolvimento</h3>
              <p className="text-navy-400">
                Sistema de gerenciamento de profissionais de saúde em desenvolvimento
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Agenda */}
        <TabsContent value="schedule" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Agenda Médica</h2>
          
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Agenda em Desenvolvimento</h3>
              <p className="text-navy-400">
                Sistema de agendamento de consultas e lembretes em desenvolvimento
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
