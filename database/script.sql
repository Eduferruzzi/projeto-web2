-- DDL do projeto (script completamente inicial, apenas para servir de base)
CREATE DATABASE IF NOT EXISTS manutencao_db;
USE manutencao_db;

-- tabela central para controle de login e soft delete (RF002)
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- para Hash SHA-256 + SALT
    perfil ENUM('CLIENTE', 'FUNCIONARIO') NOT NULL,
    ativo BOOLEAN DEFAULT TRUE 
);

-- dados do Cliente (RF001)
CREATE TABLE cliente (
    usuario_id INT PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(50),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- dados do Funcionário (RF018)
CREATE TABLE funcionario (
    usuario_id INT PRIMARY KEY,
    data_nascimento DATE NOT NULL,
    CONSTRAINT fk_funcionario_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabela de Categorias (RF017)
CREATE TABLE categoria_equipamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela principal de Solicitações (RF004, RF012, RF014)
CREATE TABLE solicitacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    categoria_id INT NOT NULL,
    descricao_equipamento VARCHAR(30) NOT NULL,
    descricao_defeito TEXT NOT NULL,
    estado_atual ENUM('ABERTA', 'ORCADA', 'APROVADA', 'REJEITADA', 'REDIRECIONADA', 'ARRUMADA', 'PAGA', 'FINALIZADA') DEFAULT 'ABERTA',
    
    -- Dados de Orçamento (RF012)
    valor_orcamento DECIMAL(10,2),
    data_hora_orcamento DATETIME,
    funcionario_orcamento_id INT,
    
    -- Dados de Rejeição (RF007)
    motivo_rejeicao TEXT,
    
    -- Dados de Manutenção (RF014)
    descricao_manutencao TEXT,
    orientacoes_cliente TEXT,
    data_hora_manutencao DATETIME,
    funcionario_manutencao_id INT,
    
    -- Controle de Redirecionamento Atual (RF015)
    funcionario_atual_id INT,
    
    -- Dados de Finalização e Pagamento (RF010 e RF016)
    data_hora_pagamento DATETIME,
    data_hora_finalizacao DATETIME,
    funcionario_finalizacao_id INT,
    
    CONSTRAINT fk_solicitacao_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(usuario_id),
    CONSTRAINT fk_solicitacao_categoria FOREIGN KEY (categoria_id) REFERENCES categoria_equipamento(id),
    CONSTRAINT fk_solic_func_orcamento FOREIGN KEY (funcionario_orcamento_id) REFERENCES funcionario(usuario_id),
    CONSTRAINT fk_solic_func_manutencao FOREIGN KEY (funcionario_manutencao_id) REFERENCES funcionario(usuario_id),
    CONSTRAINT fk_solic_func_atual FOREIGN KEY (funcionario_atual_id) REFERENCES funcionario(usuario_id),
    CONSTRAINT fk_solic_func_finalizacao FOREIGN KEY (funcionario_finalizacao_id) REFERENCES funcionario(usuario_id)
);

-- Tabela de Histórico (RF008 e RF015)
CREATE TABLE historico_solicitacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitacao_id INT NOT NULL,
    data_hora DATETIME NOT NULL,
    estado_anterior ENUM('ABERTA', 'ORCADA', 'APROVADA', 'REJEITADA', 'REDIRECIONADA', 'ARRUMADA', 'PAGA', 'FINALIZADA'),
    estado_novo ENUM('ABERTA', 'ORCADA', 'APROVADA', 'REJEITADA', 'REDIRECIONADA', 'ARRUMADA', 'PAGA', 'FINALIZADA') NOT NULL,
    funcionario_origem_id INT,
    funcionario_destino_id INT,
    observacao TEXT,
    CONSTRAINT fk_historico_solicitacao FOREIGN KEY (solicitacao_id) REFERENCES solicitacao(id),
    CONSTRAINT fk_historico_func_origem FOREIGN KEY (funcionario_origem_id) REFERENCES funcionario(usuario_id),
    CONSTRAINT fk_historico_func_destino FOREIGN KEY (funcionario_destino_id) REFERENCES funcionario(usuario_id)
);