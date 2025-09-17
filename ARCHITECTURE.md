# 🏗️ Arquitetura do MedControl Personal

## 📊 Visão Geral da Arquitetura

```mermaid
graph TB
    subgraph "🌐 CAMADA DE APRESENTAÇÃO"
        direction TB
        UI["🖥️ Interface do Usuário"]
        MAIN["📄 Sistema Principal<br/>index.html"]
        ACCESS["♿ Versão Acessível<br/>index-acessivel.html"]
        
        UI --> MAIN
        UI --> ACCESS
    end

    subgraph "🧠 CAMADA DE LÓGICA"
        direction TB
        LOGIC["⚙️ JavaScript Engine"]
        STANDARD["📜 Script Principal<br/>script.js"]
        AI["🤖 IA Acessibilidade<br/>script-acessivel.js"]
        
        LOGIC --> STANDARD
        LOGIC --> AI
    end

    subgraph "🎨 CAMADA DE ESTILO"
        direction TB
        STYLES["🎨 CSS Engine"]
        CSS1["🎯 Estilos Padrão<br/>styles.css"]
        CSS2["♿ Estilos Acessíveis<br/>styles-acessivel.css"]
        
        STYLES --> CSS1
        STYLES --> CSS2
    end

    subgraph "💾 CAMADA DE DADOS"
        direction TB
        STORAGE["💾 Armazenamento Local"]
        LS[("🗄️ LocalStorage<br/>Banco de Dados")]
        
        STORAGE --> LS
    end

    subgraph "🔌 CAMADA DE INTEGRAÇÃO"
        direction TB
        APIS["🔌 Web APIs"]
        SPEECH["🎤 Speech API"]
        STORAGE_API["💾 Storage API"]
        NOTIFY["🔔 Notification API"]
        
        APIS --> SPEECH
        APIS --> STORAGE_API
        APIS --> NOTIFY
    end
    
    %% Conexões principais
    UI -.-> LOGIC
    LOGIC -.-> STORAGE
    LOGIC -.-> APIS
    STYLES -.-> UI
    

```

## 🏗️ Arquitetura Detalhada por Módulos

```mermaid
graph LR
    subgraph "📊 DASHBOARD"
        D1["📈 Estatísticas"]
        D2["⚡ Ações Rápidas"]
        D3["📅 Atividades"]
    end

    subgraph "🔬 EXAMES"
        E1["📋 Cadastro"]
        E2["📅 Agendamento"]
        E3["📊 Histórico"]
    end

    subgraph "💊 MEDICAMENTOS"
        M1["💉 Dosagens"]
        M2["⏰ Horários"]
        M3["👨⚕️ Médicos"]
    end

    subgraph "💉 VACINAS"
        V1["📋 Histórico"]
        V2["📅 Calendário"]
        V3["🌍 Internacional"]
    end

    subgraph "🧠 SAÚDE MENTAL"
        S1["😊 Humor"]
        S2["🛋️ Terapia"]
        S3["💡 Dicas"]
    end

    subgraph "🍎 NUTRIÇÃO"
        N1["🍽️ Diário"]
        N2["💧 Água"]
        N3["📚 Dicas"]
    end

    subgraph "👨👩👧👦 FAMÍLIA"
        F1["👥 Membros"]
        F2["📈 Desenvolvimento"]
        F3["🚨 Emergência"]
    end

    subgraph "💾 ARMAZENAMENTO"
        LS[("🗄️ LocalStorage")]
    end

    %% Conexões com armazenamento
    D1 -.-> LS
    E1 -.-> LS
    M1 -.-> LS
    V1 -.-> LS
    S1 -.-> LS
    N1 -.-> LS
    F1 -.-> LS

    %% Estilos dos módulos
    classDef dashboard fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef health fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef mental fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef nutrition fill:#fff8e1,stroke:#f57c00,stroke-width:2px
    classDef family fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef storage fill:#f5f5f5,stroke:#424242,stroke-width:2px
    
    class D1,D2,D3 dashboard
    class E1,E2,E3,M1,M2,M3,V1,V2,V3 health
    class S1,S2,S3 mental
    class N1,N2,N3 nutrition
    class F1,F2,F3 family
    class LS storage
```

## ♿ Sistema de Acessibilidade IA

