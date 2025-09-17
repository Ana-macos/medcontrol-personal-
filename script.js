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
let humor = JSON.parse(localStorage.getItem('medcontrol_humor')) || [];
let terapia = JSON.parse(localStorage.getItem('medcontrol_terapia')) || [];
let refeicoes = JSON.parse(localStorage.getItem('medcontrol_refeicoes')) || [];
let aguaConsumida = parseInt(localStorage.getItem('medcontrol_agua')) || 0;
let membrosFamilia = JSON.parse(localStorage.getItem('medcontrol_familia')) || [];
let marcosDesenvolvimento = JSON.parse(localStorage.getItem('medcontrol_marcos')) || [];
let contatosEmergencia = JSON.parse(localStorage.getItem('medcontrol_contatos')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    

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
    else if (tabName === 'saude-mental') renderHumor();
    else if (tabName === 'nutricao') renderRefeicoes();
    else if (tabName === 'familia') renderMembrosFamilia();
    
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
    document.getElementById('total-humor').textContent = humor.length;
    document.getElementById('total-refeicoes').textContent = refeicoes.length;
    
    // Atualizar atividades recentes
    updateRecentActivities();
}

function updateRecentActivities() {
    const recentList = document.getElementById('recent-list');
    const allActivities = [];
    
    // Adicionar exames recentes
    exames.slice(-3).forEach(exame => {
        allActivities.push({
            type: 'exame',
            icon: 'fas fa-file-medical-alt',
            title: exame.nome,
            subtitle: `Médico: ${exame.medico || 'Não informado'}`,
            date: exame.data
        });
    });
    
    // Adicionar medicamentos recentes
    medicamentos.slice(-2).forEach(med => {
        allActivities.push({
            type: 'medicamento',
            icon: 'fas fa-pills',
            title: med.nome,
            subtitle: `Dosagem: ${med.dosagem}`,
            date: new Date().toISOString().split('T')[0]
        });
    });
    
    // Adicionar vacinas recentes
    vacinas.slice(-2).forEach(vacina => {
        allActivities.push({
            type: 'vacina',
            icon: 'fas fa-syringe',
            title: vacina.nome,
            subtitle: `Local: ${vacina.local}`,
            date: vacina.data
        });
    });
    
    // Ordenar por data (mais recentes primeiro)
    allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allActivities.length === 0) {
        recentList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 2rem;">Nenhuma atividade recente</p>';
        return;
    }
    
    recentList.innerHTML = allActivities.slice(0, 5).map(activity => `
        <div class="recent-item">
            <div class="recent-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="recent-info">
                <h4>${activity.title}</h4>
                <p>${activity.subtitle}</p>
            </div>
            <div class="recent-date">
                ${new Date(activity.date).toLocaleDateString('pt-BR')}
            </div>
        </div>
    `).join('');
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

