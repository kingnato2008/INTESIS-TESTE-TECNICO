const { validarDocumento } = require('../utils/validacoes');

class Cliente {
  constructor({ nome, documento }) {
    this.nome = nome;
    this.documento = documento;
  }

  validar() {
    if (!this.nome) {
      throw new Error('Nome é obrigatório');
    }

    if (!validarDocumento(this.documento)) {
      throw new Error('CPF ou CNPJ inválido');
    }
  }
}

module.exports = Cliente;