// Dados de usuários (simulando um banco de dados)
let users = JSON.parse(localStorage.getItem('healthSystemUsers')) || [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        fullName: 'Administrador',
        email: 'admin@saude.com',
        birthdate: '1990-01-01',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        username: 'demo',
        password: 'demo123',
        fullName: 'Usuário Demonstração',
        email: 'demo@saude.com',
        birthdate: '1985-05-15',
        createdAt: new Date().toISOString()
    }
];

// Usuário atual logado
let currentUser = null;

// Função para carregar dados salvos de login
function loadSavedLoginData() {
    const savedData = localStorage.getItem('savedLoginData');
    if (savedData) {
        try {
            const loginData = JSON.parse(savedData);
            document.getElementById('username').value = loginData.username || '';
            document.getElementById('remember-me').checked = loginData.rememberMe || false;
            
            // Focar no campo de senha se username estiver preenchido
            if (loginData.username) {
                document.getElementById('password').focus();
            }
        } catch (error) {
            console.log('Erro ao carregar dados salvos:', error);
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já está logado de forma mais rápida
    const savedUser = localStorage.getItem('currentHealthUser') || sessionStorage.getItem('currentHealthUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            // Redirecionar imediatamente sem loading
            redirectToSystem();
            return;
        } catch (error) {
            // Se houver erro, limpar dados corrompidos
            localStorage.removeItem('currentHealthUser');
            sessionStorage.removeItem('currentHealthUser');
        }
    }
    
    // Carregar dados salvos de login
    loadSavedLoginData();
    
    // Event listeners
    setupEventListeners();
    
    // Verificar se há parâmetros de URL para logout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'true') {
        logout();
        showNotification('Logout realizado com sucesso!', 'success');
        
        // Limpar parâmetro da URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

function setupEventListeners() {
    // Formulário de login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Formulário de registro
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Formulário de esqueci a senha
    document.getElementById('forgot-password-form').addEventListener('submit', handleForgotPassword);
    
    // Enter key nos inputs
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });
    
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(event) {
        const registerModal = document.getElementById('register-modal');
        const forgotModal = document.getElementById('forgot-password-modal');
        
        if (event.target === registerModal) {
            closeRegisterModal();
        }
        if (event.target === forgotModal) {
            closeForgotPasswordModal();
        }
    });
}

// Manipular login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validação básica
    if (!username || !password) {
        showNotification('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    // Verificar credenciais
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Login bem-sucedido
        currentUser = user;
        
        // Salvar dados de login para preenchimento automático
        localStorage.setItem('savedLoginData', JSON.stringify({
            username: username,
            rememberMe: rememberMe
        }));
        
        // Salvar sessão do usuário
        if (rememberMe) {
            localStorage.setItem('currentHealthUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('currentHealthUser', JSON.stringify(user));
        }
        
        // Mostrar loading e redirecionar mais rápido
        showLoading();
        
        setTimeout(() => {
            redirectToSystem();
        }, 800); // Reduzido de 2000ms para 800ms
        
    } else {
        // Login falhou
        showNotification('Usuário ou senha incorretos!', 'error');
        
        // Adicionar classe de erro aos inputs
        document.getElementById('username').classList.add('input-error');
        document.getElementById('password').classList.add('input-error');
        
        // Remover classe de erro após 3 segundos
        setTimeout(() => {
            document.getElementById('username').classList.remove('input-error');
            document.getElementById('password').classList.remove('input-error');
        }, 3000);
    }
}

// Login como demonstração otimizado
function loginAsDemo() {
    const demoUser = users.find(u => u.username === 'demo');
    
    if (demoUser) {
        currentUser = demoUser;
        
        // Salvar dados de login para preenchimento automático
        localStorage.setItem('savedLoginData', JSON.stringify({
            username: 'demo',
            rememberMe: false
        }));
        
        sessionStorage.setItem('currentHealthUser', JSON.stringify(demoUser));
        
        showLoading();
        setTimeout(() => {
            redirectToSystem();
        }, 500); // Reduzido de 1500ms para 500ms
    }
}

// Manipular registro
function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('reg-fullname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const birthdate = document.getElementById('reg-birthdate').value;
    
    // Validações
    if (!fullName || !email || !username || !password || !confirmPassword || !birthdate) {
        showNotification('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
        return;
    }
    
    // Verificar se usuário já existe
    if (users.find(u => u.username === username)) {
        showNotification('Nome de usuário já existe!', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showNotification('Email já cadastrado!', 'error');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: users.length + 1,
        username: username,
        password: password,
        fullName: fullName,
        email: email,
        birthdate: birthdate,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('healthSystemUsers', JSON.stringify(users));
    
    closeRegisterModal();
    showNotification('Conta criada com sucesso! Faça login para continuar.', 'success');
    
    // Preencher campos de login
    document.getElementById('username').value = username;
    document.getElementById('password').value = '';
}

// Manipular esqueci a senha
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgot-email').value.trim();
    
    if (!email) {
        showNotification('Por favor, digite seu email!', 'error');
        return;
    }
    
    const user = users.find(u => u.email === email);
    
    if (user) {
        // Simular envio de email
        closeForgotPasswordModal();
        showNotification('Link de recuperação enviado para seu email!', 'success');
        
        // Em um sistema real, aqui seria enviado um email
        console.log(`Link de recuperação seria enviado para: ${email}`);
        console.log(`Usuário encontrado: ${user.username}`);
    } else {
        showNotification('Email não encontrado!', 'error');
    }
}

// Mostrar/esconder senha
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('password-toggle-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Modais
function showRegister() {
    document.getElementById('register-modal').style.display = 'block';
    document.getElementById('reg-fullname').focus();
}

function closeRegisterModal() {
    document.getElementById('register-modal').style.display = 'none';
    document.getElementById('register-form').reset();
}

function showForgotPassword() {
    document.getElementById('forgot-password-modal').style.display = 'block';
    document.getElementById('forgot-email').focus();
}

function closeForgotPasswordModal() {
    document.getElementById('forgot-password-modal').style.display = 'none';
    document.getElementById('forgot-password-form').reset();
}

// Loading
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Redirecionar para o sistema otimizado
function redirectToSystem() {
    // Usar replace para evitar histórico e ser mais rápido
    window.location.replace('dashboard.html');
}

// Logout otimizado
function logout() {
    currentUser = null;
    localStorage.removeItem('currentHealthUser');
    sessionStorage.removeItem('currentHealthUser');
    
    // Limpar formulário
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.reset();
    }
    
    hideLoading();
}

// Notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Adicionar animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para gerar senha aleatória (para recuperação)
function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Função para verificar força da senha
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

// Salvar usuários no localStorage quando a página for fechada
window.addEventListener('beforeunload', function() {
    localStorage.setItem('healthSystemUsers', JSON.stringify(users));
});

// Debug: Mostrar usuários disponíveis no console
console.log('Usuários disponíveis para login:');
console.log('Username: admin | Password: admin123');
console.log('Username: demo | Password: demo123');
console.log('Ou clique em "Acessar Demonstração" para login automático');
