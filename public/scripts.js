const firebaseConfig = {
    apiKey: "AIzaSyBV4NFnpYxLJZSrfmtmzKEsTvMaCxFVAxI",
    authDomain: "expresspc-45886.firebaseapp.com",
    projectId: "expresspc-45886",
    storageBucket: "expresspc-45886.firebasestorage.app",
    messagingSenderId: "889958295208",
    appId: "1:889958295208:web:4ba8210fc02275177a449d",
    measurementId: "G-N69C5EDCNK"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let computadoresDisponiveis = 300;

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

// navegação e ui
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

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

// login/logout
function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const users = {
        "novoUsuario": { password: "novaSenha", role: "professor" },
        "outroUsuario": { password: "outraSenha", role: "funcionario" }
    };

    if (users[username] && users[username].password === password) {
        if (users[username].role === "professor") {
            window.location.href = "professor.html";
        } else if (users[username].role === "funcionario") {
            window.location.href = "funcionario.html";
        }
    } else {
        alert("Usuário ou senha incorretos!");
        document.getElementById("password").value = "";
        document.getElementById("password").focus();
    }
}

function logout() {
    localStorage.removeItem("userToken"); 
    sessionStorage.clear(); 
    window.location.href = "index.html"; 
}

// botões da parte de recuperação de senha
function mostrarRecuperacao() {
    document.getElementById('form-login').style.display = 'none';
    document.getElementById('form-recuperacao').style.display = 'block';
}

function voltarParaLogin() {
    document.getElementById('form-recuperacao').style.display = 'none';
    document.getElementById('form-login').style.display = 'block';

    setTimeout(() => {
        document.getElementById('form-login').style.display = 'flex';
        document.getElementById('form-login').style.flexDirection = 'column';
        document.getElementById('form-login').style.alignItems = 'center';
    }, 50);
}

// login pela microsoft
function loginMicrosoft() {
    const clientId = "SEU_CLIENT_ID_AQUI";
    const tenantId = "SEU_TENANT_ID_AQUI"; 
    const redirectUri = "http://localhost:5500"; 

    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize
        ?client_id=${clientId}
        &response_type=token
        &redirect_uri=${encodeURIComponent(redirectUri)}
        &scope=openid email profile
        &response_mode=fragment`;

    window.location.href = authUrl;
}


// recuperação de senha funcionando com o email
function enviarEmailRecuperacao(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem-recuperacao');
    
    console.log("Tentando enviar para:", email); // Debug

    if (email && email.includes('@')) {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                console.log("E-mail enviado com sucesso"); // Debug
                mensagem.innerHTML = `✔ E-mail enviado para: <strong>${email}</strong><br>
                                     <small>Verifique sua caixa de entrada e spam</small>`;
                mensagem.style.color = 'green';
                
                // Limpa o formulário
                document.getElementById('email').value = '';
            })
            .catch((error) => {
                console.error("Erro detalhado:", error); // Debug 
                let errorMessage = "Erro ao enviar e-mail. Tente novamente.";
                
                if (error.code === 'auth/user-not-found') {
                    errorMessage = "Este e-mail não está cadastrado.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "Formato de e-mail inválido.";
                }
                
                mensagem.textContent = errorMessage;
                mensagem.style.color = 'red';
            });
    } else {
        mensagem.textContent = 'Por favor, insira um e-mail válido';
        mensagem.style.color = 'red';
    }
    mensagem.style.display = 'block';
}

// quando volta pra página de login o layout da página fica todo fora do lugar
// não entendi o motivo, isso aqui é uma tentativa minha de arrumar
function voltarParaLogin() {
    document.getElementById('form-recuperacao').style.display = 'none';
        setTimeout(() => {
        document.getElementById('form-login').style.display = 'block';
        
        document.getElementById('form-login').style.opacity = '0.99';
        setTimeout(() => {
            document.getElementById('form-login').style.opacity = '1';
        }, 50);
    }, 10);
    
    document.getElementById('mensagem-recuperacao').style.display = 'none';
}


// reserva e gestão de computadores
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


// No seu arquivo principal (ex: app.js)
import { signInWithMicrosoftPopup } from './auth.js';

// Teste rápido (pode colocar no console do navegador também)
async function testeLogin() {
  try {
    const resultado = await signInWithMicrosoftPopup();
    console.log("Funcionou! Usuário:", resultado.user);
    alert("Login feito com: " + resultado.user.email);
  } catch (erro) {
    console.error("Erro:", erro);
    alert("Ocorreu um erro: " + erro.message);
  }
}

// Chame essa função quando quiser testar
testeLogin();



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

// confirmação
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

function confirmarEntrega() {
    const email = "celia123@gmail.com";
    const assunto = "Confirmação de Entrega do Computador";
    const corpo = `Olá Célia Alves,

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

function confirmarDevolucao() {
    const email = "celia123@gmail.com";
    const assunto = "Confirmação de Devolução do Computador";
    const corpo = `Olá Célia Alves,

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

document.getElementById('area').addEventListener('change', atualizarMaterias);
