// Importando funcionalidades base do script original
// Dados de usuários
const users = [
    { username: 'admin', password: 'admin123', fullName: 'Administrador' },
    { username: 'demo', password: 'demo123', fullName: 'Usuário Demonstração' }
];

let currentUser = null;

// Dados
let exames = JSON.parse(localStorage.getItem('medcontrol_exames_acessivel')) || [];
let medicamentos = JSON.parse(localStorage.getItem('medcontrol_medicamentos_acessivel')) || [];
let vacinas = JSON.parse(localStorage.getItem('medcontrol_vacinas_acessivel')) || [];
let dentista = JSON.parse(localStorage.getItem('medcontrol_dentista_acessivel')) || [];
let agendamentos = JSON.parse(localStorage.getItem('medcontrol_agendamentos_acessivel')) || [];
let humor = JSON.parse(localStorage.getItem('medcontrol_humor_acessivel')) || [];
let terapia = JSON.parse(localStorage.getItem('medcontrol_terapia_acessivel')) || [];
let refeicoes = JSON.parse(localStorage.getItem('medcontrol_refeicoes_acessivel')) || [];
let aguaConsumida = parseInt(localStorage.getItem('medcontrol_agua_acessivel')) || 0;
let membrosFamilia = JSON.parse(localStorage.getItem('medcontrol_familia_acessivel')) || [];
let marcosDesenvolvimento = JSON.parse(localStorage.getItem('medcontrol_marcos_acessivel')) || [];
let contatosEmergencia = JSON.parse(localStorage.getItem('medcontrol_contatos_acessivel')) || [];

// IA de Acessibilidade - Variáveis globais
let accessibilityAI = {
    screenReaderActive: false,
    voiceAssistantActive: false,
    highContrast: false,
    largeText: false,
    motionReduced: false,
    keyboardNavActive: false,
    colorBlindMode: false,
    recognition: null,
    synthesis: null
};

// Inicialização com recursos de acessibilidade IA
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Inicializar IA de Acessibilidade
    initAccessibilityAI();
    
    // Pré-carregar vozes para síntese de fala
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
        speechSynthesis.addEventListener('voiceschanged', () => {
            const voices = speechSynthesis.getVoices();
            console.log('Vozes disponíveis:', voices.filter(v => v.lang.includes('pt')).map(v => v.name));
        });
    }
    
    // Configurar navegação por teclado
    setupKeyboardNavigation();
    
    // Anunciar mudanças de página para screen readers
    setupScreenReaderAnnouncements();
    
    // Configurar atalhos de teclado
    setupKeyboardShortcuts();
    
    // Detectar preferências do usuário
    detectUserPreferences();
});

// Navegação por teclado aprimorada
function setupKeyboardNavigation() {
    // Navegação entre cards com setas
    document.addEventListener('keydown', (e) => {
        const focusedElement = document.activeElement;
        
        if (focusedElement.classList.contains('stat-card') || 
            focusedElement.classList.contains('tip-card')) {
            
            let nextElement = null;
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    nextElement = focusedElement.nextElementSibling;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextElement = focusedElement.previousElementSibling;
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    focusedElement.click();
                    return;
            }
            
            if (nextElement && (nextElement.classList.contains('stat-card') || 
                               nextElement.classList.contains('tip-card'))) {
                e.preventDefault();
                nextElement.focus();
            }
        }
    });
}

// Anúncios para screen readers
function setupScreenReaderAnnouncements() {
    // Criar região live para anúncios
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-announcements';
    document.body.appendChild(liveRegion);
}

function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-announcements');
    if (liveRegion) {
        liveRegion.textContent = message;
        // Limpar após 3 segundos
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 3000);
    }
}

// Atalhos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt + número para navegação rápida
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showTab('dashboard');
                    announceToScreenReader('Navegando para Dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    showTab('exames');
                    announceToScreenReader('Navegando para Exames');
                    break;
                case '3':
                    e.preventDefault();
                    showTab('medicamentos');
                    announceToScreenReader('Navegando para Medicamentos');
                    break;
                case '4':
                    e.preventDefault();
                    showTab('vacinas');
                    announceToScreenReader('Navegando para Vacinas');
                    break;
                case '5':
                    e.preventDefault();
                    showTab('saude-mental');
                    announceToScreenReader('Navegando para Saúde Mental');
                    break;
            }
        }
    });
}

