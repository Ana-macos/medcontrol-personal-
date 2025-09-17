# Arquitetura do MedControl Personal

## Diagrama de Arquitetura

```mermaid
graph TB
    subgraph "Frontend"
        A[index.html] --> B[styles.css]
        A --> C[script.js]
    end
    
    subgraph "Armazenamento"
        D[LocalStorage]
        D --> E[Exames]
        D --> F[Medicamentos]
        D --> G[Vacinas]
        D --> H[Dentista]
    end
    
    subgraph "Módulos"
        I[Login]
        J[Dashboard]
        K[Exames]
        L[Medicamentos]
        M[Vacinação]
        N[Dentista]
    end
    
    C --> D
    C --> I
    I --> J
    J --> K
    J --> L
    J --> M
    J --> N
```

## Componentes

### Frontend
- **HTML5**: Interface responsiva
- **CSS3**: Design moderno
- **JavaScript**: Lógica de negócio

### Dados
- **LocalStorage**: Persistência local
- **195+ países**: Base de vacinas
- **Certificados**: CIVP, Meningocócica, etc.

### Funcionalidades
- Sistema de login
- Dashboard interativo
- Controle médico completo
- Busca internacional de vacinas