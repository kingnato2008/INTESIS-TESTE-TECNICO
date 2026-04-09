class Venda {
  constructor({ cliente_id, itens }) {
    this.cliente_id = cliente_id;
    this.itens = itens; // [{ produto_id, quantidade, preco }]
  }

  calcularTotal() {
    return this.itens.reduce((total, item) => {
      return total + item.quantidade * item.preco;
    }, 0);
  }

  validar() {
    if (!this.cliente_id) {
      throw new Error('Venda precisa de um cliente');
    }

    if (!this.itens || this.itens.length === 0) {
      throw new Error('Venda precisa de pelo menos um produto');
    }
  }
}

module.exports = Venda;