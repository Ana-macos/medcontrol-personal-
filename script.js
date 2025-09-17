// Dados de usuários
const users = [
    { username: 'admin', password: 'admin123', fullName: 'Administrador' },
    { username: 'demo', password: 'demo123', fullName: 'Usuário Demonstração' }
];

let currentUser = null;

// Dados
let exames = JSON.parse(localStorage.getItem('medcontrol_exames')) || [];
let medicamentos = JSON.parse(localStorage.getItem('medcontrol_medicamentos')) || [];
let vacinas = JSON.parse(localStorage.getItem('medcontrol_vacinas')) || [];
let dentista = JSON.parse(localStorage.getItem('medcontrol_dentista')) || [];
let agendamentos = JSON.parse(localStorage.getItem('medcontrol_agendamentos')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
});

// Processar login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showAlert('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        showAlert('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            showMainSystem();
        }, 1000);
    } else {
        showAlert('Usuário ou senha incorretos.', 'error');
    }
}

// Login como demonstração
function loginAsDemo() {
    const demoUser = users.find(u => u.username === 'demo');
    if (demoUser) {
        currentUser = demoUser;
        showAlert('Entrando na demonstração...', 'success');
        setTimeout(() => {
            showMainSystem();
        }, 1000);
    }
}

// Mostrar sistema principal
function showMainSystem() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-system').classList.add('active');
    document.getElementById('user-name').textContent = currentUser.fullName;
    updateDashboard();
}

