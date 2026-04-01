const pool = require('../database/database');
const { validarPreco } = require('../utils/validacoes');

exports.getProdutos = async (req, res) => {
  const result = await pool.query('SELECT * FROM produtos');
  res.json(result.rows);
};

exports.createProduto = async (req, res) => {
  const { nome, preco } = req.body;

  if (!validarPreco(preco)) {
    return res.status(400).json({ erro: 'Preço inválido' });
  }

  const result = await pool.query(
    'INSERT INTO produtos (nome, preco) VALUES ($1, $2) RETURNING *',
    [nome, preco]
  );

  res.status(201).json(result.rows[0]);
};

exports.updateProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;

  if (preco && !validarPreco(preco)) {
    return res.status(400).json({ erro: 'Preço inválido' });
  }

  const result = await pool.query(
    `UPDATE produtos 
     SET nome = COALESCE($1, nome),
         preco = COALESCE($2, preco)
     WHERE id = $3
     RETURNING *`,
    [nome, preco, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.json(result.rows[0]);
};

exports.deleteProduto = async (req, res) => {
  const { id } = req.params;

  try {
  await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
  res.status(200).json({ message: 'Produto deletado' });
} catch (error) {
  if (error.code === '23503') {
    return res.status(400).json({
      error: 'Não é possível deletar o produto, pois ele está vinculado a vendas.'
    });
  }
  res.status(500).json({ error: 'Erro interno' });
}
};