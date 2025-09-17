# Sistema Completo de Controle de Saúde

Um sistema web completo e personalizado para gerenciar todos os aspectos da sua saúde: exames médicos, medicamentos, vacinação e consultas odontológicas.

## 🚀 Funcionalidades Principais

### 📊 Dashboard
- **Visão geral** com estatísticas de todos os módulos
- **Exames recentes** e próximos
- **Medicamentos ativos** com alertas de horários
- **Alertas** para exames urgentes e vacinas atrasadas

### 🔬 Exames Médicos
- ✅ Adicionar/editar/excluir exames
- 🔍 Buscar e filtrar por nome, médico, status ou tipo
- 📋 Categorização por tipos (Sangue, Imagem, Cardiológico, etc.)
- 📅 Controle de status (Agendado, Realizado, Cancelado)

### 💊 Controle de Medicamentos
- 📝 Cadastro completo de medicamentos
- ⏰ Controle de horários e frequência
- 🔔 Alertas para próximas doses
- 📊 Visualização de medicamentos ativos
- ✅ Registro de doses tomadas
- 🏥 Controle por médico responsável

### 💉 Controle de Vacinação
- 📋 Histórico completo de vacinas
- 📅 Controle de doses e reforços
- 🏥 Registro de local e lote
- ⚠️ Alertas para vacinas atrasadas
- 📊 Estatísticas de vacinação

### 🦷 Controle Odontológico
- 📝 Histórico de consultas e procedimentos
- 💰 Controle de custos
- 📅 Agendamento de retornos
- 🔍 Busca por tipo de procedimento
- 📊 Visão geral dos tratamentos

### 📅 Calendário Integrado
- Visualização unificada de todos os compromissos
- Exames, consultas odontológicas e vacinas
- Navegação mensal intuitiva

### 📈 Relatórios Avançados
- 📊 Gráficos de exames por tipo e mês
- 💾 Exportação completa de todos os dados
- 📋 Análises estatísticas

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Design responsivo e moderno
- **JavaScript** - Funcionalidades interativas avançadas
- **Chart.js** - Gráficos e visualizações
- **Font Awesome** - Ícones profissionais
- **LocalStorage** - Armazenamento local seguro

## 📱 Design Responsivo

O sistema é totalmente responsivo e funciona perfeitamente em:
- 💻 Desktop (1200px+)
- 📱 Tablets (768px - 1199px)
- 📱 Smartphones (até 767px)

## 🎨 Características do Design

- **Interface moderna** com gradientes e animações
- **Cores intuitivas** para diferentes status e tipos
- **Cards interativos** para medicamentos ativos
- **Tabelas responsivas** com filtros avançados
- **Modais otimizados** para entrada de dados
- **Acessibilidade** considerada em todos os componentes

## 📋 Como Usar

### 1. Abrir o Sistema
Abra o arquivo `index.html` em qualquer navegador moderno.

### 2. Gerenciar Exames
1. Vá para a aba "Exames"
2. Clique em "Adicionar Exame"
3. Preencha os dados necessários
4. Use filtros para organizar e buscar

### 3. Controlar Medicamentos
1. Acesse a aba "Medicamentos"
2. Adicione medicamentos com dosagem e horários
3. Marque doses como tomadas
4. Visualize medicamentos ativos em cards especiais

### 4. Gerenciar Vacinas
1. Na aba "Vacinação"
2. Registre vacinas aplicadas
3. Agende próximas doses
4. Acompanhe estatísticas

### 5. Consultas Odontológicas
1. Aba "Dentista"
2. Registre procedimentos e custos
3. Agende retornos
4. Acompanhe tratamentos ativos

### 6. Visualizar Calendário
- Veja todos os compromissos em uma visão mensal
- Navegue entre meses
- Identifique dias com múltiplos compromissos

### 7. Acessar Relatórios
- Visualize gráficos estatísticos
- Exporte todos os dados em JSON
- Analise tendências de saúde

## 💾 Armazenamento de Dados

- **LocalStorage** para persistência local
- **Backup automático** a cada alteração
- **Exportação completa** em formato JSON
- **Dados seguros** apenas no seu dispositivo

## 🔧 Personalização Avançada

### Adicionar Novos Tipos
Edite as funções de label nos arquivos JavaScript:
- `getTypeLabel()` para exames
- `getVaccineTypeLabel()` para vacinas
- `getDentalTypeLabel()` para procedimentos

### Modificar Frequências de Medicamentos
Ajuste o objeto `frequencyHours` na função `calculateNextDose()`.

### Personalizar Cores
Modifique as variáveis CSS no arquivo `styles.css`.

## 📊 Funcionalidades Avançadas

### Alertas Inteligentes
- **Medicamentos**: Próximas doses e horários perdidos
- **Vacinas**: Doses atrasadas e reforços necessários
- **Exames**: Compromissos urgentes (próximos 7 dias)

### Filtros Avançados
- Busca textual em múltiplos campos
- Filtros por status, tipo e data
- Combinação de múltiplos filtros

### Estatísticas em Tempo Real
- Contadores automáticos no dashboard
- Gráficos atualizados dinamicamente
- Indicadores visuais de status

## 🚀 Melhorias Futuras Planejadas

- 🔔 Notificações push do navegador
- 📧 Lembretes por email
- 🏥 Integração com APIs médicas
- 📱 PWA (Progressive Web App)
- 🔐 Sistema de login e múltiplos usuários
- ☁️ Sincronização na nuvem
- 📋 Relatórios em PDF
- 🔍 Busca avançada com filtros complexos

## 📞 Suporte e Customização

Este sistema foi desenvolvido para ser:
- **Facilmente customizável**
- **Extensível** com novas funcionalidades
- **Adaptável** às suas necessidades específicas

## 🔒 Privacidade e Segurança

- **Dados locais**: Informações ficam apenas no seu dispositivo
- **Sem servidor**: Não há transmissão de dados pessoais
- **Controle total**: Você tem controle completo dos seus dados
- **Backup manual**: Exporte quando quiser

## 📄 Licença

Este projeto é de uso livre para fins pessoais e educacionais.

---

**Desenvolvido com ❤️ para cuidar da sua saúde de forma completa e organizada**

### 🎯 Principais Benefícios

✅ **Organização Total** - Todos os dados de saúde em um só lugar  
✅ **Lembretes Automáticos** - Nunca mais esqueça medicamentos ou consultas  
✅ **Histórico Completo** - Acompanhe sua evolução ao longo do tempo  
✅ **Interface Intuitiva** - Fácil de usar para todas as idades  
✅ **Dados Seguros** - Privacidade garantida com armazenamento local  
✅ **Multiplataforma** - Funciona em qualquer dispositivo com navegador