// Sistema de áudio para acessibilidade - Versão completa
function speakWellnessTip(tipType) {
    const tips = {
        meditation: 'Meditação e Mindfulness: Pratique 10 a 15 minutos diários de meditação. Use aplicativos com áudio-descrição ou meditações guiadas para reduzir estresse e ansiedade.',
        exercise: 'Exercícios Adaptados: Atividade física regular melhora o humor. Adapte exercícios às suas necessidades: caminhada, natação, yoga em cadeira ou exercícios de respiração.',
        journaling: 'Registro de Emoções: Escreva ou grave áudios sobre seus sentimentos. Use tecnologias assistivas como ditado por voz para processar emoções e pensamentos.',
        sleep: 'Higiene do Sono: Durma 7 a 8 horas por noite. Crie rotinas acessíveis: alarmes vibratórios, ambiente escuro, temperatura adequada e evite telas antes de dormir.',
        social: 'Conexões Sociais: Mantenha contato com amigos e família. Use videochamadas, mensagens de voz ou encontros presenciais adaptados às suas necessidades.',
        breathing: 'Técnicas de Respiração: Pratique respiração profunda: inspire por 4 segundos, segure por 4, expire por 6. Use aplicativos com feedback tátil ou sonoro para guiar o ritmo.',
        nature: 'Contato com a Natureza: Passe tempo ao ar livre ou perto de plantas. Use os sentidos: ouça pássaros, sinta texturas de folhas, respire ar fresco para reduzir estresse.',
        routine: 'Rotinas Estruturadas: Crie rotinas diárias previsíveis. Use lembretes sonoros, visuais ou táteis para manter consistência e redução da ansiedade.'
    };
    
    if ('speechSynthesis' in window) {
        // Parar qualquer fala anterior
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(tips[tipType]);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.85; // Velocidade natural
        utterance.pitch = 0.95; // Tom quase humano
        utterance.volume = 0.9;
        
        // Selecionar melhor voz disponível
        const selectBestVoice = () => {
            const voices = speechSynthesis.getVoices();
            
            // Prioridade: vozes neurais/premium
            const neuralVoice = voices.find(voice => 
                voice.lang.includes('pt') && 
                (voice.name.includes('Neural') || 
                 voice.name.includes('Premium') || 
                 voice.name.includes('Enhanced') ||
                 voice.name.includes('Wavenet') ||
                 voice.name.includes('Studio'))
            );
            
            // Segundo: vozes de qualidade
            const qualityVoice = voices.find(voice => 
                voice.lang.includes('pt') && 
                (voice.name.includes('Google português do Brasil') ||
                 voice.name.includes('Microsoft Helena') ||
                 voice.name.includes('Microsoft Daniel') ||
                 voice.name.includes('Luciana'))
            );
            
            // Terceiro: vozes online
            const fallbackVoice = voices.find(voice => 
                voice.lang.includes('pt') && voice.localService === false
            );
            
            return neuralVoice || qualityVoice || fallbackVoice || voices.find(voice => voice.lang.includes('pt'));
        };
        
        const preferredVoice = selectBestVoice();
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Feedback visual e acessível
        const button = event.target.closest('.tip-audio-btn');
        const originalText = button.innerHTML;
        const originalClass = button.className;
        
        button.innerHTML = '<i class="fas fa-stop" aria-hidden="true"></i> Pausar';
        button.className = originalClass + ' playing';
        button.setAttribute('aria-label', 'Pausar reprodução da dica');
        
        // Anunciar início da reprodução
        announceToScreenReader('Iniciando reprodução de áudio da dica');
        
        // Aguardar carregamento das vozes se necessário
        if (speechSynthesis.getVoices().length === 0) {
            button.classList.add('audio-loading');
            speechSynthesis.addEventListener('voiceschanged', () => {
                const newVoice = selectBestVoice();
                if (newVoice) utterance.voice = newVoice;
                button.classList.remove('audio-loading');
                speechSynthesis.speak(utterance);
            }, { once: true });
        } else {
            speechSynthesis.speak(utterance);
        }
        
        utterance.onstart = () => {
            console.log('Usando voz:', preferredVoice ? preferredVoice.name : 'Padrão');
            button.classList.remove('audio-loading');
        };
        
        utterance.onend = () => {
            button.innerHTML = originalText;
            button.className = originalClass;
            button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Pausar reprodução da dica', 'Ouvir dica'));
            announceToScreenReader('Reprodução de áudio finalizada');
        };
        
        utterance.onerror = () => {
            button.innerHTML = originalText;
            button.className = originalClass;
            button.classList.remove('audio-loading');
            announceToScreenReader('Erro na reprodução de áudio');
            showAlert('Erro ao reproduzir áudio. Tentando voz alternativa...', 'error');
        };
        
        // Permitir pausar clicando novamente
        button.onclick = (e) => {
            e.preventDefault();
            speechSynthesis.cancel();
            button.innerHTML = originalText;
            button.className = originalClass;
            announceToScreenReader('Reprodução de áudio pausada');
        };
        
    } else {
        announceToScreenReader('Síntese de voz não disponível neste navegador');
        showAlert('Seu navegador não suporta síntese de voz. Considere usar um navegador mais recente.', 'error');
    }
}

