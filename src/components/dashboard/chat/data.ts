
import { ChatMessage } from './types';

export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Olá! Eu sou a VIVA, sua assistente de saúde e bem-estar! 🌟 Estou aqui para te ajudar com dicas personalizadas baseadas em suas atividades e responder suas dúvidas sobre saúde mental e qualidade de vida.',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'ai',
    content: 'Vi que você já caminhou 8.750 passos hoje! Que tal uma caminhada mais longa para bater sua meta? Ou posso sugerir algumas técnicas de respiração para relaxar?',
    timestamp: new Date().toISOString(),
    suggestions: ['Técnicas de respiração', 'Dicas de caminhada', 'Exercícios de relaxamento']
  }
];

export const quickSuggestions = [
  'Como melhorar meu sono?',
  'Dicas para reduzir estresse',
  'Exercícios para ansiedade',
  'Alimentação saudável'
];
