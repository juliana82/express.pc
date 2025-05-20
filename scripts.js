// Configurações e inicialização do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Dados globais
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

// Funções de UI/UX
function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const icon = document.querySelector('.toggle-password');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
        icon.title = "Ocultar senha";
    } else {
        passwordField.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
        icon.title = "Mostrar senha";
    }
}

// Sistema de Login com Firebase
async function login(event) {
    event.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage('Preencha todos os campos.', 'error');
        return;
    }

    try {
        showLoader(true);
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        const userDoc = await db.collection("users").doc(user.uid).get();
        
        if (userDoc.exists) {
            const role = userDoc.data().role;
            
            if (role === "professor") {
                window.location.href = "professor.html";
            } else if (role === "funcionario") {
                window.location.href = "funcionario.html";
            } else {
                showMessage('Tipo de usuário não reconhecido.', 'error');
                await auth.signOut();
            }
        } else {
            showMessage('Usuário não encontrado no banco de dados.', 'error');
            await auth.signOut();
        }
    } catch (error) {
        console.error("Erro no login:", error);
        showMessage('E-mail ou senha incorretos.', 'error');
    } finally {
        showLoader(false);
    }
}

function logout() {
    auth.signOut()
        .then(() => {
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error("Erro ao fazer logout:", error);
        });
}

// Recuperação de Senha
function mostrarRecuperacao() {
    document.getElementById('form-login').style.display = 'none';
    document.getElementById('form-recuperacao').style.display = 'block';
}

function voltarParaLogin() {
    document.getElementById('form-recuperacao').style.display = 'none';
    document.getElementById('form-login').style.display = 'flex';
    document.getElementById('mensagem-recuperacao').style.display = 'none';
}

async function enviarEmailRecuperacao(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem-recuperacao');
    
    if (!email || !email.includes('@')) {
        showMessage('Por favor, insira um e-mail válido', 'error', mensagem);
        return;
    }

    try {
        showLoader(true);
        await auth.sendPasswordResetEmail(email);
        showMessage(`E-mail de recuperação enviado para: ${email}`, 'success', mensagem);
        document.getElementById('email').value = '';
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        showMessage('Erro ao enviar e-mail. Tente novamente.', 'error', mensagem);
    } finally {
        showLoader(false);
    }
}

// Gestão de Computadores
function reservarComputador(event) {
    event.preventDefault();
    const horario = document.getElementById('horario').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const area = document.getElementById('area').value;
    const materia = document.getElementById('materia').value;

    if (!horario || isNaN(quantidade) || quantidade <= 0 || !area || !materia) {
        showMessage('Preencha todos os campos corretamente para reservar.', 'error');
        return;
    }

    if (quantidade > computadoresDisponiveis) {
        showMessage(`Não há computadores suficientes. Disponível: ${computadoresDisponiveis}`, 'error');
        return;
    }

    computadoresDisponiveis -= quantidade;
    updateComputadoresDisponiveis();
    
    showMessage(`Reserva confirmada para ${horario} (${quantidade} computadores)`, 'success');
    
    // Aqui você poderia salvar no Firestore:
    // saveReservation(horario, quantidade, area, materia);
}

function updateComputadoresDisponiveis() {
    document.getElementById('computadores-disponiveis').textContent = 
        `Computadores disponíveis: ${computadoresDisponiveis}`;
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
    
    materiaSelect.innerHTML = '<option value="" disabled selected>Selecione uma matéria</option>';
    materiaSelect.disabled = !areaSelecionada;
    
    if (areaSelecionada && materiasPorArea[areaSelecionada]) {
        materiasPorArea[areaSelecionada].forEach(materia => {
            const option = new Option(materia, materia);
            materiaSelect.add(option);
        });
    }
}

// Confirmações e Notificações
function confirmarEntrega() {
    const email = "celia123@gmail.com";
    const assunto = "Confirmação de Entrega do Computador";
    const corpo = `Olá Célia Alves,\n\nO computador foi entregue com sucesso e marcado como 'ok'.\n\nObrigado.`;

    if (confirm("Confirmação de entrega será enviada por email. Continuar?")) {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
        exibirDataHora("Entrega");
        showMessage('Entrega confirmada e e-mail enviado.', 'success');
    }
}

function confirmarDevolucao() {
    const email = "celia123@gmail.com";
    const assunto = "Confirmação de Devolução do Computador";
    const corpo = `Olá Célia Alves,\n\nO computador foi devolvido com sucesso.\n\nObrigado.`;

    if (confirm("Confirmação de devolução será enviada por email. Continuar?")) {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
        exibirDataHora("Devolução");
        showMessage('Devolução confirmada e e-mail enviado.', 'success');
    }
}

function exibirDataHora(acao) {
    const now = new Date();
    const mensagem = `${acao} realizada em: ${now.toLocaleTimeString('pt-BR')} ${now.toLocaleDateString('pt-BR')}`;
    showMessage(mensagem, 'info');
}

// Funções auxiliares
function showMessage(text, type = 'info', element = null) {
    const target = element || document.getElementById('mensagem-acao');
    target.textContent = text;
    target.style.display = 'block';
    target.className = `message ${type}`;
    
    if (type !== 'error') {
        setTimeout(() => {
            target.style.display = 'none';
        }, 5000);
    }
}

function showLoader(show) {
    const loader = document.getElementById('loader') || createLoader();
    loader.style.display = show ? 'block' : 'none';
}

function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
    return loader;
}

// Login com Microsoft
function loginMicrosoft() {
    const clientId = "SEU_CLIENT_ID_AQUI";
    const tenantId = "SEU_TENANT_ID_AQUI"; 
    const redirectUri = encodeURIComponent("http://localhost:5500");

    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=openid%20email%20profile&response_mode=fragment`;

    window.location.href = authUrl;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login
    document.getElementById('form-login')?.addEventListener('submit', login);
    document.querySelector('.toggle-password')?.addEventListener('click', togglePasswordVisibility);
    
    // Recuperação de senha
    document.getElementById('form-recuperacao')?.addEventListener('submit', enviarEmailRecuperacao);
    document.querySelector('.btn-link[onclick="mostrarRecuperacao()"]')?.addEventListener('click', mostrarRecuperacao);
    document.querySelector('.btn-link[onclick="voltarParaLogin()"]')?.addEventListener('click', voltarParaLogin);
    
    // Reserva de computadores
    document.getElementById('area')?.addEventListener('change', atualizarMaterias);
    document.getElementById('form-reserva')?.addEventListener('submit', reservarComputador);
    
    // Botões Microsoft
    document.querySelector('.btn-microsoft')?.addEventListener('click', loginMicrosoft);
    
    // Atualiza display inicial
    updateComputadoresDisponiveis();
    atualizarMaterias();
});