// Navegação entre abas com acessibilidade
function showTab(tabName) {
    // Atualizar ARIA states
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativar aba selecionada
    const targetButton = document.querySelector(`.tab-button[onclick*="${tabName}"]`);
    if (targetButton) {
        targetButton.setAttribute('aria-pressed', 'true');
        targetButton.classList.add('active');
    }
    
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
        targetContent.classList.add('active');
        
        // Focar no título da seção para screen readers
        const sectionTitle = targetContent.querySelector('h2');
        if (sectionTitle) {
            sectionTitle.focus();
        }
    }
    
    // Anunciar mudança de seção
    const sectionNames = {
        'dashboard': 'Dashboard',
        'exames': 'Exames',
        'medicamentos': 'Medicamentos',
        'vacinas': 'Vacinas',
        'dentista': 'Dentista',
        'saude-mental': 'Saúde Mental',
        'nutricao': 'Nutrição',
        'familia': 'Saúde da Família'
    };
    
    announceToScreenReader(`Navegando para seção ${sectionNames[tabName] || tabName}`);
}

// Funções básicas adaptadas (login, logout, etc.)
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        announceToScreenReader('Por favor, preencha todos os campos');
        showAlert('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        announceToScreenReader('Login realizado com sucesso');
        showAlert('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            showMainSystem();
        }, 1000);
    } else {
        announceToScreenReader('Usuário ou senha incorretos');
        showAlert('Usuário ou senha incorretos.', 'error');
    }
}

function loginAsDemo() {
    const demoUser = users.find(u => u.username === 'demo');
    if (demoUser) {
        currentUser = demoUser;
        announceToScreenReader('Entrando na demonstração');
        showAlert('Entrando na demonstração...', 'success');
        setTimeout(() => {
            showMainSystem();
        }, 1000);
    }
}

function showMainSystem() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-system').classList.add('active');
    document.getElementById('user-name').textContent = currentUser.fullName;
    
    // Focar no conteúdo principal
    document.getElementById('main-content').focus();
    
    announceToScreenReader(`Bem-vindo ao MedControl Personal Acessível, ${currentUser.fullName}`);
    updateDashboard();
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        currentUser = null;
        document.getElementById('main-system').classList.remove('active');
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        // Focar no campo de usuário
        document.getElementById('username').focus();
        
        announceToScreenReader('Logout realizado com sucesso');
    }
}

// Função para adicionar água com feedback acessível
function addWater(amount) {
    aguaConsumida += amount;
    localStorage.setItem('medcontrol_agua_acessivel', aguaConsumida);
    updateWaterDisplay();
    
    const percentage = Math.min((aguaConsumida / 2000) * 100, 100);
    announceToScreenReader(`${amount}ml de água adicionado. Total: ${aguaConsumida}ml de 2000ml. ${Math.round(percentage)}% da meta diária atingida.`);
    
    showAlert(`+${amount}ml de água adicionado!`, 'success');
}

function updateWaterDisplay() {
    const percentage = Math.min((aguaConsumida / 2000) * 100, 100);
    const waterFill = document.getElementById('water-fill');
    const waterAmount = document.getElementById('water-amount');
    
    if (waterFill) {
        waterFill.style.width = percentage + '%';
        waterFill.setAttribute('aria-valuenow', percentage);
        waterFill.setAttribute('aria-valuetext', `${percentage}% da meta diária de água`);
    }
    
    if (waterAmount) {
        waterAmount.textContent = `${aguaConsumida}ml / 2000ml`;
    }
}

// Dashboard com acessibilidade
function updateDashboard() {
    document.getElementById('total-exames').textContent = exames.length;
    document.getElementById('total-medicamentos').textContent = medicamentos.length;
    document.getElementById('total-vacinas').textContent = vacinas.length;
    document.getElementById('total-dentista').textContent = dentista.length;
    document.getElementById('total-humor').textContent = humor.length;
    document.getElementById('total-refeicoes').textContent = refeicoes.length;
    
    updateRecentActivities();
}

function updateRecentActivities() {
    const recentList = document.getElementById('recent-list');
    const allActivities = [];
    
    // Adicionar atividades recentes
    exames.slice(-2).forEach(exame => {
        allActivities.push({
            type: 'exame',
            icon: 'fas fa-file-medical-alt',
            title: exame.nome,
            subtitle: `Médico: ${exame.medico || 'Não informado'}`,
            date: exame.data
        });
    });
    
    medicamentos.slice(-2).forEach(med => {
        allActivities.push({
            type: 'medicamento',
            icon: 'fas fa-pills',
            title: med.nome,
            subtitle: `Dosagem: ${med.dosagem}`,
            date: new Date().toISOString().split('T')[0]
        });
    });
    
    // Ordenar por data
    allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allActivities.length === 0) {
        recentList.innerHTML = '<p role="status">Nenhuma atividade recente</p>';
        return;
    }
    
    recentList.innerHTML = allActivities.slice(0, 3).map((activity, index) => `
        <div class="recent-item" role="listitem" tabindex="0" aria-label="Atividade ${index + 1}: ${activity.title}">
            <div class="recent-icon">
                <i class="${activity.icon}" aria-hidden="true"></i>
            </div>
            <div class="recent-info">
                <h4>${activity.title}</h4>
                <p>${activity.subtitle}</p>
            </div>
            <div class="recent-date">
                <time datetime="${activity.date}">${new Date(activity.date).toLocaleDateString('pt-BR')}</time>
            </div>
        </div>
    `).join('');
}

