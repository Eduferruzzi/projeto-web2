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

-- solicitacoes, passando por todos os estados
-- duas sao abertas na data de hoje com CURDATE p testar o filtro hoje
INSERT INTO solicitacao (id, cliente_id, categoria_id, descricao_equipamento, descricao_defeito, data_hora_abertura, ativo, estado_atual, valor_orcamento, data_hora_orcamento, funcionario_orcamento_id, motivo_rejeicao, descricao_manutencao, orientacoes_cliente, data_hora_manutencao, funcionario_manutencao_id, funcionario_atual_id, data_hora_pagamento, data_hora_finalizacao, funcionario_finalizacao_id) VALUES
(1, 5, 1, 'Notebook Dell Inspiron 15 3520', 'Não liga, nem acende o LED de energia.', '2026-09-02 09:10:00', TRUE, 'ABERTA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 6, 3, 'Impressora HP DeskJet 2774', 'Puxa várias folhas de uma vez e atola o papel.', TIMESTAMP(CURDATE(), '08:30:00'), TRUE, 'ABERTA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 7, 4, 'Mouse Logitech M170 sem fio', 'Cursor travando e o clique direito não responde.', TIMESTAMP(CURDATE(), '10:45:00'), TRUE, 'ABERTA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 8, 2, 'Desktop Positivo Master D570', 'Reinicia sozinho após alguns minutos de uso.', '2026-11-05 14:20:00', TRUE, 'ABERTA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 1, 5, 'Teclado Redragon Kumara K552', 'Teclas W e S pararam de funcionar.', '2026-11-08 16:05:00', TRUE, 'ABERTA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 5, 5, 'Teclado Microsoft Wired 600', 'Derramei café, várias teclas grudando.', '2026-10-01 10:00:00', TRUE, 'ORCADA', 150.00, '2026-10-02 11:00:00', 3, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
(7, 7, 1, 'Notebook Lenovo IdeaPad 3 15ITL6', 'Tela com listras verticais coloridas.', '2026-10-20 09:00:00', TRUE, 'ORCADA', 480.00, '2026-10-21 15:30:00', 4, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL),
(8, 1, 1, 'Notebook Acer Aspire 5 A515-54', 'Bateria não carrega e desliga fora da tomada.', '2026-10-28 13:40:00', TRUE, 'ORCADA', 200.00, '2026-10-29 09:15:00', 2, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL),
(9, 6, 2, 'Desktop Dell OptiPlex 3080', 'Muito lento, HD fazendo barulho de clique.', '2026-09-10 08:00:00', TRUE, 'APROVADA', 350.00, '2026-09-11 10:30:00', 3, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
(10, 8, 3, 'Impressora Epson EcoTank L3250', 'Impressão saindo com falhas e manchas.', '2026-10-25 11:10:00', TRUE, 'APROVADA', 220.00, '2026-10-26 14:00:00', 4, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL),
(11, 7, 5, 'Teclado Logitech K120', 'Tecla Enter solta.', '2026-09-15 15:00:00', TRUE, 'REJEITADA', 90.00, '2026-09-16 09:40:00', 4, 'Valor acima do esperado, prefiro comprar um novo.', NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL),
(12, 5, 4, 'Mouse Gamer Razer DeathAdder V2', 'Duplo clique sozinho no botão esquerdo.', '2026-10-08 19:30:00', TRUE, 'REJEITADA', 60.00, '2026-10-09 10:00:00', 3, 'Vou acionar a garantia do fabricante.', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
(13, 6, 1, 'Notebook Samsung Book NP550XDA', 'Não reconhece o Wi-Fi após atualização.', '2026-10-13 09:20:00', TRUE, 'REDIRECIONADA', 600.00, '2026-10-13 16:00:00', 3, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL),
(14, 8, 2, 'Desktop gamer Ryzen 5 5600 / RX 6600', 'Sem vídeo ao ligar, ventoinhas giram.', '2026-10-16 17:45:00', TRUE, 'REDIRECIONADA', 750.00, '2026-10-17 09:30:00', 4, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
(15, 7, 3, 'Impressora Brother HL-1202', 'Erro de toner mesmo com toner novo.', '2026-10-03 08:50:00', TRUE, 'ARRUMADA', 280.00, '2026-10-03 14:00:00', 3, NULL, 'Substituído o chip do cartucho e limpeza do sensor.', 'Use apenas toner compatível com chip.', '2026-10-07 16:30:00', 3, 3, NULL, NULL, NULL),
(16, 5, 2, 'Desktop HP ProDesk 400 G6', 'Fonte queimada após queda de energia.', '2026-09-20 10:00:00', TRUE, 'ARRUMADA', 420.00, '2026-09-21 11:00:00', 4, 'Vou pesquisar outros orçamentos.', 'Troca da fonte de alimentação por uma de 500W.', 'Recomendado o uso de nobreak ou estabilizador.', '2026-10-02 17:00:00', 4, 4, NULL, NULL, NULL),
(17, 1, 4, 'Mouse Multilaser MO277', 'Scroll não funciona.', '2026-10-30 10:00:00', TRUE, 'ARRUMADA', 45.00, '2026-10-30 15:00:00', 2, NULL, 'Troca do encoder do scroll.', 'Evite usar o mouse em superfícies com poeira.', '2026-11-03 11:20:00', 2, 2, NULL, NULL, NULL),
(18, 6, 4, 'Mouse Microsoft Bluetooth', 'Não pareia com o computador.', '2026-09-14 13:00:00', TRUE, 'PAGA', 75.00, '2026-09-15 08:30:00', 3, NULL, 'Troca do módulo Bluetooth.', 'Mantenha as pilhas carregadas.', '2026-09-18 15:45:00', 3, 3, '2026-09-20 10:30:00', NULL, NULL),
(19, 8, 1, 'Notebook Asus Vivobook 15 X1504ZA', 'Teclado do notebook com várias teclas falhando.', '2026-10-21 08:00:00', TRUE, 'PAGA', 550.00, '2026-10-21 16:20:00', 3, NULL, 'Substituição completa do teclado.', 'Evite comer ou beber próximo ao notebook.', '2026-10-28 14:00:00', 4, 4, '2026-10-30 18:40:00', NULL, NULL),
(20, 5, 3, 'Impressora Canon PIXMA G3110', 'Cabeça de impressão entupida.', '2026-08-28 09:00:00', TRUE, 'FINALIZADA', 310.00, '2026-08-28 15:00:00', 3, NULL, 'Limpeza profunda da cabeça de impressão.', 'Imprima ao menos uma página por semana.', '2026-09-03 11:00:00', 3, 3, '2026-09-05 09:30:00', '2026-09-06 10:00:00', 3),
(21, 7, 2, 'Desktop Lenovo ThinkCentre M70s', 'Placa-mãe com capacitores estufados.', '2026-09-08 10:15:00', TRUE, 'FINALIZADA', 700.00, '2026-09-09 09:00:00', 4, NULL, 'Troca da placa-mãe.', 'Mantenha o gabinete em local ventilado.', '2026-09-22 15:00:00', 4, 4, '2026-09-25 14:10:00', '2026-09-26 09:00:00', 4),
(22, 6, 5, 'Teclado mecânico HyperX Alloy Origins', 'Switch da barra de espaço falhando.', '2026-10-05 11:00:00', TRUE, 'FINALIZADA', 120.00, '2026-10-05 16:00:00', 3, NULL, 'Troca do switch e estabilizador da barra de espaço.', 'Limpe o teclado com ar comprimido periodicamente.', '2026-10-10 15:30:00', 3, 3, '2026-10-12 09:20:00', '2026-10-13 08:30:00', 3),
(23, 8, 4, 'Mouse Dell MS116', 'Cabo USB rompido.', '2026-10-06 14:00:00', TRUE, 'FINALIZADA', 85.00, '2026-10-07 10:00:00', 4, NULL, 'Substituição do cabo USB.', 'Evite dobrar o cabo próximo ao conector.', '2026-10-09 16:00:00', 4, 4, '2026-10-12 17:45:00', '2026-10-13 09:00:00', 4),
(24, 7, 1, 'Notebook Apple MacBook Air M1', 'Tela trincada após queda.', '2026-10-22 10:30:00', TRUE, 'FINALIZADA', 890.00, '2026-10-23 11:00:00', 3, NULL, 'Substituição do display completo.', 'Use capa protetora para transporte.', '2026-10-31 15:00:00', 3, 3, '2026-11-03 10:00:00', '2026-11-04 08:40:00', 3);

-- historico das solicitacoes
INSERT INTO historico_solicitacao (solicitacao_id, data_hora, estado_anterior, estado_novo, funcionario_origem_id, funcionario_destino_id, observacao) VALUES
(1, '2026-09-02 09:10:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(2, TIMESTAMP(CURDATE(), '08:30:00'), NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(3, TIMESTAMP(CURDATE(), '10:45:00'), NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(4, '2026-11-05 14:20:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(5, '2026-11-08 16:05:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(6, '2026-10-01 10:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(6, '2026-10-02 11:00:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(7, '2026-10-20 09:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(7, '2026-10-21 15:30:00', 'ABERTA', 'ORCADA', 4, 4, 'Orçamento registrado.'),
(8, '2026-10-28 13:40:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(8, '2026-10-29 09:15:00', 'ABERTA', 'ORCADA', 2, 2, 'Orçamento registrado.'),
(9, '2026-09-10 08:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(9, '2026-09-11 10:30:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(9, '2026-09-12 18:20:00', 'ORCADA', 'APROVADA', 3, 3, 'Orcamento aprovado pelo cliente.'),
(10, '2026-10-25 11:10:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(10, '2026-10-26 14:00:00', 'ABERTA', 'ORCADA', 4, 4, 'Orçamento registrado.'),
(10, '2026-10-27 08:45:00', 'ORCADA', 'APROVADA', 4, 4, 'Orcamento aprovado pelo cliente.'),
(11, '2026-09-15 15:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(11, '2026-09-16 09:40:00', 'ABERTA', 'ORCADA', 4, 4, 'Orçamento registrado.'),
(11, '2026-09-17 12:10:00', 'ORCADA', 'REJEITADA', NULL, NULL, 'Valor acima do esperado, prefiro comprar um novo.'),
(12, '2026-10-08 19:30:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(12, '2026-10-09 10:00:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(12, '2026-10-10 08:15:00', 'ORCADA', 'REJEITADA', NULL, NULL, 'Vou acionar a garantia do fabricante.'),
(13, '2026-10-13 09:20:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(13, '2026-10-13 16:00:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(13, '2026-10-14 10:05:00', 'ORCADA', 'APROVADA', 3, 3, 'Orcamento aprovado pelo cliente.'),
(13, '2026-10-15 11:30:00', 'APROVADA', 'REDIRECIONADA', 3, 4, 'Solicitação redirecionada de Maria para Mário.'),
(14, '2026-10-16 17:45:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(14, '2026-10-17 09:30:00', 'ABERTA', 'ORCADA', 4, 4, 'Orçamento registrado.'),
(14, '2026-10-17 20:00:00', 'ORCADA', 'APROVADA', 4, 4, 'Orcamento aprovado pelo cliente.'),
(14, '2026-10-18 10:10:00', 'APROVADA', 'REDIRECIONADA', 4, 3, 'Solicitação redirecionada de Mário para Maria.'),
(15, '2026-10-03 08:50:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(15, '2026-10-03 14:00:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(15, '2026-10-04 09:00:00', 'ORCADA', 'APROVADA', 3, 3, 'Orcamento aprovado pelo cliente.'),
(15, '2026-10-07 16:30:00', 'APROVADA', 'ARRUMADA', 3, NULL, 'Descrição da manutenção: Substituído o chip do cartucho e limpeza do sensor. Orientações ao cliente: Use apenas toner compatível com chip.'),
(16, '2026-09-20 10:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(16, '2026-09-21 11:00:00', 'ABERTA', 'ORCADA', 4, 4, 'Orçamento registrado.'),
(16, '2026-09-22 09:00:00', 'ORCADA', 'REJEITADA', NULL, NULL, 'Vou pesquisar outros orçamentos.'),
(16, '2026-09-29 14:30:00', 'REJEITADA', 'APROVADA', NULL, NULL, 'Servico resgatado pelo cliente.'),
(16, '2026-10-02 17:00:00', 'APROVADA', 'ARRUMADA', 4, NULL, 'Descrição da manutenção: Troca da fonte de alimentação por uma de 500W. Orientações ao cliente: Recomendado o uso de nobreak ou estabilizador.'),
(17, '2026-10-30 10:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(17, '2026-10-30 15:00:00', 'ABERTA', 'ORCADA', 2, 2, 'Orçamento registrado.'),
(17, '2026-10-31 09:00:00', 'ORCADA', 'APROVADA', 2, 2, 'Orcamento aprovado pelo cliente.'),
(17, '2026-11-03 11:20:00', 'APROVADA', 'ARRUMADA', 2, NULL, 'Descrição da manutenção: Troca do encoder do scroll. Orientações ao cliente: Evite usar o mouse em superfícies com poeira.'),
(18, '2026-09-14 13:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(18, '2026-09-15 08:30:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(18, '2026-09-15 19:00:00', 'ORCADA', 'APROVADA', 3, 3, 'Orcamento aprovado pelo cliente.'),
(18, '2026-09-18 15:45:00', 'APROVADA', 'ARRUMADA', 3, NULL, 'Descrição da manutenção: Troca do módulo Bluetooth. Orientações ao cliente: Mantenha as pilhas carregadas.'),
(18, '2026-09-20 10:30:00', 'ARRUMADA', 'PAGA', NULL, NULL, 'Pagamento confirmado pelo cliente.'),
(19, '2026-10-21 08:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(19, '2026-10-21 16:20:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(19, '2026-10-22 09:10:00', 'ORCADA', 'APROVADA', 3, 3, 'Orcamento aprovado pelo cliente.'),
(19, '2026-10-23 10:00:00', 'APROVADA', 'REDIRECIONADA', 3, 4, 'Solicitação redirecionada de Maria para Mário.'),
(19, '2026-10-28 14:00:00', 'REDIRECIONADA', 'ARRUMADA', 4, NULL, 'Descrição da manutenção: Substituição completa do teclado. Orientações ao cliente: Evite comer ou beber próximo ao notebook.'),
(19, '2026-10-30 18:40:00', 'ARRUMADA', 'PAGA', NULL, NULL, 'Pagamento confirmado pelo cliente.'),
(20, '2026-08-28 09:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(20, '2026-08-28 15:00:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(20, '2026-08-29 10:00:00', 'ORCADA', 'APROVADA', 3, 3, 'Orcamento aprovado pelo cliente.'),
(20, '2026-09-03 11:00:00', 'APROVADA', 'ARRUMADA', 3, NULL, 'Descrição da manutenção: Limpeza profunda da cabeça de impressão. Orientações ao cliente: Imprima ao menos uma página por semana.'),
(20, '2026-09-05 09:30:00', 'ARRUMADA', 'PAGA', NULL, NULL, 'Pagamento confirmado pelo cliente.'),
(20, '2026-09-06 10:00:00', 'PAGA', 'FINALIZADA', 3, NULL, 'Solicitação finalizada.'),
(21, '2026-09-08 10:15:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(21, '2026-09-09 09:00:00', 'ABERTA', 'ORCADA', 4, 4, 'Orçamento registrado.'),
(21, '2026-09-09 17:30:00', 'ORCADA', 'APROVADA', 4, 4, 'Orcamento aprovado pelo cliente.'),
(21, '2026-09-22 15:00:00', 'APROVADA', 'ARRUMADA', 4, NULL, 'Descrição da manutenção: Troca da placa-mãe. Orientações ao cliente: Mantenha o gabinete em local ventilado.'),
(21, '2026-09-25 14:10:00', 'ARRUMADA', 'PAGA', NULL, NULL, 'Pagamento confirmado pelo cliente.'),
(21, '2026-09-26 09:00:00', 'PAGA', 'FINALIZADA', 4, NULL, 'Solicitação finalizada.'),
(22, '2026-10-05 11:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(22, '2026-10-05 16:00:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(22, '2026-10-06 08:00:00', 'ORCADA', 'APROVADA', 3, 3, 'Orcamento aprovado pelo cliente.'),
(22, '2026-10-07 09:00:00', 'APROVADA', 'REDIRECIONADA', 3, 4, 'Solicitação redirecionada de Maria para Mário.'),
(22, '2026-10-08 10:00:00', 'REDIRECIONADA', 'REDIRECIONADA', 4, 3, 'Solicitação redirecionada de Mário para Maria.'),
(22, '2026-10-10 15:30:00', 'REDIRECIONADA', 'ARRUMADA', 3, NULL, 'Descrição da manutenção: Troca do switch e estabilizador da barra de espaço. Orientações ao cliente: Limpe o teclado com ar comprimido periodicamente.'),
(22, '2026-10-12 09:20:00', 'ARRUMADA', 'PAGA', NULL, NULL, 'Pagamento confirmado pelo cliente.'),
(22, '2026-10-13 08:30:00', 'PAGA', 'FINALIZADA', 3, NULL, 'Solicitação finalizada.'),
(23, '2026-10-06 14:00:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(23, '2026-10-07 10:00:00', 'ABERTA', 'ORCADA', 4, 4, 'Orçamento registrado.'),
(23, '2026-10-07 18:00:00', 'ORCADA', 'APROVADA', 4, 4, 'Orcamento aprovado pelo cliente.'),
(23, '2026-10-09 16:00:00', 'APROVADA', 'ARRUMADA', 4, NULL, 'Descrição da manutenção: Substituição do cabo USB. Orientações ao cliente: Evite dobrar o cabo próximo ao conector.'),
(23, '2026-10-12 17:45:00', 'ARRUMADA', 'PAGA', NULL, NULL, 'Pagamento confirmado pelo cliente.'),
(23, '2026-10-13 09:00:00', 'PAGA', 'FINALIZADA', 4, NULL, 'Solicitação finalizada.'),
(24, '2026-10-22 10:30:00', NULL, 'ABERTA', NULL, NULL, 'Solicitacao aberta.'),
(24, '2026-10-23 11:00:00', 'ABERTA', 'ORCADA', 3, 3, 'Orçamento registrado.'),
(24, '2026-10-23 19:00:00', 'ORCADA', 'APROVADA', 3, 3, 'Orcamento aprovado pelo cliente.'),
(24, '2026-10-31 15:00:00', 'APROVADA', 'ARRUMADA', 3, NULL, 'Descrição da manutenção: Substituição do display completo. Orientações ao cliente: Use capa protetora para transporte.'),
(24, '2026-11-03 10:00:00', 'ARRUMADA', 'PAGA', NULL, NULL, 'Pagamento confirmado pelo cliente.'),
(24, '2026-11-04 08:40:00', 'PAGA', 'FINALIZADA', 3, NULL, 'Solicitação finalizada.');