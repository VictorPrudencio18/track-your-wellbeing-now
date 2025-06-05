import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Stethoscope, 
  Plus, 
  Pill,
  Calendar,
  FileText,
  ClipboardCheck,
  AlertCircle,
  Heart,
  Save,
  X,
  FileUp
} from 'lucide-react';

export function MedicalCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: '',
    record_type: 'appointment',
    appointment_date: '',
    healthcare_provider: '',
    description: '',
    follow_up_required: false,
    follow_up_date: '',
    privacy_level: 'private'
  });

  // Mock medical records - em uma implementação real, viriam do banco de dados
  const medicalRecords = [
    {
      id: '1',
      title: 'Consulta de Rotina',
      record_type: 'appointment',
      healthcare_provider: 'Dr. Ana Silva',
      appointment_date: '2023-05-15',
      description: 'Check-up anual sem problemas identificados.',
      follow_up_required: false,
      privacy_level: 'private',
      attachments: [],
      created_at: '2023-05-15T14:30:00Z'
    },
    {
      id: '2',
      title: 'Exame de Sangue',
      record_type: 'lab_results',
      healthcare_provider: 'Laboratório Central',
      appointment_date: '2023-04-20',
      description: 'Hemograma completo e perfil lipídico. Resultados normais.',
      follow_up_required: false,
      privacy_level: 'private',
      attachments: [
        { name: 'exame-sangue.pdf', type: 'application/pdf', size: '1.2MB' }
      ],
      created_at: '2023-04-20T10:15:00Z'
    }
  ];

  // Mock medications - em uma implementação real, viriam do banco de dados
  const medications = [
    {
      id: '1',
      name: 'Vitamina D',
      dosage: '2000 UI',
      frequency: 'Diária',
      start_date: '2023-01-10',
      end_date: null,
      instructions: 'Tomar pela manhã com alimento',
      is_active: true
    },
    {
      id: '2',
      name: 'Ômega 3',
      dosage: '1000mg',
      frequency: 'Diária',
      start_date: '2023-02-15',
      end_date: null,
      instructions: 'Tomar após o almoço',
      is_active: true
    }
  ];

  // Próximas consultas agendadas
  const upcomingAppointments = [
    {
      id: '1',
      title: 'Consulta Cardiologista',
      doctor: 'Dr. Carlos Mendes',
      date: '2023-06-20',
      time: '14:30',
      location: 'Hospital Santa Clara',
      notes: 'Trazer resultados dos exames recentes'
    }
  ];

  const recordTypes = [
    { value: 'appointment', label: 'Consulta Médica', icon: '👨‍⚕️' },
    { value: 'lab_results', label: 'Resultados de Exames', icon: '🧪' },
    { value: 'prescription', label: 'Prescrição Médica', icon: '💊' },
    { value: 'vaccination', label: 'Vacinação', icon: '💉' },
    { value: 'surgery', label: 'Cirurgia', icon: '🏥' },
    { value: 'allergy', label: 'Alergia', icon: '🤧' },
    { value: 'other', label: 'Outro', icon: '📋' }
  ];

  const handleAddRecord = () => {
    console.log('Adicionando registro médico:', newRecord);
    setNewRecord({
      title: '',
      record_type: 'appointment',
      appointment_date: '',
      healthcare_provider: '',
      description: '',
      follow_up_required: false,
      follow_up_date: '',
      privacy_level: 'private'
    });
    setIsAddingRecord(false);
  };

  const getRecordTypeIcon = (type: string) => {
    const record = recordTypes.find(rt => rt.value === type);
    return record ? record.icon : '📋';
  };

  const getRecordTypeLabel = (type: string) => {
    const record = recordTypes.find(rt => rt.value === type);
    return record ? record.label : type;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent rounded-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-3xl border border-purple-500/20">
              <Stethoscope className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Centro Médico
              </h1>
              <p className="text-navy-400 text-lg max-w-2xl mx-auto">
                Gerencie registros médicos, medicamentos e acompanhamentos
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={() => setIsAddingRecord(true)}
          className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro Médico
        </Button>
        <Button 
          variant="outline"
          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          <Pill className="w-4 h-4 mr-2" />
          Adicionar Medicamento
        </Button>
        <Button 
          variant="outline"
          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Agendar Consulta
        </Button>
      </div>

      {/* Add Medical Record Modal */}
      {isAddingRecord && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/90 backdrop-blur-xl max-w-2xl w-full my-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Novo Registro Médico</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsAddingRecord(false)}
                  className="text-navy-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-navy-300 text-sm">Título</label>
                  <Input
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                    className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                    placeholder="Ex: Consulta com Cardiologista"
                  />
                </div>
                
                <div>
                  <label className="text-navy-300 text-sm">Tipo de Registro</label>
                  <select
                    value={newRecord.record_type}
                    onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value })}
                    className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white mt-1"
                  >
                    {recordTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-navy-300 text-sm">Profissional de Saúde</label>
                  <Input
                    value={newRecord.healthcare_provider}
                    onChange={(e) => setNewRecord({ ...newRecord, healthcare_provider: e.target.value })}
                    className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                    placeholder="Nome do médico ou clínica"
                  />
                </div>
                
                <div>
                  <label className="text-navy-300 text-sm">Data</label>
                  <Input
                    type="date"
                    value={newRecord.appointment_date}
                    onChange={(e) => setNewRecord({ ...newRecord, appointment_date: e.target.value })}
                    className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-navy-300 text-sm">Privacidade</label>
                  <select
                    value={newRecord.privacy_level}
                    onChange={(e) => setNewRecord({ ...newRecord, privacy_level: e.target.value })}
                    className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white mt-1"
                  >
                    <option value="private">Privado</option>
                    <option value="family">Família</option>
                    <option value="doctor">Apenas Médicos</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-navy-300 text-sm">Descrição</label>
                  <Textarea
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                    className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                    placeholder="Detalhes sobre a consulta, exame ou medicamento"
                    rows={4}
                  />
                </div>
                
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="follow_up"
                    checked={newRecord.follow_up_required}
                    onChange={(e) => setNewRecord({ ...newRecord, follow_up_required: e.target.checked })}
                    className="bg-navy-800/50 border-navy-600/30"
                  />
                  <label htmlFor="follow_up" className="text-navy-300 text-sm">
                    Retorno necessário
                  </label>
                </div>
                
                {newRecord.follow_up_required && (
                  <div>
                    <label className="text-navy-300 text-sm">Data do Retorno</label>
                    <Input
                      type="date"
                      value={newRecord.follow_up_date}
                      onChange={(e) => setNewRecord({ ...newRecord, follow_up_date: e.target.value })}
                      className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                    />
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <label className="text-navy-300 text-sm">Anexar Arquivos</label>
                  <div className="mt-1 p-4 border border-dashed border-navy-600/30 rounded-lg bg-navy-800/20 text-center cursor-pointer hover:bg-navy-800/40 transition-colors">
                    <FileUp className="w-6 h-6 text-navy-400 mx-auto mb-2" />
                    <p className="text-navy-400 text-sm">Clique para fazer upload ou arraste arquivos</p>
                    <p className="text-navy-500 text-xs mt-1">PDF, JPG, PNG (max. 10MB)</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-navy-700/30">
                <Button 
                  onClick={handleAddRecord}
                  disabled={!newRecord.title || !newRecord.record_type || !newRecord.appointment_date}
                  className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Registro
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingRecord(false)}
                  className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-2 bg-navy-800/50 p-2 rounded-2xl backdrop-blur-sm border border-navy-600/30 h-auto">
          {[
            { value: 'overview', label: 'Visão Geral', icon: Stethoscope },
            { value: 'records', label: 'Registros', icon: FileText },
            { value: 'medications', label: 'Medicamentos', icon: Pill },
            { value: 'appointments', label: 'Consultas', icon: Calendar }
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-navy-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-orange data-[state=active]:to-accent-orange/80 data-[state=active]:text-white transition-all duration-300 hover:text-white"
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Medical Summary */}
            <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-400" />
                  </div>
                  Resumo Médico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-navy-700/30 rounded-lg">
                    <div className="text-sm text-navy-400 mb-1">Registros Médicos</div>
                    <div className="text-2xl font-bold text-white">{medicalRecords.length}</div>
                  </div>
                  <div className="p-4 bg-navy-700/30 rounded-lg">
                    <div className="text-sm text-navy-400 mb-1">Medicamentos Ativos</div>
                    <div className="text-2xl font-bold text-white">
                      {medications.filter(m => m.is_active).length}
                    </div>
                  </div>
                  <div className="p-4 bg-navy-700/30 rounded-lg">
                    <div className="text-sm text-navy-400 mb-1">Próximas Consultas</div>
                    <div className="text-2xl font-bold text-white">{upcomingAppointments.length}</div>
                  </div>
                  <div className="p-4 bg-navy-700/30 rounded-lg">
                    <div className="text-sm text-navy-400 mb-1">Alergias</div>
                    <div className="text-2xl font-bold text-white">0</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl">
                  <h4 className="text-white font-medium mb-2">Informações de Emergência</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-navy-300">Tipo Sanguíneo:</span>
                      <span className="text-white">O+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-300">Contato de Emergência:</span>
                      <span className="text-white">Maria Silva (Mãe)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-300">Telefone:</span>
                      <span className="text-white">(11) 98765-4321</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Records */}
            <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  Registros Recentes
                  <Badge className="bg-blue-500/20 text-blue-400 ml-auto">
                    {medicalRecords.length} registros
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicalRecords.map((record, index) => (
                  <div 
                    key={record.id}
                    className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium">
                          <span className="mr-2">{getRecordTypeIcon(record.record_type)}</span>
                          {record.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {getRecordTypeLabel(record.record_type)}
                          </Badge>
                          <span className="text-navy-400 text-sm">
                            {new Date(record.appointment_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      {record.follow_up_required && (
                        <Badge className="bg-orange-500/20 text-orange-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          Retorno
                        </Badge>
                      )}
                    </div>
                    <p className="text-navy-300 text-sm mt-2">{record.description}</p>
                    
                    {record.attachments && record.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-navy-700/30">
                        <div className="text-xs text-navy-400 mb-2">Anexos:</div>
                        <div className="flex flex-wrap gap-2">
                          {record.attachments.map((attachment, attachIndex) => (
                            <Badge key={attachIndex} className="bg-navy-700/50 text-navy-300">
                              {attachment.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {medicalRecords.length === 0 && (
                  <div className="text-center py-8 text-navy-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum registro médico encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-400" />
                  </div>
                  Próximas Consultas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div 
                    key={appointment.id}
                    className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-medium">{appointment.title}</h4>
                        <p className="text-navy-300 text-sm">
                          {appointment.doctor} • {appointment.location}
                        </p>
                      </div>
                      <div>
                        <div className="text-orange-400 font-medium">
                          {new Date(appointment.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-navy-400 text-sm text-right">
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-3 pt-3 border-t border-navy-700/30 text-navy-400 text-sm">
                        <AlertCircle className="w-3 h-3 inline-block mr-1" />
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Medications */}
          {medications.length > 0 && (
            <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Pill className="w-5 h-5 text-green-400" />
                  </div>
                  Medicamentos Ativos
                  <Badge className="bg-green-500/20 text-green-400 ml-auto">
                    {medications.filter(m => m.is_active).length} medicamentos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medications.filter(m => m.is_active).map((med, index) => (
                    <div 
                      key={med.id}
                      className="p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white font-medium">
                            💊 {med.name}
                          </h4>
                          <div className="text-navy-300 text-sm">
                            {med.dosage} • {med.frequency}
                          </div>
                        </div>
                      </div>
                      {med.instructions && (
                        <div className="mt-2 text-navy-400 text-xs">
                          <ClipboardCheck className="w-3 h-3 inline-block mr-1" />
                          {med.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records" className="space-y-6 mt-8">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Registros Médicos</h3>
              <p className="text-navy-400 leading-relaxed">
                Registro completo e organizado do seu histórico médico
              </p>
              <Button 
                onClick={() => setIsAddingRecord(true)}
                className="mt-6 bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Registro
              </Button>
            </motion.div>
          </div>
        </TabsContent>

        {/* Other tabs with similar placeholders */}
        <TabsContent value="medications" className="space-y-6 mt-8">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Pill className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Medicamentos</h3>
              <p className="text-navy-400 leading-relaxed">
                Gerenciador completo de medicamentos com lembretes e histórico
              </p>
              <Button className="mt-6 bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Medicamento
              </Button>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6 mt-8">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Consultas Médicas</h3>
              <p className="text-navy-400 leading-relaxed">
                Agendamento e acompanhamento de consultas com lembretes automáticos
              </p>
              <Button className="mt-6 bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white">
                <Plus className="w-4 h-4 mr-2" />
                Agendar Consulta
              </Button>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
