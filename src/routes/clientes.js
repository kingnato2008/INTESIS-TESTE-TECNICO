console.log("ROTA CLIENTES CARREGADA");
const express = require('express');
const router = express.Router();
const controller = require('../controllers/clientesController');

router.get('/', controller.getClientes);
router.post('/', controller.createCliente);
router.put('/:id', controller.updateCliente);
router.delete('/:id', controller.deleteCliente);

module.exports = router;

router.delete('/:id', (req, res) => {
  res.send("DELETE OK");
});

