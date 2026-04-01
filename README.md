Sistema de Vendas - Teste Técnico Intesis

Descrição
Este projeto é um sistema de gerenciamento de vendas desenvolvido como parte de um teste técnico.

O sistema permite:
- Cadastro de clientes (CPF/CNPJ)
- Cadastro de produtos
- Registro de vendas com múltiplos itens
- Cálculo automático do total da venda
- Histórico completo de vendas

Tecnologias utilizadas

# Backend
- Node.js
- Express
- PostgreSQL
- pg (driver)

# Frontend
- HTML
- CSS
- JavaScript (Vanilla)

---

# Funcionalidades

# Clientes
- Cadastro
- Edição inline na tabela
- Exclusão
- Validação de CPF/CNPJ

# Produtos
- Cadastro
- Edição inline
- Exclusão
- Formatação de preço

# Vendas
- Seleção de cliente
- Adição de múltiplos produtos
- Definição de quantidade
- Cálculo automático do total
- Histórico com:
  - Cliente
  - Produtos
  - Quantidade
  - Total

---

# Banco de dados

O projeto utiliza PostgreSQL com as seguintes tabelas:
- clientes
- produtos
- vendas
- venda_itens

Arquivo SQL disponível para criação do banco.

---

# Como rodar o projeto

# 1. Clonar o repositório
```bash
git clone https://github.com/kingnato2008/INTESIS-TESTE-TECNICO.git
cd INTESIS-TESTE-TECNICO

2. Instalar dependências
npm install

3. Configurar banco de dados
Criar banco PostgreSQL
Rodar o arquivo .sql
Ajustar conexão no arquivo database.js

4. Iniciar o servidor
node src/server.js

5. Abrir frontend

Abra o arquivo index.html com Live Server ou navegador
