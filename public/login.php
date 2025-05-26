<?php
session_start();

// Configurações do banco de dados
$host = "localhost";
$username = "root";
$password = "";
$dbname = "expressPC";

// Conexão com MySQLi (substituindo as funções mysql_* obsoletas)
$conn = new mysqli($host, $username, $password, $dbname);

// Verifica conexão
if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Verifica se o formulário foi submetido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitiza e valida os inputs
    $login = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $senha = $_POST['password'] ?? '';
    
    // Validação básica
    if (empty($login) || empty($senha)) {
        echo json_encode(["status" => "error", "message" => "E-mail e senha são obrigatórios"]);
        exit;
    }

    // Prepara a query com statement para evitar SQL injection
    $stmt = $conn->prepare("SELECT id, login, senha FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $usuario = $result->fetch_assoc();
        
        // Verifica a senha (usando password_verify ao invés de md5)
        if (password_verify($senha, $usuario['senha'])) {
            // Cria a sessão
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_login'] = $usuario['login'];
            
            // Resposta JSON para o AJAX
            echo json_encode(["status" => "success", "redirect" => "index.php"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Credenciais inválidas"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Credenciais inválidas"]);
    }

    $stmt->close();
    $conn->close();
    exit;
}