```mermaid
graph TB
    subgraph "🎛️ PAINEL DE CONTROLE"
        PANEL["🔧 Accessibility Panel"]
        TOGGLE["🔘 Toggle Button"]
        MENU["📋 Options Menu"]
        
        TOGGLE --> PANEL
        PANEL --> MENU
    end

    subgraph "🎯 MODOS DE ACESSIBILIDADE"
        CONTRAST["🌓 Alto Contraste"]
        LARGE["🔍 Texto Grande"]
        READER["📢 Leitor de Tela"]
        KEYBOARD["⌨️ Navegação Teclado"]
        MOTION["⏸️ Reduzir Movimento"]
        COLOR["🎨 Modo Daltonismo"]
    end

    subgraph "🎤 ASSISTENTE DE VOZ"
        VOICE["🎙️ Voice Assistant"]
        RECOGNITION["👂 Speech Recognition"]
        SYNTHESIS["🗣️ Speech Synthesis"]
        COMMANDS["📝 Voice Commands"]
        
        VOICE --> RECOGNITION
        VOICE --> SYNTHESIS
        RECOGNITION --> COMMANDS
    end

    subgraph "🔧 APLICAÇÃO DE MUDANÇAS"
        DOM["🌐 DOM Manipulation"]
        CSS["🎨 CSS Classes"]
        ARIA["♿ ARIA Labels"]
        FOCUS["🎯 Focus Management"]
        
        DOM --> CSS
        DOM --> ARIA
        DOM --> FOCUS
    end

    %% Conexões
    MENU --> CONTRAST
    MENU --> LARGE
    MENU --> READER
    MENU --> KEYBOARD
    MENU --> MOTION
    MENU --> COLOR

    CONTRAST --> DOM
    LARGE --> DOM
    READER --> DOM
    KEYBOARD --> DOM
    MOTION --> DOM
    COLOR --> DOM

    COMMANDS --> DOM
    SYNTHESIS --> READER

    %% Estilos
    classDef control fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef modes fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef voice fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef application fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class PANEL,TOGGLE,MENU control
    class CONTRAST,LARGE,READER,KEYBOARD,MOTION,COLOR modes
    class VOICE,RECOGNITION,SYNTHESIS,COMMANDS voice
    class DOM,CSS,ARIA,FOCUS application
```

## 🔄 Fluxo de Dados Completo

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant UI as 🖥️ Interface
    participant JS as ⚙️ JavaScript
    participant LS as 💾 LocalStorage
    participant API as 🔌 Web APIs
    participant AI as 🤖 IA Acessibilidade

    Note over U,AI: Fluxo Principal do Sistema
    
    U->>UI: 1. Interage com sistema
    UI->>JS: 2. Dispara evento
    
    alt Ação com dados
        JS->>LS: 3a. Salva/Recupera dados
        LS-->>JS: 4a. Retorna dados
    else Ação com API
        JS->>API: 3b. Chama Web API
        API-->>JS: 4b. Retorna resultado
    end
    
    JS->>UI: 5. Atualiza interface
    
    opt Acessibilidade ativa
        JS->>AI: 6. Notifica mudança
        AI->>API: 7. Usa Speech API
        API-->>AI: 8. Confirma síntese
        AI-->>U: 9. Feedback sonoro
    end
    
    UI-->>U: 10. Mostra resultado final
```

## 🏛️ Arquitetura Detalhada

### 📱 **Camada de Apresentação**
- **Frontend SPA** (Single Page Application)
- **Duas versões**: Padrão e Acessível
- **Design responsivo** com CSS Grid e Flexbox
- **Navegação por abas** sem recarregamento

### 🧠 **Camada de Lógica**
- **JavaScript Vanilla** para máxima compatibilidade
- **Modularização** por funcionalidades
- **Event-driven architecture** para interações
- **State management** via LocalStorage

### 💾 **Camada de Dados**
- **LocalStorage** como banco de dados local
- **JSON** para estruturação de dados
- **Persistência offline** completa
- **Backup automático** no navegador

### ♿ **Camada de Acessibilidade**
- **IA de Acessibilidade** integrada
- **Web Speech API** para síntese e reconhecimento
- **WCAG 2.1 AA** compliance
- **Múltiplos modos** de interação

## 🎯 Padrões Arquiteturais

### **MVC Pattern**
- **Model**: LocalStorage + JSON
- **View**: HTML + CSS
- **Controller**: JavaScript Events

### **Observer Pattern**
- **Event Listeners** para mudanças de estado
- **Reactive Updates** na interface
- **Real-time Statistics** no dashboard

### **Strategy Pattern**
- **Múltiplas estratégias** de acessibilidade
- **Diferentes modos** de interação
- **Adaptação dinâmica** às necessidades

## 📊 Métricas de Performance

- **Tempo de carregamento**: < 2 segundos
- **Tamanho total**: < 500KB
- **Compatibilidade**: 95%+ navegadores modernos
- **Acessibilidade**: WCAG 2.1 AA compliant
- **Responsividade**: Mobile-first design

## 🔐 Segurança

- **Client-side only**: Sem exposição de dados
- **LocalStorage encryption**: Dados sensíveis protegidos
- **XSS Protection**: Sanitização de inputs
- **HTTPS Ready**: Preparado para produção segura

---

*Diagrama criado com Mermaid para o Q Developer Quest TDC 2025*