// Alertas acessíveis
function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.setAttribute('role', 'alert');
    alert.setAttribute('aria-live', 'assertive');
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    alert.innerHTML = `
        <i class="fas fa-${icon}" aria-hidden="true"></i>
        <span>${message}</span>
    `;
    
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(alert);
    
    // Anunciar para screen readers
    announceToScreenReader(message);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Modais acessíveis
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        
        // Focar no primeiro campo do formulário
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Trap focus no modal
        trapFocus(modal);
        
        announceToScreenReader('Modal aberto');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        announceToScreenReader('Modal fechado');
    }
}

// Trap focus em modais
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
        
        if (e.key === 'Escape') {
            closeModal(element.id);
        }
    });
}

// Todas as funções do sistema original adaptadas para acessibilidade

// Renderização de exames
function renderExames() {
    const container = document.getElementById('exames-list');
    
    if (exames.length === 0) {
        container.innerHTML = `
            <div class="welcome-message" role="status">
                <h3>📋 Nenhum exame cadastrado</h3>
                <p>Clique em "Adicionar Exame" para começar a gerenciar seus exames médicos.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = exames.map((exame, index) => `
        <article class="exam-card" tabindex="0" aria-label="Exame ${exame.nome}, ${exame.status}">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${exame.nome}</div>
                    <span class="status-badge status-${exame.status}">${exame.status.charAt(0).toUpperCase() + exame.status.slice(1)}</span>
                </div>
                <button class="btn-delete" onclick="deleteExame(${index})" aria-label="Excluir exame ${exame.nome}">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Data:</span> <strong><time datetime="${exame.data}">${new Date(exame.data).toLocaleDateString('pt-BR')}</time></strong></div>
                ${exame.medico ? `<div><span>Médico:</span> <strong>${exame.medico}</strong></div>` : ''}
            </div>
        </article>
    `).join('');
}

function deleteExame(index) {
    const exame = exames[index];
    if (confirm(`Tem certeza que deseja excluir o exame "${exame.nome}"?`)) {
        exames.splice(index, 1);
        localStorage.setItem('medcontrol_exames_acessivel', JSON.stringify(exames));
        renderExames();
        updateDashboard();
        announceToScreenReader(`Exame ${exame.nome} excluído com sucesso`);
    }
}

// Renderização de medicamentos
function renderMedicamentos() {
    const container = document.getElementById('medicamentos-list');
    
    if (medicamentos.length === 0) {
        container.innerHTML = `
            <div class="welcome-message" role="status">
                <h3>💊 Nenhum medicamento cadastrado</h3>
                <p>Clique em "Adicionar Medicamento" para começar a controlar seus medicamentos.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = medicamentos.map((med, index) => `
        <article class="exam-card" tabindex="0" aria-label="Medicamento ${med.nome}">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${med.nome}</div>
                </div>
                <button class="btn-delete" onclick="deleteMedicamento(${index})" aria-label="Excluir medicamento ${med.nome}">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Dosagem:</span> <strong>${med.dosagem}</strong></div>
                <div><span>Frequência:</span> <strong>${med.frequencia}</strong></div>
                ${med.medico ? `<div><span>Médico:</span> <strong>${med.medico}</strong></div>` : ''}
            </div>
        </article>
    `).join('');
}

function deleteMedicamento(index) {
    const med = medicamentos[index];
    if (confirm(`Tem certeza que deseja excluir o medicamento "${med.nome}"?`)) {
        medicamentos.splice(index, 1);
        localStorage.setItem('medcontrol_medicamentos_acessivel', JSON.stringify(medicamentos));
        renderMedicamentos();
        updateDashboard();
        announceToScreenReader(`Medicamento ${med.nome} excluído com sucesso`);
    }
}

// Renderização de vacinas
function renderVacinas() {
    const container = document.getElementById('vacinas-list');
    
    if (vacinas.length === 0) {
        container.innerHTML = `
            <div class="welcome-message" role="status">
                <h3>💉 Nenhuma vacina cadastrada</h3>
                <p>Clique em "Adicionar Vacina" para começar a controlar suas vacinas.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = vacinas.map((vacina, index) => `
        <article class="exam-card" tabindex="0" aria-label="Vacina ${vacina.nome}">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${vacina.nome}</div>
                </div>
                <button class="btn-delete" onclick="deleteVacina(${index})" aria-label="Excluir vacina ${vacina.nome}">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Data:</span> <strong><time datetime="${vacina.data}">${new Date(vacina.data).toLocaleDateString('pt-BR')}</time></strong></div>
                <div><span>Local:</span> <strong>${vacina.local}</strong></div>
                ${vacina.proxima ? `<div><span>Próxima dose:</span> <strong><time datetime="${vacina.proxima}">${new Date(vacina.proxima).toLocaleDateString('pt-BR')}</time></strong></div>` : ''}
            </div>
        </article>
    `).join('');
}

function deleteVacina(index) {
    const vacina = vacinas[index];
    if (confirm(`Tem certeza que deseja excluir a vacina "${vacina.nome}"?`)) {
        vacinas.splice(index, 1);
        localStorage.setItem('medcontrol_vacinas_acessivel', JSON.stringify(vacinas));
        renderVacinas();
        updateDashboard();
        announceToScreenReader(`Vacina ${vacina.nome} excluída com sucesso`);
    }
}

// Síntese de voz para dicas nutricionais
function speakNutritionTip(tipType) {
    const tips = {
        frutas: '5 Porções de Frutas e Vegetais: Consuma pelo menos 5 porções coloridas por dia. Varie as cores: verde como brócolis, laranja como cenoura, roxo como berinjela para obter diferentes nutrientes.',
        cereais: 'Cereais Integrais: Substitua alimentos refinados por integrais: arroz integral, aveia, quinoa, pão integral. São ricos em fibras, vitaminas do complexo B e minerais.',
        proteinas: 'Proteínas Magras: Inclua peixes pelo menos 2 vezes por semana, frango sem pele, ovos, leguminosas como feijão e lentilha, tofu e castanhas na sua dieta diária.'
    };
    
    if ('speechSynthesis' in window && tips[tipType]) {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(tips[tipType]);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.85;
        utterance.pitch = 0.95;
        utterance.volume = 0.9;
        
        const button = event.target.closest('.tip-audio-btn');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-stop" aria-hidden="true"></i> Pausar';
        button.classList.add('playing');
        
        utterance.onend = () => {
            button.innerHTML = originalText;
            button.classList.remove('playing');
        };
        
        speechSynthesis.speak(utterance);
        announceToScreenReader('Iniciando reprodução de dica nutricional');
    }
}

// Navegação entre abas de nutrição
function showNutritionTab(tabName) {
    document.querySelectorAll('.nutrition-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.nutrition-tab-btn').forEach(btn => {
        btn.setAttribute('aria-selected', 'false');
        btn.classList.remove('active');
    });
    
    if (tabName === 'diario') {
        document.getElementById('diario-alimentar').classList.add('active');
        renderRefeicoes();
    } else if (tabName === 'agua') {
        document.getElementById('controle-agua').classList.add('active');
        updateWaterDisplay();
    } else {
        document.getElementById('dicas-nutricionais').classList.add('active');
    }
    
    if (event && event.target) {
        event.target.setAttribute('aria-selected', 'true');
        event.target.classList.add('active');
    }
}

// Renderização de refeições
function renderRefeicoes() {
    const container = document.getElementById('refeicoes-list');
    
    if (refeicoes.length === 0) {
        container.innerHTML = `
            <div class="welcome-message" role="status">
                <h3>🍽️ Nenhuma refeição registrada</h3>
                <p>Comece a acompanhar sua alimentação registrando suas refeições.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = refeicoes.map((refeicao, index) => `
        <article class="meal-card" tabindex="0" aria-label="Refeição ${refeicao.tipo}">
            <div class="meal-header">
                <div>
                    <h4>${refeicao.tipo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                    <div class="meal-time"><time datetime="${refeicao.horario}">${refeicao.horario}</time></div>
                </div>
                <button class="btn-delete" onclick="deleteRefeicao(${index})" aria-label="Excluir refeição">Excluir</button>
            </div>
            <p><strong>Alimentos:</strong> ${refeicao.alimentos}</p>
        </article>
    `).join('');
}

function deleteRefeicao(index) {
    const refeicao = refeicoes[index];
    if (confirm(`Tem certeza que deseja excluir esta refeição?`)) {
        refeicoes.splice(index, 1);
        localStorage.setItem('medcontrol_refeicoes_acessivel', JSON.stringify(refeicoes));
        renderRefeicoes();
        updateDashboard();
        announceToScreenReader('Refeição excluída com sucesso');
    }
}

// Formulários acessíveis
document.addEventListener('DOMContentLoaded', function() {
    // Exame form
    const exameForm = document.getElementById('exame-form');
    if (exameForm) {
        exameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const exame = {
                nome: document.getElementById('exame-nome').value,
                medico: document.getElementById('exame-medico').value,
                data: document.getElementById('exame-data').value,
                status: document.getElementById('exame-status').value
            };
            
            exames.push(exame);
            localStorage.setItem('medcontrol_exames_acessivel', JSON.stringify(exames));
            
            closeModal('exame-modal');
            e.target.reset();
            renderExames();
            updateDashboard();
            announceToScreenReader(`Exame ${exame.nome} adicionado com sucesso`);
            showAlert('Exame adicionado com sucesso!', 'success');
        });
    }
    
    // Medicamento form
    const medicamentoForm = document.getElementById('medicamento-form');
    if (medicamentoForm) {
        medicamentoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const medicamento = {
                nome: document.getElementById('med-nome').value,
                dosagem: document.getElementById('med-dosagem').value,
                frequencia: document.getElementById('med-frequencia').value,
                medico: document.getElementById('med-medico').value
            };
            
            medicamentos.push(medicamento);
            localStorage.setItem('medcontrol_medicamentos_acessivel', JSON.stringify(medicamentos));
            
            closeModal('medicamento-modal');
            e.target.reset();
            renderMedicamentos();
            updateDashboard();
            announceToScreenReader(`Medicamento ${medicamento.nome} adicionado com sucesso`);
            showAlert('Medicamento adicionado com sucesso!', 'success');
        });
    }
    
    // Vacina form
    const vacinaForm = document.getElementById('vacina-form');
    if (vacinaForm) {
        vacinaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const vacina = {
                nome: document.getElementById('vacina-nome').value,
                data: document.getElementById('vacina-data').value,
                local: document.getElementById('vacina-local').value,
                proxima: document.getElementById('vacina-proxima').value
            };
            
            vacinas.push(vacina);
            localStorage.setItem('medcontrol_vacinas_acessivel', JSON.stringify(vacinas));
            
            closeModal('vacina-modal');
            e.target.reset();
            renderVacinas();
            updateDashboard();
            announceToScreenReader(`Vacina ${vacina.nome} adicionada com sucesso`);
            showAlert('Vacina adicionada com sucesso!', 'success');
        });
    }
    
    // Refeição form
    const refeicaoForm = document.getElementById('refeicao-form');
    if (refeicaoForm) {
        refeicaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const refeicao = {
                data: new Date().toISOString().split('T')[0],
                tipo: document.getElementById('refeicao-tipo').value,
                horario: document.getElementById('refeicao-horario').value,
                alimentos: document.getElementById('refeicao-alimentos').value
            };
            
            refeicoes.push(refeicao);
            localStorage.setItem('medcontrol_refeicoes_acessivel', JSON.stringify(refeicoes));
            
            closeModal('refeicao-modal');
            e.target.reset();
            renderRefeicoes();
            updateDashboard();
            announceToScreenReader('Refeição registrada com sucesso');
            showAlert('Refeição registrada com sucesso!', 'success');
        });
    }
    
    // Humor form
    const humorForm = document.getElementById('humor-form');
    if (humorForm) {
        humorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const registro = {
                data: new Date().toISOString().split('T')[0],
                nivel: document.getElementById('humor-nivel').value,
                observacoes: document.getElementById('humor-observacoes').value
            };
            
            humor.push(registro);
            localStorage.setItem('medcontrol_humor_acessivel', JSON.stringify(humor));
            
            closeModal('humor-modal');
            e.target.reset();
            updateDashboard();
            announceToScreenReader('Humor registrado com sucesso');
            showAlert('Humor registrado com sucesso!', 'success');
        });
    }
});