// Navegação entre abas
function showTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ativar aba selecionada
    document.getElementById(tabName).classList.add('active');
    
    // Ativar botão correspondente
    const targetButton = document.querySelector(`.tab-button[onclick*="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // Carregar dados específicos da aba
    if (tabName === 'exames') renderExames();
    else if (tabName === 'medicamentos') renderMedicamentos();
    else if (tabName === 'vacinas') renderVacinas();
    else if (tabName === 'dentista') renderDentista();
    
    // Se for aba de exames, mostrar exames realizados por padrão
    if (tabName === 'exames') {
        setTimeout(() => {
            document.querySelectorAll('.exam-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.exam-content').forEach(content => content.classList.remove('active'));
            document.querySelector('.exam-tab-btn').classList.add('active');
            document.getElementById('exames-realizados').classList.add('active');
        }, 100);
    }
}

// Logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        currentUser = null;
        document.getElementById('main-system').classList.remove('active');
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

// Dashboard
function updateDashboard() {
    document.getElementById('total-exames').textContent = exames.length;
    document.getElementById('total-medicamentos').textContent = medicamentos.length;
    document.getElementById('total-vacinas').textContent = vacinas.length;
    document.getElementById('total-dentista').textContent = dentista.length;
}

// Exames
function renderExames() {
    const container = document.getElementById('exames-list');
    
    if (exames.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>📋 Nenhum exame cadastrado</h3>
                <p>Clique em "Adicionar Exame" para começar a gerenciar seus exames médicos.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = exames.map((exame, index) => `
        <div class="exam-card">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${exame.nome}</div>
                    <span class="status-badge status-${exame.status}">${exame.status.charAt(0).toUpperCase() + exame.status.slice(1)}</span>
                </div>
                <button class="btn-delete" onclick="deleteExame(${index})">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Data:</span> <strong>${new Date(exame.data).toLocaleDateString('pt-BR')}</strong></div>
                ${exame.medico ? `<div><span>Médico:</span> <strong>${exame.medico}</strong></div>` : ''}
            </div>
        </div>
    `).join('');
}

function deleteExame(index) {
    exames.splice(index, 1);
    localStorage.setItem('medcontrol_exames', JSON.stringify(exames));
    renderExames();
    updateDashboard();
}

// Medicamentos
function renderMedicamentos() {
    const container = document.getElementById('medicamentos-list');
    
    if (medicamentos.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>💊 Nenhum medicamento cadastrado</h3>
                <p>Clique em "Adicionar Medicamento" para começar a controlar seus medicamentos.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = medicamentos.map((med, index) => `
        <div class="exam-card">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${med.nome}</div>
                </div>
                <button class="btn-delete" onclick="deleteMedicamento(${index})">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Dosagem:</span> <strong>${med.dosagem}</strong></div>
                <div><span>Frequência:</span> <strong>${med.frequencia}</strong></div>
                ${med.medico ? `<div><span>Médico:</span> <strong>${med.medico}</strong></div>` : ''}
            </div>
        </div>
    `).join('');
}

function deleteMedicamento(index) {
    medicamentos.splice(index, 1);
    localStorage.setItem('medcontrol_medicamentos', JSON.stringify(medicamentos));
    renderMedicamentos();
    updateDashboard();
}

// Vacinas
function renderVacinas() {
    const container = document.getElementById('vacinas-list');
    
    if (vacinas.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>💉 Nenhuma vacina cadastrada</h3>
                <p>Clique em "Adicionar Vacina" para começar a controlar suas vacinas.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = vacinas.map((vacina, index) => `
        <div class="exam-card">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${vacina.nome}</div>
                </div>
                <button class="btn-delete" onclick="deleteVacina(${index})">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Data:</span> <strong>${new Date(vacina.data).toLocaleDateString('pt-BR')}</strong></div>
                <div><span>Local:</span> <strong>${vacina.local}</strong></div>
                ${vacina.proxima ? `<div><span>Próxima dose:</span> <strong>${new Date(vacina.proxima).toLocaleDateString('pt-BR')}</strong></div>` : ''}
            </div>
        </div>
    `).join('');
}

function deleteVacina(index) {
    vacinas.splice(index, 1);
    localStorage.setItem('medcontrol_vacinas', JSON.stringify(vacinas));
    renderVacinas();
    updateDashboard();
}

// Navegação das abas de exames
function showExamTab(tabName) {
    document.querySelectorAll('.exam-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.exam-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName === 'realizados' ? 'exames-realizados' : 'exames-agendados').classList.add('active');
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Renderizar conteúdo apropriado
    if (tabName === 'realizados') {
        renderExames();
    } else {
        renderAgendamentos();
    }
}

// Navegação das abas de vacinas
function showVaccineTab(tabName) {
    document.querySelectorAll('.vaccine-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.vaccine-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName === 'minhas' ? 'minhas-vacinas' : 
                          tabName === 'calendario' ? 'calendario-vacinal' : 
                          'vacinas-internacionais').classList.add('active');
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Função para ir para a aba de vacinas
function goToVacinas() {
    showTab('vacinas');
    // Garantir que a aba "Minhas Vacinas" esteja ativa
    setTimeout(() => {
        document.querySelectorAll('.vaccine-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.vaccine-content').forEach(content => content.classList.remove('active'));
        document.querySelector('.vaccine-tab-btn').classList.add('active');
        document.getElementById('minhas-vacinas').classList.add('active');
    }, 100);
}

// Dentista
function renderDentista() {
    const container = document.getElementById('dentista-list');
    
    if (dentista.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>🦷 Nenhuma consulta cadastrada</h3>
                <p>Clique em "Adicionar Consulta" para começar a controlar suas consultas odontológicas.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = dentista.map((consulta, index) => `
        <div class="exam-card">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${consulta.procedimento}</div>
                </div>
                <button class="btn-delete" onclick="deleteDentista(${index})">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Data:</span> <strong>${new Date(consulta.data).toLocaleDateString('pt-BR')}</strong></div>
                ${consulta.custo ? `<div><span>Custo:</span> <strong>R$ ${parseFloat(consulta.custo).toFixed(2)}</strong></div>` : ''}
                ${consulta.dentista ? `<div><span>Dentista:</span> <strong>${consulta.dentista}</strong></div>` : ''}
            </div>
        </div>
    `).join('');
}

function deleteDentista(index) {
    dentista.splice(index, 1);
    localStorage.setItem('medcontrol_dentista', JSON.stringify(dentista));
    renderDentista();
    updateDashboard();
}

// Agendamentos
function renderAgendamentos() {
    const container = document.getElementById('agendamentos-list');
    
    if (agendamentos.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>📅 Nenhum exame agendado</h3>
                <p>Clique em "Agendar Exame" para começar a organizar seus próximos exames.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = agendamentos.map((agend, index) => `
        <div class="exam-card">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${agend.nome}</div>
                    <span class="status-badge status-agendado">Agendado</span>
                </div>
                <button class="btn-delete" onclick="deleteAgendamento(${index})">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Data:</span> <strong>${new Date(agend.data).toLocaleDateString('pt-BR')}</strong></div>
                <div><span>Horário:</span> <strong>${agend.horario}</strong></div>
                ${agend.medico ? `<div><span>Médico:</span> <strong>${agend.medico}</strong></div>` : ''}
                ${agend.local ? `<div><span>Local:</span> <strong>${agend.local}</strong></div>` : ''}
            </div>
        </div>
    `).join('');
}

function deleteAgendamento(index) {
    agendamentos.splice(index, 1);
    localStorage.setItem('medcontrol_agendamentos', JSON.stringify(agendamentos));
    renderAgendamentos();
}

// Modals
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Forms
document.getElementById('exame-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const exame = {
        nome: document.getElementById('exame-nome').value,
        medico: document.getElementById('exame-medico').value,
        data: document.getElementById('exame-data').value,
        status: document.getElementById('exame-status').value
    };
    
    exames.push(exame);
    localStorage.setItem('medcontrol_exames', JSON.stringify(exames));
    
    closeModal('exame-modal');
    e.target.reset();
    renderExames();
    updateDashboard();
    showAlert('Exame adicionado com sucesso!', 'success');
});

document.getElementById('medicamento-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const medicamento = {
        nome: document.getElementById('med-nome').value,
        dosagem: document.getElementById('med-dosagem').value,
        frequencia: document.getElementById('med-frequencia').value,
        medico: document.getElementById('med-medico').value
    };
    
    medicamentos.push(medicamento);
    localStorage.setItem('medcontrol_medicamentos', JSON.stringify(medicamentos));
    
    closeModal('medicamento-modal');
    e.target.reset();
    renderMedicamentos();
    updateDashboard();
    showAlert('Medicamento adicionado com sucesso!', 'success');
});

document.getElementById('vacina-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const vacina = {
        nome: document.getElementById('vacina-nome').value,
        data: document.getElementById('vacina-data').value,
        local: document.getElementById('vacina-local').value,
        proxima: document.getElementById('vacina-proxima').value
    };
    
    vacinas.push(vacina);
    localStorage.setItem('medcontrol_vacinas', JSON.stringify(vacinas));
    
    closeModal('vacina-modal');
    e.target.reset();
    renderVacinas();
    updateDashboard();
    showAlert('Vacina adicionada com sucesso!', 'success');
});

document.getElementById('dentista-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const consulta = {
        procedimento: document.getElementById('dentista-procedimento').value,
        data: document.getElementById('dentista-data').value,
        custo: document.getElementById('dentista-custo').value,
        dentista: document.getElementById('dentista-nome').value
    };
    
    dentista.push(consulta);
    localStorage.setItem('medcontrol_dentista', JSON.stringify(dentista));
    
    closeModal('dentista-modal');
    e.target.reset();
    renderDentista();
    updateDashboard();
    showAlert('Consulta adicionada com sucesso!', 'success');
});

document.getElementById('agendamento-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const agendamento = {
        nome: document.getElementById('agend-nome').value,
        data: document.getElementById('agend-data').value,
        horario: document.getElementById('agend-horario').value,
        medico: document.getElementById('agend-medico').value,
        local: document.getElementById('agend-local').value
    };
    
    agendamentos.push(agendamento);
    localStorage.setItem('medcontrol_agendamentos', JSON.stringify(agendamentos));
    
    closeModal('agendamento-modal');
    e.target.reset();
    renderAgendamentos();
    showAlert('Exame agendado com sucesso!', 'success');
});

// Mostrar alertas
function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
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

// Base de dados completa de certificados por país
const countryRequirements = {
    // África - CIVP Obrigatório
    'angola': ['CIVP - Febre Amarela'], 'benin': ['CIVP - Febre Amarela'], 'burkina faso': ['CIVP - Febre Amarela'],
    'burundi': ['CIVP - Febre Amarela'], 'camarões': ['CIVP - Febre Amarela'], 'republica centro-africana': ['CIVP - Febre Amarela'],
    'chade': ['CIVP - Febre Amarela'], 'congo': ['CIVP - Febre Amarela'], 'costa do marfim': ['CIVP - Febre Amarela'],
    'republica democratica do congo': ['CIVP - Febre Amarela'], 'guine equatorial': ['CIVP - Febre Amarela'], 'etiopia': ['CIVP - Febre Amarela'],
    'gabao': ['CIVP - Febre Amarela'], 'gana': ['CIVP - Febre Amarela'], 'guine': ['CIVP - Febre Amarela'],
    'guine-bissau': ['CIVP - Febre Amarela'], 'quenia': ['CIVP - Febre Amarela'], 'liberia': ['CIVP - Febre Amarela'],
    'mali': ['CIVP - Febre Amarela'], 'mauritania': ['CIVP - Febre Amarela'], 'niger': ['CIVP - Febre Amarela'],
    'nigeria': ['CIVP - Febre Amarela'], 'ruanda': ['CIVP - Febre Amarela'], 'senegal': ['CIVP - Febre Amarela'],
    'serra leoa': ['CIVP - Febre Amarela'], 'sudao': ['CIVP - Febre Amarela'], 'sudao do sul': ['CIVP - Febre Amarela'],
    'togo': ['CIVP - Febre Amarela'], 'uganda': ['CIVP - Febre Amarela'], 'tanzania': ['CIVP - Febre Amarela'],
    'zambia': ['CIVP - Febre Amarela'],
    
    // América do Sul - CIVP
    'argentina': ['CIVP - Febre Amarela (algumas regiões)'], 'bolivia': ['CIVP - Febre Amarela'], 'brasil': ['CIVP - Febre Amarela (algumas regiões)'],
    'colombia': ['CIVP - Febre Amarela'], 'equador': ['CIVP - Febre Amarela'], 'guiana francesa': ['CIVP - Febre Amarela'],
    'guiana': ['CIVP - Febre Amarela'], 'panama': ['CIVP - Febre Amarela (algumas regiões)'], 'peru': ['CIVP - Febre Amarela'],
    'suriname': ['CIVP - Febre Amarela'], 'venezuela': ['CIVP - Febre Amarela'],
    
    // Oriente Médio
    'arabia saudita': ['Certificado Meningocócica (Hajj/Umrah)', 'CIVP - Febre Amarela (condicional)'],
    
    // Ásia - Poliomielite
    'paquistao': ['Certificado Poliomielite (saída)'], 'afeganistao': ['Certificado Poliomielite (saída)'],
    
    // Países com CIVP Condicional
    'australia': ['CIVP - Febre Amarela (se vindo de área endêmica)'], 'china': ['CIVP - Febre Amarela (se vindo de área endêmica)'],
    'india': ['CIVP - Febre Amarela (se vindo de área endêmica)'], 'tailandia': ['CIVP - Febre Amarela (se vindo de área endêmica)'],
    'singapura': ['CIVP - Febre Amarela (se vindo de área endêmica)'], 'malasia': ['CIVP - Febre Amarela (se vindo de área endêmica)'],
    'filipinas': ['CIVP - Febre Amarela (se vindo de área endêmica)'], 'coreia do sul': ['CIVP - Febre Amarela (se vindo de área endêmica)'],
    'japao': ['CIVP - Febre Amarela (se vindo de área endêmica)'], 'nova zelandia': ['CIVP - Febre Amarela (se vindo de área endêmica)'],
    
    // Europa - Vacinas de rotina recomendadas
    'alemanha': ['Hepatite A/B (recomendada)', 'Encefalite por Carrapatos (algumas regiões)'], 
    'franca': ['Hepatite A (recomendada)'], 'italia': ['Hepatite A (recomendada)'], 
    'espanha': ['Hepatite A (recomendada)'], 'portugal': ['Hepatite A (recomendada)'], 
    'reino unido': [], 'holanda': [], 'belgica': [], 'suica': ['Encefalite por Carrapatos (algumas regiões)'],
    'austria': ['Encefalite por Carrapatos'], 'dinamarca': [], 'suecia': ['Encefalite por Carrapatos (algumas regiões)'], 
    'noruega': [], 'finlandia': ['Encefalite por Carrapatos (algumas regiões)'], 'polonia': ['Encefalite por Carrapatos'], 
    'republica tcheca': ['Encefalite por Carrapatos'], 'hungria': ['Encefalite por Carrapatos'], 
    'grecia': ['Hepatite A (recomendada)'], 'croacia': ['Encefalite por Carrapatos'], 
    'eslovenia': ['Encefalite por Carrapatos'], 'eslováquia': ['Encefalite por Carrapatos'], 
    'estonia': ['Encefalite por Carrapatos'], 'letonia': ['Encefalite por Carrapatos'], 
    'lituania': ['Encefalite por Carrapatos'], 'bulgaria': ['Hepatite A (recomendada)'], 
    'romenia': ['Hepatite A (recomendada)', 'Encefalite por Carrapatos'], 'serbia': ['Hepatite A (recomendada)'], 
    'montenegro': ['Hepatite A (recomendada)'], 'bosnia': ['Hepatite A (recomendada)'], 
    'macedonia': ['Hepatite A (recomendada)'], 'albania': ['Hepatite A (recomendada)'], 
    'moldavia': ['Hepatite A (recomendada)'], 'ucrania': ['Hepatite A (recomendada)'], 
    'belarus': ['Hepatite A (recomendada)'], 'russia': ['Hepatite A (recomendada)', 'Encefalite por Carrapatos'], 
    'islandia': [], 'irlanda': [], 'luxemburgo': [], 'malta': [], 'chipre': [],
    
    // América do Norte
    'estados unidos': [], 'canada': [], 'mexico': ['Hepatite A/B (recomendada)', 'Febre Tifoide (algumas regiões)'],
    
    // América Central e Caribe
    'guatemala': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'belize': ['Hepatite A/B (recomendada)'], 
    'honduras': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'el salvador': ['Hepatite A/B (recomendada)'], 
    'nicaragua': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'costa rica': ['Hepatite A/B (recomendada)'],
    'cuba': ['Hepatite A/B (recomendada)'], 'jamaica': ['Hepatite A/B (recomendada)'], 
    'haiti': ['Hepatite A/B (recomendada)', 'Febre Tifoide', 'Cólera'], 
    'republica dominicana': ['Hepatite A/B (recomendada)'], 'porto rico': [], 
    'barbados': ['Hepatite A (recomendada)'], 'trinidad e tobago': ['Hepatite A/B (recomendada)'],
    
    // Ásia
    'cazaquistao': ['Hepatite A/B (recomendada)'], 'uzbequistao': ['Hepatite A/B (recomendada)'], 
    'turcomenistao': ['Hepatite A/B (recomendada)'], 'quirguistao': ['Hepatite A/B (recomendada)'], 
    'tadjiquistao': ['Hepatite A/B (recomendada)'], 'mongolia': ['Hepatite A/B (recomendada)'],
    'nepal': ['Hepatite A/B (recomendada)', 'Febre Tifoide', 'Encefalite Japonesa'], 
    'butao': ['Hepatite A/B (recomendada)'], 'bangladesh': ['Hepatite A/B (recomendada)', 'Febre Tifoide', 'Cólera'], 
    'sri lanka': ['Hepatite A/B (recomendada)', 'Encefalite Japonesa'], 'maldivas': ['Hepatite A (recomendada)'], 
    'mianmar': ['Hepatite A/B (recomendada)', 'Febre Tifoide', 'Encefalite Japonesa'], 
    'laos': ['Hepatite A/B (recomendada)', 'Febre Tifoide', 'Encefalite Japonesa'], 
    'camboja': ['Hepatite A/B (recomendada)', 'Febre Tifoide', 'Encefalite Japonesa'], 
    'vietna': ['Hepatite A/B (recomendada)', 'Febre Tifoide', 'Encefalite Japonesa'], 
    'indonesia': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'brunei': ['Hepatite A (recomendada)'], 
    'timor leste': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'papua nova guine': ['Hepatite A/B (recomendada)', 'Febre Tifoide'],
    
    // Oriente Médio (outros)
    'turquia': ['Hepatite A (recomendada)'], 'ira': ['Hepatite A/B (recomendada)'], 
    'iraque': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'siria': ['Hepatite A/B (recomendada)'], 
    'libano': ['Hepatite A (recomendada)'], 'jordania': ['Hepatite A (recomendada)'], 
    'israel': ['Hepatite A (recomendada)'], 'palestina': ['Hepatite A (recomendada)'],
    'kuwait': ['Hepatite A (recomendada)'], 'bahrein': ['Hepatite A (recomendada)'], 
    'catar': ['Hepatite A (recomendada)'], 'emirados arabes unidos': ['Hepatite A (recomendada)'], 
    'oma': ['Hepatite A (recomendada)'], 'iemen': ['Hepatite A/B (recomendada)', 'Febre Tifoide', 'Cólera'],
    
    // África (outros)
    'marrocos': ['Hepatite A/B (recomendada)'], 'argelia': ['Hepatite A/B (recomendada)'], 
    'tunisia': ['Hepatite A/B (recomendada)'], 'libia': ['Hepatite A/B (recomendada)'], 
    'egito': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'eritreia': ['CIVP - Febre Amarela', 'Hepatite A/B'], 
    'djibuti': ['CIVP - Febre Amarela', 'Hepatite A/B'], 'somalia': ['CIVP - Febre Amarela', 'Hepatite A/B', 'Cólera'], 
    'madagascar': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'mauricio': ['Hepatite A (recomendada)'], 
    'seychelles': ['Hepatite A (recomendada)'], 'comores': ['CIVP - Febre Amarela (condicional)', 'Hepatite A/B'], 
    'cabo verde': ['Hepatite A/B (recomendada)'], 'sao tome e principe': ['CIVP - Febre Amarela', 'Hepatite A/B'],
    'botsuana': ['Hepatite A/B (recomendada)'], 'namibia': ['Hepatite A/B (recomendada)'], 
    'africa do sul': ['Hepatite A/B (recomendada)'], 'lesoto': ['Hepatite A/B (recomendada)'], 
    'suazilandia': ['Hepatite A/B (recomendada)'], 'zimbabue': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 
    'mocambique': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'malawi': ['Hepatite A/B (recomendada)', 'Febre Tifoide'],
    
    // Oceania
    'fiji': ['Hepatite A/B (recomendada)', 'Febre Tifoide'], 'vanuatu': ['Hepatite A/B (recomendada)'], 
    'samoa': ['Hepatite A/B (recomendada)'], 'tonga': ['Hepatite A (recomendada)'], 
    'kiribati': ['Hepatite A/B (recomendada)'], 'tuvalu': ['Hepatite A (recomendada)'], 
    'nauru': ['Hepatite A (recomendada)'], 'palau': ['Hepatite A (recomendada)'],
    'micronesia': ['Hepatite A (recomendada)'], 'ilhas marshall': ['Hepatite A (recomendada)'], 
    'ilhas salomao': ['Hepatite A/B (recomendada)']
};

// Função de busca de certificados por país
function searchCountryVaccines() {
    const input = document.getElementById('country-search').value.toLowerCase().trim();
    const results = document.getElementById('vaccine-results');
    
    if (input.length < 2) {
        results.classList.remove('show');
        return;
    }
    
    // Buscar países na base de dados
    const matches = Object.keys(countryRequirements).filter(country => 
        country.includes(input)
    );
    
    if (matches.length === 0) {
        results.innerHTML = `
            <div class="country-result">
                <div class="country-name">🌍 ${input.charAt(0).toUpperCase() + input.slice(1)}</div>
                <div class="required-vaccines">
                    <div class="vaccine-requirement recommended">✅ Nenhum certificado especial obrigatório</div>
                    <div class="vaccine-requirement recommended">📊 Consulte sempre o consulado para informações atualizadas</div>
                </div>
            </div>
        `;
        results.classList.add('show');
        return;
    }
    
    let html = '';
    
    matches.forEach(country => {
        const requirements = countryRequirements[country];
        html += `
            <div class="country-result">
                <div class="country-name">🌍 ${country.charAt(0).toUpperCase() + country.slice(1)}</div>
                <div class="required-vaccines">
                    <strong>Certificados Obrigatórios:</strong>
        `;
        
        requirements.forEach(req => {
            const isConditional = req.includes('condicional') || req.includes('se vindo');
            const icon = isConditional ? '📊' : '⚠️';
            const className = isConditional ? 'recommended' : '';
            html += `<div class="vaccine-requirement ${className}">${icon} ${req}</div>`;
        });
        
        html += `
                    <div class="vaccine-requirement" style="background: #fff3cd; border-left-color: #ffc107; margin-top: 0.5rem;">
                        ⚠️ <strong>IMPORTANTE:</strong> Estas informações são baseadas em dados gerais. 
                        <strong>SEMPRE verifique o site oficial do consulado</strong> do país de destino antes de viajar, 
                        pois as exigências podem mudar sem aviso prévio.
                    </div>
                </div>
            </div>
        `;
    });
    
    results.innerHTML = html;
    results.classList.add('show');
}

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});