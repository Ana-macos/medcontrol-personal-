# 🏗️ Arquitetura do MedControl Personal

## 📊 Diagrama de Arquitetura

```mermaid
graph TB
    subgraph "Frontend - Interface do Usuário"
        A[index.html - Sistema Principal]
        B[index-acessivel.html - Versão Acessível]
        C[styles.css - Estilos Padrão]
        D[styles-acessivel.css - Estilos Acessíveis]
        E[script.js - Lógica Principal]
        F[script-acessivel.js - IA de Acessibilidade]
    end

    subgraph "Camada de Apresentação"
        G[Dashboard]
        H[Controle de Exames]
        I[Medicamentos]
        J[Vacinas]
        K[Dentista]
        L[Saúde Mental]
        M[Nutrição]
        N[Saúde da Família]
    end

    subgraph "Recursos de Acessibilidade"
        O[Web Speech API]
        P[Reconhecimento de Voz]
        Q[Síntese de Voz]
        R[ARIA Labels]
        S[Navegação por Teclado]
        T[Alto Contraste]
    end

    subgraph "Armazenamento Local"
        U[(LocalStorage)]
        V[Exames]
        W[Medicamentos]
        X[Vacinas]
        Y[Humor]
        Z[Refeições]
        AA[Família]
        BB[Preferências]
    end

    subgraph "APIs Nativas do Browser"
        CC[Web Storage API]
        DD[Web Speech API]
        EE[Geolocation API]
        FF[Notification API]
    end

    subgraph "Bibliotecas Externas"
        GG[Font Awesome - Ícones]
        HH[Google Fonts - Tipografia]
    end

    %% Conexões Frontend
    A --> G
    A --> H
    A --> I
    A --> J
    A --> K
    A --> L
    A --> M
    A --> N
    
    B --> G
    B --> H
    B --> I
    B --> J
    B --> K
    B --> L
    B --> M
    B --> N

    %% Conexões de Acessibilidade
    F --> O
    F --> P
    F --> Q
    F --> R
    F --> S
    F --> T

    %% Conexões de Dados
    E --> U
    F --> U
    U --> V
    U --> W
    U --> X
    U --> Y
    U --> Z
    U --> AA
    U --> BB

    %% Conexões APIs
    E --> CC
    F --> DD
    E --> EE
    E --> FF

    %% Conexões Externas
    A --> GG
    B --> GG
    A --> HH
    B --> HH

    %% Estilos
    C --> A
    D --> B
    E --> A
    F --> B

    classDef frontend fill:#e1f5fe
    classDef accessibility fill:#f3e5f5
    classDef storage fill:#e8f5e8
    classDef api fill:#fff3e0
    classDef external fill:#fce4ec

    class A,B,C,D,E,F frontend
    class O,P,Q,R,S,T accessibility
    class U,V,W,X,Y,Z,AA,BB storage
    class CC,DD,EE,FF api
    class GG,HH external
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

## 🔄 Fluxo de Dados

```mermaid
sequenceDiagram
    participant U as Usuário
    participant UI as Interface
    participant JS as JavaScript
    participant LS as LocalStorage
    participant API as Web APIs

    U->>UI: Interage com sistema
    UI->>JS: Dispara evento
    JS->>LS: Salva/Recupera dados
    LS-->>JS: Retorna dados
    JS->>API: Usa APIs nativas
    API-->>JS: Retorna resultado
    JS->>UI: Atualiza interface
    UI-->>U: Mostra resultado
```

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

## 🔧 Componentes Principais

### **Sistema de Autenticação**
```mermaid
graph LR
    A[Login Form] --> B[Validation]
    B --> C[User Storage]
    C --> D[Session Management]
    D --> E[Dashboard Access]
```

### **Gerenciamento de Estado**
```mermaid
graph LR
    A[User Action] --> B[Event Handler]
    B --> C[Data Processing]
    C --> D[LocalStorage Update]
    D --> E[UI Refresh]
```

### **Sistema de Acessibilidade**
```mermaid
graph LR
    A[Accessibility Panel] --> B[Mode Selection]
    B --> C[DOM Manipulation]
    C --> D[CSS Classes]
    D --> E[Enhanced Experience]
```

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