let computadoresDisponiveis = 300;

// Função para mostrar a aba selecionada
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Função para exibir a data e hora da ação
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

// Função para confirmar a entrega
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

    // Exibir a data e hora da entrega
    exibirDataHora("Entrega");
}

// Função para confirmar a devolução
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

    // Exibir a data e hora da devolução
    exibirDataHora("Devolução");
}

// Matérias por área
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

// Função para atualizar as matérias com base na área selecionada
function atualizarMaterias() {
    const areaSelecionada = document.getElementById("area").value;
    const materiaSelect = document.getElementById("materia");
    
    // Limpa as opções atuais
    materiaSelect.innerHTML = '<option value="">Selecione uma matéria</option>';
    
    // Adiciona novas opções
    if (materiasPorArea[areaSelecionada]) {
        materiasPorArea[areaSelecionada].forEach(materia => {
            let option = document.createElement("option");
            option.value = materia;
            option.textContent = materia;
            materiaSelect.appendChild(option);
        });
    }
}

// Função para reservar um computador
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
    // Adicione aqui o código para salvar as informações da reserva no backend, se necessário.
}

// Função de login
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


document.getElementById('area').addEventListener('change', atualizarMaterias);
