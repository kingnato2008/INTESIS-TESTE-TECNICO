const pool = require('../database/database');
const { validarDocumento } = require('../utils/validacoes');


exports.getClientes = async (req, res) => {
  const result = await pool.query('SELECT * FROM clientes');
  res.json(result.rows);
};

exports.createCliente = async (req, res) => {
  const { nome, cpf_cnpj } = req.body;

  if (!validarDocumento(cpf_cnpj)) {
    return res.status(400).json({ erro: 'CPF/CNPJ inválido' });
  }

  const result = await pool.query(
    'INSERT INTO clientes (nome, cpf_cnpj) VALUES ($1, $2) RETURNING *',
    [nome, cpf_cnpj]
  );

  res.status(201).json(result.rows[0]);

};

exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, cpf_cnpj } = req.body;

  if (cpf_cnpj && !validarDocumento(cpf_cnpj)) {
    return res.status(400).json({ erro: 'CPF/CNPJ inválido' });
  }

  const result = await pool.query(
    `UPDATE clientes 
     SET nome = COALESCE($1, nome),
         cpf_cnpj = COALESCE($2, cpf_cnpj)
     WHERE id = $3
     RETURNING *`,
    [nome, cpf_cnpj, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  res.json(result.rows[0]);
};

exports.deleteCliente = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM clientes WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  res.json({ mensagem: 'Removido com sucesso' });
};