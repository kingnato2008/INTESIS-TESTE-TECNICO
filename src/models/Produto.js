const { validarPreco } = require('../utils/validacoes');

class Produto {
  constructor({ nome, preco }) {
    this.nome = nome;
    this.preco = preco;
  }

  validar() {
    if (!this.nome) {
      throw new Error('Nome é obrigatório');
    }

    if (!validarPreco(this.preco)) {
      throw new Error('Preço deve ser maior que 0');
    }
  }
}

module.exports = Produto;