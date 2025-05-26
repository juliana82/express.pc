<?php
// Configurações do banco de dados
$host = "localhost";
$username = "root";
$password = "";
$dbname = "expressPC";

// Conexão com o banco
$conn = new mysqli($host, $username, $password, $dbname);

// Verifica conexão
if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Pega dados do formulário
$login = $_POST['login'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';
$confirmar_senha = $_POST['confirmar_senha'] ?? '';

// Validações básicas
if (empty($login) || empty($email) || empty($senha) || empty($confirmar_senha)) {
    echo "Todos os campos são obrigatórios!";
    exit;
}

if ($senha !== $confirmar_senha) {
    echo "As senhas não coincidem!";
    exit;
}

// Verifica se usuário já existe
$sql = "SELECT id FROM usuarios WHERE login = ? OR email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $login, $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo "Usuário ou e-mail já cadastrado!";
    $stmt->close();
    $conn->close();
    exit;
}

// Hash da senha
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Insere no banco
$sql = "INSERT INTO usuarios (login, email, senha) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $login, $email, $senha_hash);

if ($stmt->execute()) {
    echo "Cadastro realizado com sucesso!";
    // Redireciona após 2 segundos
    header("Refresh: 2; url=index.html");
} else {
    echo "Erro ao cadastrar: " . $conn->error;
}

$stmt->close();
$conn->close();
?>