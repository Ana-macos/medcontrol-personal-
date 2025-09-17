#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class MedControlMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'medcontrol-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_health_stats',
            description: 'Obtém estatísticas de saúde do usuário',
            inputSchema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  description: 'ID do usuário'
                }
              },
              required: ['userId']
            }
          },
          {
            name: 'add_exam',
            description: 'Adiciona um novo exame médico',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Nome do exame'
                },
                date: {
                  type: 'string',
                  description: 'Data do exame (YYYY-MM-DD)'
                },
                doctor: {
                  type: 'string',
                  description: 'Nome do médico'
                },
                status: {
                  type: 'string',
                  enum: ['agendado', 'realizado', 'cancelado'],
                  description: 'Status do exame'
                }
              },
              required: ['name', 'date', 'status']
            }
          },
          {
            name: 'add_medication',
            description: 'Adiciona um novo medicamento',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Nome do medicamento'
                },
                dosage: {
                  type: 'string',
                  description: 'Dosagem do medicamento'
                },
                frequency: {
                  type: 'string',
                  description: 'Frequência de uso'
                },
                doctor: {
                  type: 'string',
                  description: 'Médico que prescreveu'
                }
              },
              required: ['name', 'dosage', 'frequency']
            }
          },
          {
            name: 'get_accessibility_status',
            description: 'Verifica status dos recursos de acessibilidade',
            inputSchema: {
              type: 'object',
              properties: {
                feature: {
                  type: 'string',
                  enum: ['high_contrast', 'large_text', 'screen_reader', 'voice_commands'],
                  description: 'Recurso de acessibilidade a verificar'
                }
              }
            }
          },
          {
            name: 'generate_health_report',
            description: 'Gera relatório de saúde personalizado',
            inputSchema: {
              type: 'object',
              properties: {
                period: {
                  type: 'string',
                  enum: ['week', 'month', 'year'],
                  description: 'Período do relatório'
                },
                includeModules: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['exams', 'medications', 'vaccines', 'mental_health', 'nutrition']
                  },
                  description: 'Módulos a incluir no relatório'
                }
              },
              required: ['period']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_health_stats':
            return await this.getHealthStats(args);
          
          case 'add_exam':
            return await this.addExam(args);
          
          case 'add_medication':
            return await this.addMedication(args);
          
          case 'get_accessibility_status':
            return await this.getAccessibilityStatus(args);
          
          case 'generate_health_report':
            return await this.generateHealthReport(args);
          
          default:
            throw new Error(`Ferramenta desconhecida: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao executar ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async getHealthStats(args) {
    const { userId } = args;
    
    // Simulação de dados de saúde
    const stats = {
      totalExams: 12,
      activeMedications: 3,
      vaccinesUpToDate: 8,
      mentalHealthEntries: 25,
      nutritionEntries: 45,
      waterIntakeAverage: 1800, // ml
      lastUpdate: new Date().toISOString()
    };

    return {
      content: [
        {
          type: 'text',
          text: `📊 Estatísticas de Saúde para ${userId}:
          
🔬 Exames: ${stats.totalExams} cadastrados
💊 Medicamentos: ${stats.activeMedications} ativos
💉 Vacinas: ${stats.vaccinesUpToDate} em dia
🧠 Saúde Mental: ${stats.mentalHealthEntries} registros
🍎 Nutrição: ${stats.nutritionEntries} refeições
💧 Água: ${stats.waterIntakeAverage}ml/dia (média)

Última atualização: ${new Date(stats.lastUpdate).toLocaleString('pt-BR')}`
        }
      ]
    };
  }

  async addExam(args) {
    const { name, date, doctor, status } = args;
    
    const exam = {
      id: Date.now().toString(),
      name,
      date,
      doctor: doctor || 'Não informado',
      status,
      createdAt: new Date().toISOString()
    };

    return {
      content: [
        {
          type: 'text',
          text: `✅ Exame adicionado com sucesso!

📋 ${exam.name}
📅 Data: ${new Date(exam.date).toLocaleDateString('pt-BR')}
👨‍⚕️ Médico: ${exam.doctor}
📊 Status: ${exam.status}
🆔 ID: ${exam.id}`
        }
      ]
    };
  }

  async addMedication(args) {
    const { name, dosage, frequency, doctor } = args;
    
    const medication = {
      id: Date.now().toString(),
      name,
      dosage,
      frequency,
      doctor: doctor || 'Não informado',
      createdAt: new Date().toISOString()
    };

    return {
      content: [
        {
          type: 'text',
          text: `✅ Medicamento adicionado com sucesso!

💊 ${medication.name}
📏 Dosagem: ${medication.dosage}
⏰ Frequência: ${medication.frequency}
👨‍⚕️ Médico: ${medication.doctor}
🆔 ID: ${medication.id}`
        }
      ]
    };
  }

  async getAccessibilityStatus(args) {
    const { feature } = args;
    
    const accessibilityFeatures = {
      high_contrast: {
        name: 'Alto Contraste',
        status: 'ativo',
        description: 'Melhora a visibilidade para usuários com baixa visão'
      },
      large_text: {
        name: 'Texto Grande',
        status: 'inativo',
        description: 'Aumenta o tamanho da fonte em 120%'
      },
      screen_reader: {
        name: 'Leitor de Tela',
        status: 'ativo',
        description: 'Leitura automática de elementos focados'
      },
      voice_commands: {
        name: 'Comandos de Voz',
        status: 'ativo',
        description: 'Navegação e controle por comandos de voz'
      }
    };

    if (feature && accessibilityFeatures[feature]) {
      const featureInfo = accessibilityFeatures[feature];
      return {
        content: [
          {
            type: 'text',
            text: `♿ ${featureInfo.name}: ${featureInfo.status.toUpperCase()}
            
📝 ${featureInfo.description}`
          }
        ]
      };
    }

    const allFeatures = Object.entries(accessibilityFeatures)
      .map(([key, info]) => `♿ ${info.name}: ${info.status.toUpperCase()}`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `🎯 Status dos Recursos de Acessibilidade:

${allFeatures}

🤖 IA de Acessibilidade: ATIVA
🎤 Assistente de Voz: DISPONÍVEL
⌨️ Navegação por Teclado: HABILITADA`
        }
      ]
    };
  }

  async generateHealthReport(args) {
    const { period, includeModules = ['exams', 'medications', 'vaccines', 'mental_health', 'nutrition'] } = args;
    
    const periodNames = {
      week: 'Semanal',
      month: 'Mensal',
      year: 'Anual'
    };

    const moduleNames = {
      exams: '🔬 Exames',
      medications: '💊 Medicamentos',
      vaccines: '💉 Vacinas',
      mental_health: '🧠 Saúde Mental',
      nutrition: '🍎 Nutrição'
    };

    const includedModules = includeModules
      .map(module => moduleNames[module])
      .join(', ');

    return {
      content: [
        {
          type: 'text',
          text: `📋 Relatório de Saúde ${periodNames[period]}

📅 Período: ${periodNames[period]}
📊 Módulos incluídos: ${includedModules}
📈 Gerado em: ${new Date().toLocaleString('pt-BR')}

🎯 Resumo Executivo:
• Sistema funcionando perfeitamente
• Dados sincronizados e atualizados
• Recursos de acessibilidade ativos
• Interface responsiva e otimizada

✅ Recomendações:
• Continue mantendo registros atualizados
• Use recursos de acessibilidade conforme necessário
• Faça backup regular dos dados
• Mantenha consultas médicas em dia

🏆 MedControl Personal - Sua saúde em boas mãos!`
        }
      ]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]:', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MedControl MCP Server iniciado com sucesso! 🏥');
  }
}

const server = new MedControlMCPServer();
server.run().catch(console.error);