// Reset de água
function resetWater() {
    if (confirm('Tem certeza que deseja resetar o contador de água?')) {
        aguaConsumida = 0;
        localStorage.setItem('medcontrol_agua_acessivel', aguaConsumida);
        updateWaterDisplay();
        announceToScreenReader('Água resetada para zero');
        showAlert('Água resetada para o dia!', 'info');
    }
}

// ===== IA DE ACESSIBILIDADE COMPLETA =====

// Inicializar IA de Acessibilidade
function initAccessibilityAI() {
    // Configurar controles de acessibilidade
    const accessibilityToggle = document.getElementById('toggle-accessibility');
    const accessibilityMenu = document.getElementById('accessibility-menu');
    
    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('click', () => {
            const isOpen = accessibilityMenu.classList.contains('active');
            accessibilityMenu.classList.toggle('active');
            accessibilityMenu.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
            accessibilityToggle.setAttribute('aria-label', isOpen ? 'Abrir painel de acessibilidade' : 'Fechar painel de acessibilidade');
            announceToScreenReader(isOpen ? 'Painel de acessibilidade fechado' : 'Painel de acessibilidade aberto');
        });
    }
    
    // Configurar assistente de voz
    const voiceToggle = document.getElementById('voice-toggle');
    if (voiceToggle) {
        voiceToggle.addEventListener('click', toggleVoiceAssistant);
    }
    
    // Inicializar reconhecimento de voz
    initVoiceRecognition();
    
    // Carregar preferências salvas
    loadAccessibilityPreferences();
}

