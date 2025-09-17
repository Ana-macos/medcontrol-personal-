# 🔌 MedControl MCP Server

Servidor MCP (Model Context Protocol) para integração com Amazon Q Developer no projeto MedControl Personal.

## 🚀 Funcionalidades

### 🛠️ Ferramentas Disponíveis

1. **`get_health_stats`** - Obtém estatísticas de saúde
2. **`add_exam`** - Adiciona novo exame médico
3. **`add_medication`** - Adiciona novo medicamento
4. **`get_accessibility_status`** - Verifica recursos de acessibilidade
5. **`generate_health_report`** - Gera relatórios personalizados

## 📦 Instalação

```bash
cd mcp-server
npm install
```

## 🏃 Execução

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## ⚙️ Configuração Amazon Q Developer

O arquivo `.vscode/settings.json` já está configurado para usar este servidor MCP.

## 🔧 Uso com Amazon Q Developer

Após configurar, você pode usar comandos como:

- "Obter estatísticas de saúde do usuário admin"
- "Adicionar exame de sangue para amanhã"
- "Verificar status da acessibilidade"
- "Gerar relatório mensal de saúde"

## 📋 Exemplos de Uso

### Adicionar Exame
```json
{
  "name": "Hemograma Completo",
  "date": "2025-01-20",
  "doctor": "Dr. Silva",
  "status": "agendado"
}
```

### Adicionar Medicamento
```json
{
  "name": "Paracetamol",
  "dosage": "500mg",
  "frequency": "8/8h",
  "doctor": "Dr. Santos"
}
```

## 🎯 Integração com MedControl

Este servidor MCP permite que o Amazon Q Developer:

- 📊 Acesse dados de saúde
- 🔬 Gerencie exames e medicamentos
- ♿ Controle recursos de acessibilidade
- 📋 Gere relatórios personalizados
- 🤖 Forneça assistência inteligente

---

*Servidor MCP para Q Developer Quest TDC 2025*