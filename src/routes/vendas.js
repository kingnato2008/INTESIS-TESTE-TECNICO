const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendasController');

router.get('/', controller.getVendas);
router.post('/', controller.createVenda);

module.exports = router;