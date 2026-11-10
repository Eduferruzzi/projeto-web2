-- dados iniciais p testes 
-- Senhas (Hash SHA-256 + SALT, formato salt$hash):
--   funcionario@gmail.com - 4321
--   outros usuários       - 1234
SET NAMES utf8mb4;
USE manutencao_db;

-- usuarios iniciais de teste
INSERT INTO usuario (nome, email, senha, perfil, ativo) VALUES ('Cliente', 'cliente@gmail.com', '00112233445566778899aabbccddeeff$8c8fb15e510c23192b9ecceb9cc163a6062c5c05faa10a68d900fe73cb0af2f3', 'CLIENTE', TRUE);
INSERT INTO usuario (nome, email, senha, perfil, ativo) VALUES ('Funcionario', 'funcionario@gmail.com', 'ffeeddccbbaa99887766554433221100$4d1e62fc1c152f975197e7527a0b4ee171528aacc4fe36fa11369b639b5ba624', 'FUNCIONARIO', TRUE);

INSERT INTO cliente (usuario_id, cpf, telefone, cep, logradouro, numero, bairro, cidade, estado)
VALUES (1, '00000000000', '41999999999', '80010000', 'xx', '6767', 'Centro', 'Curitiba', 'PR');

INSERT INTO funcionario (usuario_id, data_nascimento)
VALUES (2, '1967-01-01');

-- funcionarios do enunciado
INSERT INTO usuario (id, nome, email, senha, perfil, ativo) VALUES
(3, 'Maria', 'maria@gmail.com', '132114ec8fc8eb6c256b7966d4d9d49c$6d316d78b09ca89e59d943fbbf79eb5fb7ad503174aebeffc3fd4c62b8c9fca3', 'FUNCIONARIO', TRUE),
(4, 'Mário', 'mario@gmail.com', '0f3d2afbb6df791164d56aec79c2d922$528eef691517691464d41aec5efe873da95ffdac479c461f42391f3139614c5b', 'FUNCIONARIO', TRUE);

INSERT INTO funcionario (usuario_id, data_nascimento) VALUES
(3, '1990-03-15'),
(4, '1985-07-22');

-- clientes do enunciado
INSERT INTO usuario (id, nome, email, senha, perfil, ativo) VALUES
(5, 'João', 'joao@gmail.com', '35a2c582aaf5177fad69a592d64a0565$d851a0cda168fea4d714f1a967c67eae4f0a8d1c01fdc47a8aa5bba4a5dcc19e', 'CLIENTE', TRUE),
(6, 'José', 'jose@gmail.com', '99cbe623f0f4596fa9c198652782b20b$1116fb033c8924dda7f829fafe6c165d2719fbef9d667aeef95e457e780ab523', 'CLIENTE', TRUE),
(7, 'Joana', 'joana@gmail.com', '7b254c41c8643769164eb98189e942dd$4c33bccb59e3684ea9b42bfd0f8ce75e8983250cceb63c13013610d74dea7535', 'CLIENTE', TRUE),
(8, 'Joaquina', 'joaquina@gmail.com', '2a21586a9a3913b7e56319a418077848$50fe5b4ea553cba45925f7f6ab6e64bcc8fa41907bc253e96730102c917c687f', 'CLIENTE', TRUE);

INSERT INTO cliente (usuario_id, cpf, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES
(5, '11122233344', '41988887777', '80060000', 'Rua XV de Novembro', '1299', 'Apto 302', 'Centro', 'Curitiba', 'PR'),
(6, '22233344455', '41977776666', '80420000', 'Avenida Sete de Setembro', '3165', NULL, 'Rebouças', 'Curitiba', 'PR'),
(7, '33344455566', '41966665555', '80730000', 'Rua Padre Anchieta', '2050', 'Casa 2', 'Bigorrilho', 'Curitiba', 'PR'),
(8, '44455566677', '41955554444', '81530000', 'Avenida Coronel Francisco H. dos Santos', '100', NULL, 'Jardim das Américas', 'Curitiba', 'PR');

-- categorias de equipamento 
INSERT INTO categoria_equipamento (id, nome, ativo) VALUES
(1, 'Notebook', TRUE),
(2, 'Desktop', TRUE),
(3, 'Impressora', TRUE),
(4, 'Mouse', TRUE),
(5, 'Teclado', TRUE);
