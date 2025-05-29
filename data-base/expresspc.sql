-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: expresspc
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `id_administrador` int NOT NULL AUTO_INCREMENT COMMENT 'Informações específicas de usuários com perfil de administrador do sistema.',
  `id_usuario` int NOT NULL,
  `nivel_acesso` varchar(20) NOT NULL,
  `data_cadastro_admin` date NOT NULL,
  PRIMARY KEY (`id_administrador`),
  UNIQUE KEY `id_usuario_UNIQUE` (`id_usuario`),
  KEY `id_usuario_idx` (`id_usuario`),
  CONSTRAINT `fk_administrador_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
INSERT INTO `administrador` VALUES (1,3,'total','2025-05-25');
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aluno`
--

DROP TABLE IF EXISTS `aluno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aluno` (
  `id_matricula` int NOT NULL AUTO_INCREMENT COMMENT 'Informações específicas de alunos, incluindo o reconhecimento facial.',
  `id_usuario` int NOT NULL COMMENT 'Referência à conta de usuário geral',
  `curso` varchar(40) NOT NULL,
  `registro_facial` mediumblob NOT NULL COMMENT 'Reconhecimento facial para alunos',
  `turma` varchar(10) NOT NULL,
  `turno` enum('matutino','noturno') NOT NULL,
  PRIMARY KEY (`id_matricula`),
  UNIQUE KEY `id_usuario_UNIQUE` (`id_usuario`),
  UNIQUE KEY `registro_facial_UNIQUE` (`registro_facial`(255)),
  KEY `id_usuario_idx` (`id_usuario`),
  CONSTRAINT `fk_aluno_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aluno`
--

LOCK TABLES `aluno` WRITE;
/*!40000 ALTER TABLE `aluno` DISABLE KEYS */;
INSERT INTO `aluno` VALUES (1,1,'Sistemas de Informação',_binary 'dados_facial_fake','3A','matutino');
/*!40000 ALTER TABLE `aluno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area_conhecimento`
--

DROP TABLE IF EXISTS `area_conhecimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `area_conhecimento` (
  `id_area_conhecimento` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Categoriza as áreas de conhecimento das matérias (exemplo: Tecnologia, Marketing, RH).',
  `nome_area` varchar(20) NOT NULL,
  `codigo_area` varchar(20) DEFAULT NULL COMMENT 'A ideia é que ela armazene as diferentes grandes áreas de estudo ou conhecimento que existem na instituição (como "Tecnologia", "Gestão", etc).',
  PRIMARY KEY (`id_area_conhecimento`),
  UNIQUE KEY `nome_area_UNIQUE` (`nome_area`),
  UNIQUE KEY `codigo_area_UNIQUE` (`codigo_area`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area_conhecimento`
--

LOCK TABLES `area_conhecimento` WRITE;
/*!40000 ALTER TABLE `area_conhecimento` DISABLE KEYS */;
INSERT INTO `area_conhecimento` VALUES (1,'Tecnologia','TEC'),(2,'Gestão','GES');
/*!40000 ALTER TABLE `area_conhecimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emprestimo`
--

DROP TABLE IF EXISTS `emprestimo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emprestimo` (
  `id_emprestimo` int NOT NULL AUTO_INCREMENT COMMENT 'Gerencia os registros de empréstimos de notebooks, incluindo o resultado da verificação biométrica',
  `id_reserva` int NOT NULL,
  `matricula_aluno_retirada` int NOT NULL,
  `id_notebook_emprestado` int NOT NULL,
  `id_funcionario_liberacao` int NOT NULL,
  `data_hora_emprestimo` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora que foi emprestado o notebook',
  `data_hora_devolucao_prevista` datetime NOT NULL COMMENT 'Guarda a data e a hora em que o notebook deveria ser devolvido pelo aluno. É o prazo final do empréstimo.',
  `data_hora_efetiva` datetime DEFAULT NULL COMMENT 'Data e hora que o notebook foi devolvido.',
  `id_funcionario_recebimento` int NOT NULL,
  `status_emprestimo` enum('ativo','devolvido','atrasado','devolvido_com_avaria') NOT NULL,
  `observacoes_emprestimo` text,
  `verificacao_biometrica_retirada` enum('sucesso','falha','nao_realizada','rosto_nao_dectado') NOT NULL COMMENT 'Ex: 0.9987 (score de confiança da API de reconhecimento)',
  `score_confianca_retirada` decimal(5,4) NOT NULL,
  `verificacao_biometrica_devolucao` enum('sucesso','falha','nao_realizada','rosto_nao_dectado') NOT NULL,
  `score_confianca_devolucao` decimal(5,4) NOT NULL,
  PRIMARY KEY (`id_emprestimo`),
  KEY `id_reserva_idx` (`id_reserva`),
  KEY `matricula_aluno_retirada_idx` (`matricula_aluno_retirada`),
  KEY `id_notebok_emprestado_idx` (`id_notebook_emprestado`),
  KEY `id_funcionario_liberacao_idx` (`id_funcionario_liberacao`),
  KEY `id_funcionario_recebimento_idx` (`id_funcionario_recebimento`),
  CONSTRAINT `fk_emprestimo_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  CONSTRAINT `id_funcionario_liberacao` FOREIGN KEY (`id_funcionario_liberacao`) REFERENCES `funcionario` (`id_funcionario`),
  CONSTRAINT `id_funcionario_recebimento` FOREIGN KEY (`id_funcionario_recebimento`) REFERENCES `funcionario` (`id_funcionario`),
  CONSTRAINT `id_notebook_emprestado` FOREIGN KEY (`id_notebook_emprestado`) REFERENCES `notebook` (`id_notebook`),
  CONSTRAINT `matricula_aluno_retirada` FOREIGN KEY (`matricula_aluno_retirada`) REFERENCES `aluno` (`id_matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emprestimo`
--

LOCK TABLES `emprestimo` WRITE;
/*!40000 ALTER TABLE `emprestimo` DISABLE KEYS */;
/*!40000 ALTER TABLE `emprestimo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionario`
--

DROP TABLE IF EXISTS `funcionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario` (
  `id_funcionario` int NOT NULL AUTO_INCREMENT COMMENT 'Informações específicas de funcionários (ex: suporte técnico).',
  `id_usuario` int NOT NULL,
  `cargo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_funcionario`),
  UNIQUE KEY `id_usuario_UNIQUE` (`id_usuario`),
  KEY `id_usuario_idx` (`id_usuario`),
  CONSTRAINT `fk_funcionario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario`
--

LOCK TABLES `funcionario` WRITE;
/*!40000 ALTER TABLE `funcionario` DISABLE KEYS */;
INSERT INTO `funcionario` VALUES (1,4,'Suporte Técnico');
/*!40000 ALTER TABLE `funcionario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materia`
--

DROP TABLE IF EXISTS `materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materia` (
  `id_materia` int NOT NULL AUTO_INCREMENT COMMENT 'Detalha as matérias.',
  `nome_materia` varchar(45) NOT NULL,
  `cod_materia` varchar(45) NOT NULL,
  `id_area_conhecimento` int unsigned NOT NULL,
  `id_professor_responsavel` int NOT NULL,
  PRIMARY KEY (`id_materia`),
  UNIQUE KEY `cod_materia_UNIQUE` (`cod_materia`),
  KEY `id_professor_responsavel_idx` (`id_professor_responsavel`),
  KEY `id_area_conhecimento_idx` (`id_area_conhecimento`),
  CONSTRAINT `id_area_conhecimento` FOREIGN KEY (`id_area_conhecimento`) REFERENCES `area_conhecimento` (`id_area_conhecimento`),
  CONSTRAINT `id_professor_responsavel` FOREIGN KEY (`id_professor_responsavel`) REFERENCES `professor` (`id_professor`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materia`
--

LOCK TABLES `materia` WRITE;
/*!40000 ALTER TABLE `materia` DISABLE KEYS */;
INSERT INTO `materia` VALUES (1,'Administração Financeira','MAT001',1,1),(2,'Gestão de Vendas','MAT002',1,1),(3,'Empreendedorismo','MAT003',1,1),(4,'Comportamento Organizacional','MAT004',2,1),(5,'Recrutamento e Seleção','MAT005',2,1),(6,'Legislação Trabalhista','MAT006',2,1);
/*!40000 ALTER TABLE `materia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notebook`
--

DROP TABLE IF EXISTS `notebook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notebook` (
  `id_notebook` int NOT NULL AUTO_INCREMENT,
  `patrimonio` int NOT NULL,
  `marca` varchar(20) NOT NULL,
  `modelo` varchar(20) NOT NULL,
  `status_notebook` enum('disponivel','em_uso','em_manutencao','reservado') NOT NULL DEFAULT 'disponivel',
  PRIMARY KEY (`id_notebook`),
  UNIQUE KEY `patrimonio_UNIQUE` (`patrimonio`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notebook`
--

LOCK TABLES `notebook` WRITE;
/*!40000 ALTER TABLE `notebook` DISABLE KEYS */;
INSERT INTO `notebook` VALUES (1,1001,'Dell','Inspiron 15','disponivel'),(2,1002,'Lenovo','ThinkPad T14','disponivel');
/*!40000 ALTER TABLE `notebook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor` (
  `id_professor` int NOT NULL AUTO_INCREMENT COMMENT 'Informações específicas de professores.',
  `id_usuario` int NOT NULL,
  `area` varchar(45) NOT NULL,
  `titulacao` varchar(45) NOT NULL,
  PRIMARY KEY (`id_professor`),
  UNIQUE KEY `id_usuario_UNIQUE` (`id_usuario`),
  CONSTRAINT `fk_professor_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
INSERT INTO `professor` VALUES (1,2,'Tecnologia','Mestre');
/*!40000 ALTER TABLE `professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id_reserva` int NOT NULL AUTO_INCREMENT COMMENT 'Controla as reservas de notebooks',
  `id_usuario_solicitante` int NOT NULL COMMENT 'Professor ou Administrador',
  `id_materia` int NOT NULL,
  `data_hora_inicio_reserva` datetime NOT NULL,
  `data_hora_fim_reserva` datetime NOT NULL,
  `quantidade_notebook_solicitados` int NOT NULL DEFAULT '1',
  `status_reserva` enum('solicitada','confirmada','cancelada_pelo_usuario','cancelada_pelo_admin','concluida') NOT NULL DEFAULT 'solicitada',
  `data_solicitacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_admin_responsavel_acao` int NOT NULL COMMENT 'Admin que confirmou/cancelou a reserva',
  PRIMARY KEY (`id_reserva`),
  KEY `id_usuario_solicitante_idx` (`id_usuario_solicitante`),
  KEY `id_materia_idx` (`id_materia`),
  KEY `id_admin_responsavel_acao_idx` (`id_admin_responsavel_acao`),
  CONSTRAINT `id_admin_responsavel_acao` FOREIGN KEY (`id_admin_responsavel_acao`) REFERENCES `administrador` (`id_administrador`),
  CONSTRAINT `id_materia` FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id_materia`),
  CONSTRAINT `id_usuario_solicitante` FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT COMMENT 'Armazena informações básicas comuns a todos os usuários e é central para autenticação.\n',
  `firebase_uid` varchar(50) NOT NULL COMMENT 'UID do Firebase -> apenas para login federado Microsoft',
  `nome_completo` varchar(70) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha_hash` varchar(200) NOT NULL COMMENT 'Hash da senha -> apenas para login direto e-mail/senha da aplicação',
  `tipo_usuario` enum('aluno','professor','funcionario','administrador') NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_usuario` enum('ativo','pendente verificacao') NOT NULL DEFAULT 'ativo',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `firebase_uid_UNIQUE` (`firebase_uid`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'uid123','João da Silva','joao@email.com','hash_senha1','aluno','2025-05-26 01:33:29','ativo'),(2,'uid456','Maria Oliveira','maria@email.com','hash_senha2','professor','2025-05-26 01:33:29','ativo'),(3,'uid789','Carlos Admin','carlos@email.com','hash_senha3','administrador','2025-05-26 01:33:29','ativo'),(4,'uid999','Ana Suporte','ana@email.com','hash_senha4','funcionario','2025-05-26 01:33:29','ativo');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-27 20:34:17
