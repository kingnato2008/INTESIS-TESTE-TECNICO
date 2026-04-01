const pool = require('../database/database');

exports.getVendas = async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT 
    v.id,
    CONCAT(c.nome, ' (', c.id, ')') AS cliente,
    v.total,
    COALESCE(
      json_agg(
        json_build_object(
          'produto', p.nome,
          'quantidade', vi.quantidade
        )
      ) FILTER (WHERE p.id IS NOT NULL),
      '[]'
    ) AS itens
  FROM vendas v
  LEFT JOIN clientes c ON c.id = v.cliente_id
  LEFT JOIN venda_itens vi ON vi.venda_id = v.id
  LEFT JOIN produtos p ON p.id = vi.produto_id
  GROUP BY v.id, c.nome, c.id
  ORDER BY v.id DESC
`);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar vendas" });
  }
};

exports.createVenda = async (req, res) => {
  const { cliente_id, itens } = req.body;

  if (!cliente_id || !itens || itens.length === 0) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    let total = 0;

    // calcular total
    for (let item of itens) {
      const result = await pool.query(
        "SELECT preco FROM produtos WHERE id = $1",
        [item.produto_id]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ error: "Produto não encontrado" });
      }

      const preco = Number(result.rows[0].preco);
      const quantidade = Number(item.qtd || item.quantidade);

      if (isNaN(preco) || isNaN(quantidade)) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      total += preco * quantidade;

      if (total <= 0) {
       return res.status(400).json({
        error: "Venda deve ter valor maior que zero"
       });
      } 

      
    }


    // inserir venda
    const vendaResult = await pool.query(
      "INSERT INTO vendas (cliente_id, total) VALUES ($1, $2) RETURNING *",
      [cliente_id, total]
    );

    const venda = vendaResult.rows[0];

    // inserir itens
    for (let item of itens) {
      await pool.query(
        "INSERT INTO venda_itens (venda_id, produto_id, quantidade) VALUES ($1, $2, $3)",
        [venda.id, item.produto_id, item.qtd || item.quantidade]
      );
    }

    res.json({
      message: "Venda criada com sucesso",
      venda
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar venda" });
  }
};