// Detectar preferências do usuário
function detectUserPreferences() {
    // Alto contraste
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        toggleHighContrast(true);
    }
    
    // Movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        toggleMotionReduction(true);
    }
    
    // Modo escuro
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }
}

// Toggle Alto Contraste
function toggleHighContrast(force = null) {
    const isActive = force !== null ? force : !accessibilityAI.highContrast;
    accessibilityAI.highContrast = isActive;
    
    document.body.classList.toggle('high-contrast', isActive);
    document.getElementById('contrast-btn').setAttribute('aria-pressed', isActive.toString());
    
    saveAccessibilityPreference('highContrast', isActive);
    announceToScreenReader(isActive ? 'Alto contraste ativado' : 'Alto contraste desativado');
}

// Toggle Texto Grande
function toggleLargeText(force = null) {
    const isActive = force !== null ? force : !accessibilityAI.largeText;
    accessibilityAI.largeText = isActive;
    
    document.body.classList.toggle('large-text', isActive);
    document.getElementById('text-btn').setAttribute('aria-pressed', isActive.toString());
    
    saveAccessibilityPreference('largeText', isActive);
    announceToScreenReader(isActive ? 'Texto grande ativado' : 'Texto grande desativado');
}

// Toggle Screen Reader
function toggleScreenReader(force = null) {
    const isActive = force !== null ? force : !accessibilityAI.screenReaderActive;
    accessibilityAI.screenReaderActive = isActive;
    
    document.body.classList.toggle('screen-reader-active', isActive);
    document.getElementById('reader-btn').setAttribute('aria-pressed', isActive.toString());
    
    if (isActive) {
        // Ativar leitura automática de elementos
        enableAutoReading();
    } else {
        disableAutoReading();
    }
    
    saveAccessibilityPreference('screenReader', isActive);
    announceToScreenReader(isActive ? 'Leitor de tela ativado' : 'Leitor de tela desativado');
}

