# 📋 Passo a Passo Completo - Q Developer Quest TDC 2025

## 🎯 **ETAPA 1 - Bolsinha AWS** ✅

### 1. Inicializar Git
```bash
cd /Users/anaflavia/controle-exames-medicos
git init
git add .
git commit -m "MedControl Personal - Sistema completo com Amazon Q Developer"
```

### 2. Criar repositório no GitHub
- Acesse [github.com](https://github.com)
- Clique em "New repository"
- Nome: `medcontrol-personal`
- Descrição: `Sistema Completo de Gestão em Saúde - Q Developer Quest TDC 2025`
- ✅ Public
- ✅ Add tag: `q-developer-quest-tdc-2025`

### 3. Conectar e enviar
```bash
git remote add origin https://github.com/SEU-USUARIO/medcontrol-personal.git
git branch -M main
git push -u origin main
git tag -a "q-developer-quest-tdc-2025" -m "Projeto Q Developer Quest"
git push origin q-developer-quest-tdc-2025
```

### 4. Tirar screenshot
- Abra `index.html` no navegador
- Login: `admin` / `admin123`
- Print do dashboard funcionando
- Salve como `screenshot.png`

---

## 🎒 **ETAPA 2 - Mochilinha AWS** ✅

### 5. Instalar Node.js e dependências
```bash
npm install
```

### 6. Executar testes
```bash
npm test
```

### 7. Commit
```bash
git add .
git commit -m "Etapa 2: Testes e arquitetura"
git push
```

---

## 🍶 **ETAPA 3 - Garrafa + Toalha AWS**

### 8. Instalar MCP Server
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

### 9. Deploy na AWS
```bash
# Configurar AWS CLI
aws configure

# Deploy CloudFormation
aws cloudformation create-stack \
  --stack-name medcontrol-personal \
  --template-body file://infrastructure/deploy.yml \
  --region us-east-1

# Upload arquivos para S3
aws s3 sync . s3://medcontrol-personal-$(aws sts get-caller-identity --query Account --output text) \
  --exclude "node_modules/*" --exclude ".git/*"
```

### 10. Commit infraestrutura
```bash
git add .
git commit -m "Etapa 3: MCP + IaC + Deploy AWS"
git push
```

---

## 👕 **ETAPA 4 - Camiseta Capivara AWS**

### 11. Calcular custos AWS
- S3: $0.023/GB/mês
- CloudFront: $0.085/GB transferência
- Estimativa mensal: ~$5-10 USD

### 12. Atualizar README com custos
```bash
git add README.md
git commit -m "Etapa 4: Estimativa de custos AWS"
git push
```

---

## 🎙️ **ETAPA 5 - AWS Cloud Drops**

### 13. Preparar apresentação
- Demo ao vivo funcionando
- Explicar uso do Amazon Q Developer
- Mostrar código gerado por IA
- Destacar funcionalidades únicas

---

## 🏆 **No Estande da AWS - TDC São Paulo**

### Checklist para apresentação:
- [ ] Laptop com projeto rodando
- [ ] GitHub aberto mostrando código
- [ ] README.md completo visível
- [ ] Demonstração da busca por países
- [ ] Explicar prompts do Amazon Q Developer

### O que levar:
1. **Projeto funcionando** no navegador
2. **GitHub público** com tag correta
3. **README.md** completo
4. **Testes passando** (`npm test`)
5. **Deploy AWS** funcionando (Etapa 3+)

### Pitch de 2 minutos:
*"MedControl Personal resolve o problema real de organização médica pessoal. Desenvolvido 100% com Amazon Q Developer através de prompts inteligentes. Inclui base única de 195+ países com vacinas obrigatórias. Sistema completo: exames, medicamentos, vacinas, dentista. Dados seguros no LocalStorage. Demonstra o poder da IA no desenvolvimento."*

---

## 🚀 **Comandos Rápidos**

### Testar localmente:
```bash
open index.html
# ou
python -m http.server 8000
```

### Executar testes:
```bash
npm test
```

### Ver no GitHub:
```bash
git remote -v
```

### Status do projeto:
```bash
git status
git log --oneline
```

---

## ✅ **Verificação Final**

Antes de ir ao estande, confirme:

- [ ] ✅ Repositório público no GitHub
- [ ] ✅ Tag `q-developer-quest-tdc-2025`
- [ ] ✅ README.md completo com screenshots
- [ ] ✅ Lista de prompts documentada
- [ ] ✅ Testes automatizados funcionando
- [ ] ✅ Diagrama de arquitetura
- [ ] ✅ Projeto rodando perfeitamente
- [ ] ✅ Demo preparada (2-3 minutos)

**🎯 Seu projeto está PRONTO para conquistar todos os prêmios!**