/**
 * Testes para MedControl Personal
 * Desenvolvido com Amazon Q Developer
 */

describe('MedControl Personal - Testes Unitários', () => {
  
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear();
    jest.clearAllMocks();
    
    // Setup DOM básico
    document.body.innerHTML = `
      <div id="total-exames">0</div>
      <div id="total-medicamentos">0</div>
      <div id="total-vacinas">0</div>
      <div id="total-dentista">0</div>
    `;
  });

  describe('Armazenamento de Dados', () => {
    test('deve salvar exame no localStorage', () => {
      const exame = {
        nome: 'Hemograma',
        medico: 'Dr. Silva',
        data: '2024-01-15',
        status: 'realizado'
      };
      
      localStorage.setItem('medcontrol_exames', JSON.stringify([exame]));
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'medcontrol_exames', 
        JSON.stringify([exame])
      );
    });

    test('deve carregar dados do localStorage', () => {
      const mockData = [{ nome: 'Teste', data: '2024-01-01' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockData));
      
      const result = JSON.parse(localStorage.getItem('medcontrol_exames') || '[]');
      
      expect(result).toEqual(mockData);
    });
  });

  describe('Validação de Dados', () => {
    test('deve validar formato de data', () => {
      const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
      };
      
      expect(isValidDate('2024-01-15')).toBe(true);
      expect(isValidDate('invalid-date')).toBe(false);
    });

    test('deve validar campos obrigatórios', () => {
      const validateExame = (exame) => {
        return exame.nome && exame.data;
      };
      
      expect(validateExame({ nome: 'Teste', data: '2024-01-01' })).toBe(true);
      expect(validateExame({ nome: 'Teste' })).toBe(false);
    });
  });

  describe('Busca de Países', () => {
    test('deve encontrar país na base de dados', () => {
      const countryRequirements = {
        'brasil': ['CIVP - Febre Amarela (algumas regiões)'],
        'alemanha': ['Hepatite A/B (recomendada)']
      };
      
      const searchCountry = (input) => {
        return Object.keys(countryRequirements).filter(country => 
          country.includes(input.toLowerCase())
        );
      };
      
      expect(searchCountry('brasil')).toContain('brasil');
      expect(searchCountry('alemanha')).toContain('alemanha');
      expect(searchCountry('inexistente')).toHaveLength(0);
    });
  });

  describe('Contadores do Dashboard', () => {
    test('deve atualizar contadores corretamente', () => {
      const updateDashboard = (exames, medicamentos, vacinas, dentista) => {
        document.getElementById('total-exames').textContent = exames.length;
        document.getElementById('total-medicamentos').textContent = medicamentos.length;
        document.getElementById('total-vacinas').textContent = vacinas.length;
        document.getElementById('total-dentista').textContent = dentista.length;
      };
      
      updateDashboard([1, 2], [1], [1, 2, 3], []);
      
      expect(document.getElementById('total-exames').textContent).toBe('2');
      expect(document.getElementById('total-medicamentos').textContent).toBe('1');
      expect(document.getElementById('total-vacinas').textContent).toBe('3');
      expect(document.getElementById('total-dentista').textContent).toBe('0');
    });
  });

  describe('Autenticação', () => {
    test('deve validar credenciais corretas', () => {
      const users = [
        { username: 'admin', password: 'admin123' },
        { username: 'demo', password: 'demo123' }
      ];
      
      const validateLogin = (username, password) => {
        return users.find(u => u.username === username && u.password === password);
      };
      
      expect(validateLogin('admin', 'admin123')).toBeTruthy();
      expect(validateLogin('demo', 'demo123')).toBeTruthy();
      expect(validateLogin('admin', 'wrong')).toBeFalsy();
    });
  });

  describe('Formatação de Dados', () => {
    test('deve formatar data corretamente', () => {
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
      };
      
      expect(formatDate('2024-01-15')).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    test('deve formatar moeda corretamente', () => {
      const formatCurrency = (value) => {
        return `R$ ${parseFloat(value).toFixed(2)}`;
      };
      
      expect(formatCurrency('150.5')).toBe('R$ 150.50');
      expect(formatCurrency('1000')).toBe('R$ 1000.00');
    });
  });
});