let computadoresDisponiveis = 300;

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// exibir a data e hora 
function exibirDataHora(acao) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR');
    const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const mensagem = `${acao} realizada em: ${formattedTime} ${formattedDate}`;
    
    const mensagemDiv = document.getElementById('mensagem-acao');
    mensagemDiv.textContent = mensagem;
    mensagemDiv.style.color = 'green';
    mensagemDiv.style.fontWeight = 'bold';
}

// confirmar a entrega
function confirmarEntrega() {
    const email = "celia123@gmail.com";
    const assunto = "Confirmação de Entrega do Computador";
    const corpo = `Olá Celia Alves,

O computador foi entregue com sucesso e marcado como 'ok'.

Obrigado.`;

    if (confirm("Confirmação de entrega será enviada por email. Continuar?")) {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
        alert('Entrega confirmada e e-mail enviado.');
    } else {
        alert('Ação cancelada.');
    }
    exibirDataHora("Entrega");
}

// confirmar a devolução
function confirmarDevolucao() {
    const email = "celia123@gmail.com";
    const assunto = "Confirmação de Devolução do Computador";
    const corpo = `Olá Celia Alves,

O computador foi devolvido com sucesso.

Obrigado.`;

    if (confirm("Confirmação de devolução será enviada por email. Continuar?")) {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
        alert('Devolução confirmada e e-mail enviado.');
    } else {
        alert('Ação cancelada.');
    }
    exibirDataHora("Devolução");
}

// matérias 
const materiasPorArea = {
    "gestao-comercial": ["Administração Financeira", "Gestão de Vendas", "Empreendedorismo"],
    "gestao-recursos-humanos": ["Comportamento Organizacional", "Recrutamento e Seleção", "Legislação Trabalhista"],
    "marketing": ["Pesquisa de Mercado", "Gestão de Marcas", "Marketing Digital"],
    "secretariado": ["Redação Empresarial", "Gestão de Documentos", "Atendimento ao Cliente"],
    "area-tecnologia": ["Introdução à Programação", "Redes de Computadores", "Banco de Dados"],
    "analise-desenvolvimento-sistemas": ["Engenharia de Software", "Estruturas de Dados", "Programação Orientada a Objetos"],
    "banco-dados": ["Modelagem de Dados", "SQL Avançado", "Administração de Banco de Dados"],
    "gestao-tecnologia-informacao": ["Governança de TI", "Segurança da Informação", "Gerenciamento de Projetos"],
    "seguranca-informacao": ["Criptografia", "Pentest e Ethical Hacking", "Normas de Segurança"]
};

function atualizarMaterias() {
    const areaSelecionada = document.getElementById("area").value;
    const materiaSelect = document.getElementById("materia");
    
    materiaSelect.innerHTML = '<option value="">Selecione uma matéria</option>';
    
    if (materiasPorArea[areaSelecionada]) {
        materiasPorArea[areaSelecionada].forEach(materia => {
            let option = document.createElement("option");
            option.value = materia;
            option.textContent = materia;
            materiaSelect.appendChild(option);
        });
    }
}

// reserva do computador
function reservarComputador(event) {
    event.preventDefault();
    const horario = document.getElementById('horario').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    if (!horario || isNaN(quantidade) || quantidade <= 0) {
        alert('Preencha todos os campos corretamente para reservar.');
        return;
    }

    if (quantidade > computadoresDisponiveis) {
        alert('Não há computadores suficientes disponíveis.');
        return;
    }

    computadoresDisponiveis -= quantidade;
    document.getElementById('computadores-disponiveis').textContent = `Computadores disponíveis: ${computadoresDisponiveis}`;
    alert(`Reserva Confirmada!\nHorário: ${horario}\nQuantidade: ${quantidade}`);
}

// função pra conseguir ver a senha digitada
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const icon = document.querySelector('.toggle-password');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        icon.title = "Ocultar senha";
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        icon.title = "Mostrar senha";
    }
}

// parte do login
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const validUsers = {
        'novoUsuario': 'novaSenha',
        'outroUsuario': 'outraSenha'
    };

    if (validUsers[username] && validUsers[username] === password) {
        document.getElementById('login-page').style.display = 'none';
        if (username === 'novoUsuario') {
            document.getElementById('professor-page').style.display = 'block';
            showTab('reserva');
        } else if (username === 'outroUsuario') {
            document.getElementById('funcionario-page').style.display = 'block';
            document.getElementById('recognition').style.display = 'block';
            showTab('student-info');
        }
    } else {
        alert('Usuário ou senha incorretos.');
    }
    
}

// parte do logout
function logout() {
    localStorage.removeItem("userToken"); 
    sessionStorage.clear(); 

    window.location.href = "index.html"; 
}

// parte do "esqueci minha senha" (socorro)
function esqueciSenha() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('recuperar-senha').style.display = 'block';
}

// "enviando" o email de recuperação pro camarada 
function enviarEmailRecuperacao(event) {
    event.preventDefault(); // Previne o envio do formulário

    var email = document.getElementById('email').value;

// mensagem avisando que o email foi enviado 
    alert(`Um link de recuperação foi enviado para ${email}. Por favor, verifique sua caixa de entrada.`);
    setTimeout(function() {
        document.getElementById('recuperar-senha').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    }, 3000); 
}

function voltarLogin() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('recuperar-senha').style.display = 'none';
}

document.getElementById('area').addEventListener('change', atualizarMaterias);