// Toggle Navegação por Teclado
function toggleKeyboardNav(force = null) {
    const isActive = force !== null ? force : !accessibilityAI.keyboardNavActive;
    accessibilityAI.keyboardNavActive = isActive;
    
    document.body.classList.toggle('keyboard-nav', isActive);
    document.getElementById('keyboard-btn').setAttribute('aria-pressed', isActive.toString());
    
    saveAccessibilityPreference('keyboardNav', isActive);
    announceToScreenReader(isActive ? 'Navegação por teclado aprimorada ativada' : 'Navegação por teclado padrão');
}

// Toggle Redução de Movimento
function toggleMotionReduction(force = null) {
    const isActive = force !== null ? force : !accessibilityAI.motionReduced;
    accessibilityAI.motionReduced = isActive;
    
    document.body.classList.toggle('motion-reduced', isActive);
    document.getElementById('motion-btn').setAttribute('aria-pressed', isActive.toString());
    
    saveAccessibilityPreference('motionReduced', isActive);
    announceToScreenReader(isActive ? 'Movimento reduzido ativado' : 'Movimento normal ativado');
}

// Toggle Modo Daltonismo
function toggleColorBlind(force = null) {
    const isActive = force !== null ? force : !accessibilityAI.colorBlindMode;
    accessibilityAI.colorBlindMode = isActive;
    
    document.body.classList.toggle('colorblind-friendly', isActive);
    document.getElementById('color-btn').setAttribute('aria-pressed', isActive.toString());
    
    saveAccessibilityPreference('colorBlind', isActive);
    announceToScreenReader(isActive ? 'Modo amigável para daltonismo ativado' : 'Modo de cores normal ativado');
}

// Assistente de Voz com IA
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        accessibilityAI.recognition = new SpeechRecognition();
        
        accessibilityAI.recognition.lang = 'pt-BR';
        accessibilityAI.recognition.continuous = false;
        accessibilityAI.recognition.interimResults = false;
        
        accessibilityAI.recognition.onstart = () => {
            document.getElementById('voice-toggle').classList.add('listening');
            showVoiceStatus('Ouvindo...');
        };
        
        accessibilityAI.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            processVoiceCommand(command);
        };
        
        accessibilityAI.recognition.onend = () => {
            document.getElementById('voice-toggle').classList.remove('listening');
            hideVoiceStatus();
        };
        
        accessibilityAI.recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            showVoiceStatus('Erro no reconhecimento');
            setTimeout(hideVoiceStatus, 2000);
        };
    }
}

