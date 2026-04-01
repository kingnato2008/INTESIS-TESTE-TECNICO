console.log("SERVER INICIANDO...");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// rotas
const clientesRoutes = require('./routes/clientes');
const produtosRoutes = require('./routes/produtos');
const vendasRoutes = require('./routes/vendas');

app.use('/clientes', clientesRoutes);
app.use('/produtos', produtosRoutes);
app.use('/vendas', vendasRoutes);

app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});