// Saúde Mental
function renderHumor() {
    const container = document.getElementById('humor-list');
    
    if (humor.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>🧠 Nenhum registro de humor</h3>
                <p>Comece a acompanhar seu bem-estar emocional registrando como você se sente.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = humor.map((registro, index) => `
        <div class="mood-card mood-${registro.nivel}">
            <div class="mood-header">
                <div class="mood-level">${getMoodEmoji(registro.nivel)} ${getMoodLabel(registro.nivel)}</div>
                <div class="mood-date">${new Date(registro.data).toLocaleDateString('pt-BR')}</div>
                <button class="btn-delete" onclick="deleteHumor(${index})">Excluir</button>
            </div>
            ${registro.observacoes ? `<p>${registro.observacoes}</p>` : ''}
        </div>
    `).join('');
}

function renderTerapia() {
    const container = document.getElementById('terapia-list');
    
    if (terapia.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>💬 Nenhuma sessão registrada</h3>
                <p>Registre suas sessões de terapia para acompanhar seu progresso.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = terapia.map((sessao, index) => `
        <div class="exam-card">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${sessao.tipo.charAt(0).toUpperCase() + sessao.tipo.slice(1)}</div>
                </div>
                <button class="btn-delete" onclick="deleteTerapia(${index})">Excluir</button>
            </div>
            <div class="exam-info">
                <div><span>Data:</span> <strong>${new Date(sessao.data).toLocaleDateString('pt-BR')}</strong></div>
                <div><span>Terapeuta:</span> <strong>${sessao.profissional}</strong></div>
                ${sessao.observacoes ? `<div><span>Observações:</span> <strong>${sessao.observacoes}</strong></div>` : ''}
            </div>
        </div>
    `).join('');
}

function getMoodEmoji(nivel) {
    const emojis = {
        'muito-bem': '😄',
        'bem': '😊',
        'neutro': '😐',
        'mal': '🙁',
        'muito-mal': '😢'
    };
    return emojis[nivel] || '😐';
}

function getMoodLabel(nivel) {
    const labels = {
        'muito-bem': 'Muito Bem',
        'bem': 'Bem',
        'neutro': 'Neutro',
        'mal': 'Mal',
        'muito-mal': 'Muito Mal'
    };
    return labels[nivel] || 'Neutro';
}

function deleteHumor(index) {
    humor.splice(index, 1);
    localStorage.setItem('medcontrol_humor', JSON.stringify(humor));
    renderHumor();
}

function deleteTerapia(index) {
    terapia.splice(index, 1);
    localStorage.setItem('medcontrol_terapia', JSON.stringify(terapia));
    renderTerapia();
}

function showMentalTab(tabName) {
    document.querySelectorAll('.mental-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.mental-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (tabName === 'humor') {
        document.getElementById('humor-diario').classList.add('active');
        renderHumor();
    } else if (tabName === 'terapia') {
        document.getElementById('terapia-sessoes').classList.add('active');
        renderTerapia();
    } else {
        document.getElementById('dicas-bem-estar').classList.add('active');
    }
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Consultas
function renderConsultasMedicas() {
    const container = document.getElementById('medicas-list');
    
    if (consultasMedicas.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>👩‍⚕️ Nenhuma consulta médica agendada</h3>
                <p>Agende suas consultas médicas para manter sua saúde em dia.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = consultasMedicas.map((consulta, index) => `
        <div class="consultation-card medica">
            <div class="consult-header">
                <div class="consult-title">${consulta.profissional}</div>
                <div class="consult-type">${consulta.especialidade}</div>
                <button class="btn-delete" onclick="deleteConsultaMedica(${index})">Excluir</button>
            </div>
            <div class="consult-info">
                <div><i class="fas fa-calendar"></i> ${new Date(consulta.data).toLocaleDateString('pt-BR')}</div>
                <div><i class="fas fa-clock"></i> ${consulta.horario}</div>
                ${consulta.local ? `<div><i class="fas fa-map-marker-alt"></i> ${consulta.local}</div>` : ''}
                ${consulta.observacoes ? `<div><i class="fas fa-notes-medical"></i> ${consulta.observacoes}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderConsultasDentista() {
    const container = document.getElementById('dentista-consultas-list');
    
    if (consultasDentista.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>🦷 Nenhuma consulta odontológica agendada</h3>
                <p>Agende suas consultas com o dentista para manter sua saúde bucal.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = consultasDentista.map((consulta, index) => `
        <div class="consultation-card dentista">
            <div class="consult-header">
                <div class="consult-title">${consulta.profissional}</div>
                <div class="consult-type">Dentista</div>
                <button class="btn-delete" onclick="deleteConsultaDentista(${index})">Excluir</button>
            </div>
            <div class="consult-info">
                <div><i class="fas fa-calendar"></i> ${new Date(consulta.data).toLocaleDateString('pt-BR')}</div>
                <div><i class="fas fa-clock"></i> ${consulta.horario}</div>
                ${consulta.local ? `<div><i class="fas fa-map-marker-alt"></i> ${consulta.local}</div>` : ''}
                ${consulta.observacoes ? `<div><i class="fas fa-tooth"></i> ${consulta.observacoes}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderConsultasTerapia() {
    const container = document.getElementById('terapia-consultas-list');
    
    if (consultasTerapia.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>🧠 Nenhuma sessão de terapia agendada</h3>
                <p>Agende suas sessões de terapia para cuidar da sua saúde mental.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = consultasTerapia.map((consulta, index) => `
        <div class="consultation-card terapia">
            <div class="consult-header">
                <div class="consult-title">${consulta.profissional}</div>
                <div class="consult-type">Terapia</div>
                <button class="btn-delete" onclick="deleteConsultaTerapia(${index})">Excluir</button>
            </div>
            <div class="consult-info">
                <div><i class="fas fa-calendar"></i> ${new Date(consulta.data).toLocaleDateString('pt-BR')}</div>
                <div><i class="fas fa-clock"></i> ${consulta.horario}</div>
                ${consulta.local ? `<div><i class="fas fa-map-marker-alt"></i> ${consulta.local}</div>` : ''}
                ${consulta.observacoes ? `<div><i class="fas fa-brain"></i> ${consulta.observacoes}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function deleteConsultaMedica(index) {
    consultasMedicas.splice(index, 1);
    localStorage.setItem('medcontrol_consultas_medicas', JSON.stringify(consultasMedicas));
    renderConsultasMedicas();
}

function deleteConsultaDentista(index) {
    consultasDentista.splice(index, 1);
    localStorage.setItem('medcontrol_consultas_dentista', JSON.stringify(consultasDentista));
    renderConsultasDentista();
}

function deleteConsultaTerapia(index) {
    consultasTerapia.splice(index, 1);
    localStorage.setItem('medcontrol_consultas_terapia', JSON.stringify(consultasTerapia));
    renderConsultasTerapia();
}

function showConsultTab(tabName) {
    document.querySelectorAll('.consult-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.consult-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (tabName === 'medicas') {
        document.getElementById('consultas-medicas').classList.add('active');
        renderConsultasMedicas();
    } else if (tabName === 'dentista') {
        document.getElementById('consultas-dentista').classList.add('active');
        renderConsultasDentista();
    } else {
        document.getElementById('consultas-terapia').classList.add('active');
        renderConsultasTerapia();
    }
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function updateConsultaFields() {
    const tipo = document.getElementById('consulta-tipo').value;
    const profissionalLabel = document.getElementById('profissional-label');
    const especialidadeGroup = document.getElementById('especialidade-group');
    
    if (tipo === 'medica') {
        profissionalLabel.textContent = 'Médico';
        especialidadeGroup.style.display = 'block';
    } else if (tipo === 'dentista') {
        profissionalLabel.textContent = 'Dentista';
        especialidadeGroup.style.display = 'none';
    } else if (tipo === 'terapia') {
        profissionalLabel.textContent = 'Terapeuta';
        especialidadeGroup.style.display = 'none';
    }
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

// Forms - Aguardar DOM carregar
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
    localStorage.setItem('medcontrol_exames', JSON.stringify(exames));
    
    closeModal('exame-modal');
    e.target.reset();
    renderExames();
    updateDashboard();
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
    localStorage.setItem('medcontrol_medicamentos', JSON.stringify(medicamentos));
    
    closeModal('medicamento-modal');
    e.target.reset();
    renderMedicamentos();
    updateDashboard();
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
    localStorage.setItem('medcontrol_vacinas', JSON.stringify(vacinas));
    
    closeModal('vacina-modal');
    e.target.reset();
    renderVacinas();
    updateDashboard();
    showAlert('Vacina adicionada com sucesso!', 'success');
        });
    }
    
    // Dentista form
    const dentistaForm = document.getElementById('dentista-form');
    if (dentistaForm) {
        dentistaForm.addEventListener('submit', (e) => {
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
    }
    
    // Agendamento form
    const agendamentoForm = document.getElementById('agendamento-form');
    if (agendamentoForm) {
        agendamentoForm.addEventListener('submit', (e) => {
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
            localStorage.setItem('medcontrol_humor', JSON.stringify(humor));
            
            closeModal('humor-modal');
            e.target.reset();
            renderHumor();
            showAlert('Humor registrado com sucesso!', 'success');
        });
    }
    
    // Terapia form
    const terapiaForm = document.getElementById('terapia-form');
    if (terapiaForm) {
        terapiaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const sessao = {
                data: document.getElementById('terapia-data').value,
                profissional: document.getElementById('terapia-profissional').value,
                tipo: document.getElementById('terapia-tipo').value,
                observacoes: document.getElementById('terapia-observacoes').value
            };
            
            terapia.push(sessao);
            localStorage.setItem('medcontrol_terapia', JSON.stringify(terapia));
            
            closeModal('terapia-modal');
            e.target.reset();
            renderTerapia();
            showAlert('Sessão registrada com sucesso!', 'success');
        });
    }
    
    // Consulta form
    const consultaForm = document.getElementById('consulta-form');
    if (consultaForm) {
        consultaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const consulta = {
                tipo: document.getElementById('consulta-tipo').value,
                data: document.getElementById('consulta-data').value,
                horario: document.getElementById('consulta-horario').value,
                profissional: document.getElementById('consulta-profissional').value,
                especialidade: document.getElementById('consulta-especialidade').value,
                local: document.getElementById('consulta-local').value,
                observacoes: document.getElementById('consulta-observacoes').value
            };
            
            if (consulta.tipo === 'medica') {
                consultasMedicas.push(consulta);
                localStorage.setItem('medcontrol_consultas_medicas', JSON.stringify(consultasMedicas));
            } else if (consulta.tipo === 'dentista') {
                consultasDentista.push(consulta);
                localStorage.setItem('medcontrol_consultas_dentista', JSON.stringify(consultasDentista));
            } else if (consulta.tipo === 'terapia') {
                consultasTerapia.push(consulta);
                localStorage.setItem('medcontrol_consultas_terapia', JSON.stringify(consultasTerapia));
            }
            
            closeModal('consulta-modal');
            e.target.reset();
            
            // Renderizar a aba correta
            if (consulta.tipo === 'medica') renderConsultasMedicas();
            else if (consulta.tipo === 'dentista') renderConsultasDentista();
            else renderConsultasTerapia();
            
            showAlert('Consulta agendada com sucesso!', 'success');
        });
    }
    
    // Membro da família form
    const membroForm = document.getElementById('membro-form');
    if (membroForm) {
        membroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const membro = {
                nome: document.getElementById('membro-nome').value,
                parentesco: document.getElementById('membro-parentesco').value,
                nascimento: document.getElementById('membro-nascimento').value,
                sangue: document.getElementById('membro-sangue').value,
                condicoes: document.getElementById('membro-condicoes').value
            };
            
            membrosFamilia.push(membro);
            localStorage.setItem('medcontrol_familia', JSON.stringify(membrosFamilia));
            
            closeModal('membro-modal');
            e.target.reset();
            renderMembrosFamilia();
            showAlert('Membro adicionado com sucesso!', 'success');
        });
    }
    
    // Marco de desenvolvimento form
    const marcoForm = document.getElementById('marco-form');
    if (marcoForm) {
        marcoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const marco = {
                crianca: document.getElementById('marco-crianca').value,
                idade: document.getElementById('marco-idade').value,
                data: document.getElementById('marco-data').value,
                tipo: document.getElementById('marco-tipo').value,
                descricao: document.getElementById('marco-descricao').value
            };
            
            marcosDesenvolvimento.push(marco);
            localStorage.setItem('medcontrol_marcos', JSON.stringify(marcosDesenvolvimento));
            
            closeModal('marco-modal');
            e.target.reset();
            renderMarcosDesenvolvimento();
            showAlert('Marco registrado com sucesso!', 'success');
        });
    }
    
    // Contato de emergência form
    const contatoForm = document.getElementById('contato-form');
    if (contatoForm) {
        contatoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const contato = {
                nome: document.getElementById('contato-nome').value,
                tipo: document.getElementById('contato-tipo').value,
                telefone: document.getElementById('contato-telefone').value,
                endereco: document.getElementById('contato-endereco').value
            };
            
            contatosEmergencia.push(contato);
            localStorage.setItem('medcontrol_contatos', JSON.stringify(contatosEmergencia));
            
            closeModal('contato-modal');
            e.target.reset();
            renderContatosEmergencia();
            showAlert('Contato adicionado com sucesso!', 'success');
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
                alimentos: document.getElementById('refeicao-alimentos').value,
                calorias: document.getElementById('refeicao-calorias').value,
                sensacao: document.getElementById('refeicao-sensacao').value,
                observacoes: document.getElementById('refeicao-observacoes').value
            };
            
            refeicoes.push(refeicao);
            localStorage.setItem('medcontrol_refeicoes', JSON.stringify(refeicoes));
            
            closeModal('refeicao-modal');
            e.target.reset();
            renderRefeicoes();
            updateDashboard();
            showAlert('Refeição registrada com sucesso!', 'success');
        });
    }
});