// Processar comandos de voz
function processVoiceCommand(command) {
    showVoiceStatus(`Comando: ${command}`);
    
    // Comandos de navegação
    if (command.includes('dashboard') || command.includes('início')) {
        showTab('dashboard');
        speak('Navegando para o dashboard');
    } else if (command.includes('exame')) {
        showTab('exames');
        speak('Navegando para exames');
    } else if (command.includes('medicamento')) {
        showTab('medicamentos');
        speak('Navegando para medicamentos');
    } else if (command.includes('vacina')) {
        showTab('vacinas');
        speak('Navegando para vacinas');
    } else if (command.includes('dentista')) {
        showTab('dentista');
        speak('Navegando para dentista');
    } else if (command.includes('saúde mental') || command.includes('humor')) {
        showTab('saude-mental');
        speak('Navegando para saúde mental');
    } else if (command.includes('nutrição') || command.includes('alimentação')) {
        showTab('nutricao');
        speak('Navegando para nutrição');
    } else if (command.includes('família')) {
        showTab('familia');
        speak('Navegando para saúde da família');
    }
    
    // Comandos de ação
    else if (command.includes('adicionar exame')) {
        openModal('exame-modal');
        speak('Abrindo formulário para adicionar exame');
    } else if (command.includes('adicionar medicamento')) {
        openModal('medicamento-modal');
        speak('Abrindo formulário para adicionar medicamento');
    } else if (command.includes('beber água')) {
        addWater(250);
        speak('Adicionando 250 mililitros de água');
    } else if (command.includes('registrar humor')) {
        openModal('humor-modal');
        speak('Abrindo formulário para registrar humor');
    }
    
    // Comandos de acessibilidade
    else if (command.includes('alto contraste')) {
        toggleHighContrast();
    } else if (command.includes('texto grande')) {
        toggleLargeText();
    } else if (command.includes('ler tela')) {
        toggleScreenReader();
    }
    
    // Comando de ajuda
    else if (command.includes('ajuda') || command.includes('comandos')) {
        speakHelp();
    }
    
    else {
        speak('Comando não reconhecido. Diga "ajuda" para ver os comandos disponíveis.');
    }
    
    setTimeout(hideVoiceStatus, 3000);
}

// Ativar/Desativar Assistente de Voz
function toggleVoiceAssistant() {
    if (!accessibilityAI.recognition) {
        speak('Reconhecimento de voz não disponível neste navegador');
        return;
    }
    
    if (accessibilityAI.voiceAssistantActive) {
        accessibilityAI.recognition.stop();
        accessibilityAI.voiceAssistantActive = false;
        speak('Assistente de voz desativado');
    } else {
        accessibilityAI.recognition.start();
        accessibilityAI.voiceAssistantActive = true;
    }
}

// Funções de status de voz
function showVoiceStatus(message) {
    const status = document.getElementById('voice-status');
    status.textContent = message;
    status.classList.add('active');
}

function hideVoiceStatus() {
    const status = document.getElementById('voice-status');
    status.classList.remove('active');
}

// Falar texto com IA
function speak(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Selecionar melhor voz
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.includes('pt') && 
            (voice.name.includes('Google') || voice.name.includes('Microsoft'))
        ) || voices.find(voice => voice.lang.includes('pt'));
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// Ajuda por voz
function speakHelp() {
    const helpText = `
        Comandos disponíveis:
        Navegação: dashboard, exames, medicamentos, vacinas, dentista, saúde mental, nutrição, família.
        Ações: adicionar exame, adicionar medicamento, beber água, registrar humor.
        Acessibilidade: alto contraste, texto grande, ler tela.
    `;
    speak(helpText);
}

// Leitura automática
function enableAutoReading() {
    // Ler automaticamente quando elementos recebem foco
    document.addEventListener('focusin', (e) => {
        if (accessibilityAI.screenReaderActive) {
            const element = e.target;
            let textToRead = '';
            
            if (element.getAttribute('aria-label')) {
                textToRead = element.getAttribute('aria-label');
            } else if (element.textContent) {
                textToRead = element.textContent.trim();
            } else if (element.placeholder) {
                textToRead = element.placeholder;
            }
            
            if (textToRead && textToRead.length < 200) {
                setTimeout(() => speak(textToRead), 100);
            }
        }
    });
}

function disableAutoReading() {
    // Remover listeners de leitura automática
    speechSynthesis.cancel();
}

// Salvar preferências
function saveAccessibilityPreference(key, value) {
    localStorage.setItem(`accessibility_${key}`, JSON.stringify(value));
}

// Carregar preferências
function loadAccessibilityPreferences() {
    const preferences = {
        highContrast: JSON.parse(localStorage.getItem('accessibility_highContrast')) || false,
        largeText: JSON.parse(localStorage.getItem('accessibility_largeText')) || false,
        screenReader: JSON.parse(localStorage.getItem('accessibility_screenReader')) || false,
        keyboardNav: JSON.parse(localStorage.getItem('accessibility_keyboardNav')) || false,
        motionReduced: JSON.parse(localStorage.getItem('accessibility_motionReduced')) || false,
        colorBlind: JSON.parse(localStorage.getItem('accessibility_colorBlind')) || false
    };
    
    // Aplicar preferências salvas
    if (preferences.highContrast) toggleHighContrast(true);
    if (preferences.largeText) toggleLargeText(true);
    if (preferences.screenReader) toggleScreenReader(true);
    if (preferences.keyboardNav) toggleKeyboardNav(true);
    if (preferences.motionReduced) toggleMotionReduction(true);
    if (preferences.colorBlind) toggleColorBlind(true);
}

// Adicionar animação CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);