// Saúde da Família
function renderMembrosFamilia() {
    const container = document.getElementById('membros-list');
    
    if (membrosFamilia.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>👨‍👩‍👧‍👦 Nenhum membro cadastrado</h3>
                <p>Adicione os membros da sua família para acompanhar a saúde de todos.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = membrosFamilia.map((membro, index) => `
        <div class="member-card">
            <div class="member-header">
                <div class="member-name">${membro.nome}</div>
                <div class="member-relation">${membro.parentesco}</div>
                <button class="btn-delete" onclick="deleteMembro(${index})">Excluir</button>
            </div>
            <div class="member-info">
                <div><strong>Idade:</strong> ${calcularIdade(membro.nascimento)} anos</div>
                ${membro.sangue ? `<div><strong>Tipo Sanguíneo:</strong> ${membro.sangue}</div>` : ''}
                ${membro.condicoes ? `<div><strong>Condições:</strong> ${membro.condicoes}</div>` : ''}
            </div>
        </div>
    `).join('');
    
    // Atualizar select de crianças para marcos
    updateCriancasSelect();
}

function renderMarcosDesenvolvimento() {
    const container = document.getElementById('marcos-list');
    
    if (marcosDesenvolvimento.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>👶 Nenhum marco registrado</h3>
                <p>Registre os marcos de desenvolvimento das crianças da família.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = marcosDesenvolvimento.map((marco, index) => `
        <div class="milestone-card">
            <div class="milestone-header">
                <div>
                    <h4>${marco.crianca} - ${marco.idade}</h4>
                    <div class="milestone-type">${marco.tipo}</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--text-light); font-size: 0.9rem;">${new Date(marco.data).toLocaleDateString('pt-BR')}</div>
                    <button class="btn-delete" onclick="deleteMarco(${index})">Excluir</button>
                </div>
            </div>
            <p>${marco.descricao}</p>
        </div>
    `).join('');
}

function renderContatosEmergencia() {
    const container = document.getElementById('contatos-list');
    
    if (contatosEmergencia.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>🆘 Nenhum contato de emergência</h3>
                <p>Adicione contatos importantes para situações de emergência.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = contatosEmergencia.map((contato, index) => `
        <div class="contact-card">
            <div class="contact-info">
                <h4>${contato.nome}</h4>
                <div class="contact-phone">${contato.telefone}</div>
                <div style="color: var(--text-light); font-size: 0.9rem;">${contato.tipo} ${contato.endereco ? '- ' + contato.endereco : ''}</div>
            </div>
            <button class="btn-delete" onclick="deleteContato(${index})">Excluir</button>
        </div>
    `).join('');
}

function calcularIdade(nascimento) {
    const hoje = new Date();
    const nasc = new Date(nascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }
    return idade;
}

function updateCriancasSelect() {
    const select = document.getElementById('marco-crianca');
    const criancas = membrosFamilia.filter(m => calcularIdade(m.nascimento) < 18);
    
    select.innerHTML = '<option value="">Selecione a criança...</option>' + 
        criancas.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('');
}

function deleteMembro(index) {
    membrosFamilia.splice(index, 1);
    localStorage.setItem('medcontrol_familia', JSON.stringify(membrosFamilia));
    renderMembrosFamilia();
}

function deleteMarco(index) {
    marcosDesenvolvimento.splice(index, 1);
    localStorage.setItem('medcontrol_marcos', JSON.stringify(marcosDesenvolvimento));
    renderMarcosDesenvolvimento();
}

function deleteContato(index) {
    contatosEmergencia.splice(index, 1);
    localStorage.setItem('medcontrol_contatos', JSON.stringify(contatosEmergencia));
    renderContatosEmergencia();
}

function showFamilyTab(tabName) {
    document.querySelectorAll('.family-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.family-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (tabName === 'membros') {
        document.getElementById('membros-familia').classList.add('active');
        renderMembrosFamilia();
    } else if (tabName === 'desenvolvimento') {
        document.getElementById('desenvolvimento-infantil').classList.add('active');
        renderMarcosDesenvolvimento();
    } else {
        document.getElementById('contatos-emergencia').classList.add('active');
        renderContatosEmergencia();
    }
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Nutrição
function renderRefeicoes() {
    const container = document.getElementById('refeicoes-list');
    
    if (refeicoes.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h3>🍽️ Nenhuma refeição registrada</h3>
                <p>Comece a acompanhar sua alimentação registrando suas refeições.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = refeicoes.map((refeicao, index) => `
        <div class="meal-card">
            <div class="meal-header">
                <div>
                    <h4>${refeicao.tipo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                    <div class="meal-time">${refeicao.horario}</div>
                </div>
                <div class="meal-type">${refeicao.calorias ? refeicao.calorias + ' cal' : ''}</div>
                <button class="btn-delete" onclick="deleteRefeicao(${index})">Excluir</button>
            </div>
            <p><strong>Alimentos:</strong> ${refeicao.alimentos}</p>
            ${refeicao.sensacao ? `<p><strong>Sensação:</strong> ${refeicao.sensacao}</p>` : ''}
            ${refeicao.observacoes ? `<p><strong>Observações:</strong> ${refeicao.observacoes}</p>` : ''}
        </div>
    `).join('');
}

function deleteRefeicao(index) {
    refeicoes.splice(index, 1);
    localStorage.setItem('medcontrol_refeicoes', JSON.stringify(refeicoes));
    renderRefeicoes();
    updateDashboard();
}

function showNutritionTab(tabName) {
    document.querySelectorAll('.nutrition-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.nutrition-tab-btn').forEach(btn => {
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
        event.target.classList.add('active');
    }
}

function addWater(amount) {
    aguaConsumida += amount;
    localStorage.setItem('medcontrol_agua', aguaConsumida);
    updateWaterDisplay();
    showAlert(`+${amount}ml de água adicionado!`, 'success');
}

function resetWater() {
    aguaConsumida = 0;
    localStorage.setItem('medcontrol_agua', aguaConsumida);
    updateWaterDisplay();
    showAlert('Água resetada para o dia!', 'info');
}

function updateWaterDisplay() {
    const percentage = Math.min((aguaConsumida / 2000) * 100, 100);
    document.getElementById('water-fill').style.width = percentage + '%';
    document.getElementById('water-amount').textContent = `${aguaConsumida}ml / 2000ml`;
}



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