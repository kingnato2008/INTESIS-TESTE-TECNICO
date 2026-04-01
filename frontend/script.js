const API = "http://localhost:3000";

function formatCpfCnpj(value) {
  value = value.replace(/\D/g, "");

  if (value.length <= 11) {
    // CPF 000.000.000-00
    return value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ 00.000.000/0000-00
    return value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
}

//CLIENTES
if (document.getElementById("formCliente")) {

  const form = document.getElementById("formCliente");
  const nomeInput = document.getElementById("nome");
  const cpf_cnpjInput = document.getElementById("cpf_cnpj");

  form.onsubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API}/clientes`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        nome: nomeInput.value,
        cpf_cnpj: cpf_cnpjInput.value.replace(/\D/g, "")
      })
    });

    form.reset();
    loadClientes();
  };

  const inputDoc = document.getElementById("cpf_cnpj");

  inputDoc.addEventListener("input", (e) => {
  e.target.value = formatCpfCnpj(e.target.value);
  });

  async function loadClientes() {
  try {
    const res = await fetch(`${API}/clientes`);
    const data = await res.json();

    const tbody = document.querySelector("#tabelaClientes tbody");
    tbody.innerHTML = "";

    data.forEach(c => {
      tbody.innerHTML += `
        <tr>
          <td>${c.id}</td>
          <td contenteditable onblur="editCliente(${c.id}, this.innerText, '${formatCpfCnpj(c.cpf_cnpj)}')">${c.nome}</td>
          <td contenteditable onblur="editCliente(${c.id}, '${c.nome}', this.innerText)">${formatCpfCnpj(c.cpf_cnpj)}</td>
          <td><button onclick="deleteCliente(${c.id})">Excluir</button></td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Erro ao carregar clientes:", err);
  }
}

  window.editCliente = async (id, nome, cpf_cnpj) => {
    await fetch(`${API}/clientes/${id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ nome, cpf_cnpj })
    });
  };

  window.deleteCliente = async (id) => {
  try {
    const res = await fetch(`${API}/clientes/${id}`, { method: "DELETE" });

    const text = await res.text();
    console.log(text);

    if (!res.ok) {
      console.error("Erro ao deletar");
      return;
    }

    loadClientes();

  } catch (err) {
    console.error("Erro ao deletar:", err);
  }
};

  loadClientes();
}

//PRODUTOS
if (document.getElementById("formProduto")) {

  const form = document.getElementById("formProduto");

  form.onsubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API}/produtos`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        nome: nomeProduto.value,
        preco: preco.value
      })
    });

    form.reset();
    loadProdutos();
  };

  async function loadProdutos() {
    const res = await fetch(`${API}/produtos`);
    const data = await res.json();

    const tbody = document.querySelector("#tabelaProdutos tbody");
    tbody.innerHTML = "";

    data.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td contenteditable onblur="editProduto(${p.id}, this.innerText, ${p.preco})">${p.nome}</td>
          <td contenteditable onblur="editProduto(${p.id}, '${p.nome}', this.innerText)"> R$ ${Number(p.preco).toFixed(2)}</td>
          <td><button onclick="deleteProduto(${p.id})">Excluir</button></td>
        </tr>
      `;
    });
  }

  window.editProduto = async (id, nome, preco) => {
    await fetch(`${API}/produtos/${id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ nome, preco })
    });
  };

  window.deleteProduto = async (id) => {
    await fetch(`${API}/produtos/${id}`, { method: "DELETE" });
    loadProdutos();
  };

  loadProdutos();
}

//VENDAS
if (document.getElementById("clienteSelect")) {

  let carrinho = [];

  async function loadVendas() {
    const clientes = await fetch(`${API}/clientes`).then(r=>r.json());
    const produtos = await fetch(`${API}/produtos`).then(r=>r.json());
    const vendas = await fetch(`${API}/vendas`).then(r=>r.json());

    clienteSelect.innerHTML = clientes.map(c=>`<option value="${c.id}">${c.nome}</option>`).join("");
    produtoSelect.innerHTML = produtos.map(p=>`<option value="${p.id}" data-preco="${p.preco}">${p.nome}</option>`).join("");

    const tbody = document.querySelector("#tabelaVendas tbody");

tbody.innerHTML = vendas.map(v => `
  <tr>
    <td>${v.id}</td>
    <td>${v.cliente}</td>
    <td>
      ${(v.itens || []).map(i => `${i.produto} (x${i.quantidade})`).join("<br>")}
    </td>
    <td>R$ ${Number(v.total).toFixed(2)}</td>
  </tr>
`).join("");
  }

  window.addItem = () => {
    const produto = produtoSelect.selectedOptions[0];
    const qtd = parseInt(quantidade.value);

    carrinho.push({
  produto_id: Number(produto.value),
  quantidade: Number(qtd)
});

    atualizarTotal();
  };

  function atualizarTotal() {
  let total = 0;

  carrinho.forEach(item => {
    const preco = Number(
      produtoSelect.querySelector(`option[value="${item.produto_id}"]`).dataset.preco
    );

    total += preco * item.quantidade;
  });

  document.getElementById("total").innerText = total.toFixed(2);
}

  


window.finalizarVenda = async () => {
   console.log({
  cliente_id: clienteSelect.value,
  itens: carrinho
});
    await fetch(`${API}/vendas`, {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        cliente_id: clienteSelect.value,
        itens: carrinho
      })
    });

    carrinho = [];
    atualizarTotal();
    loadVendas();
  };

  loadVendas();

  document.addEventListener("DOMContentLoaded", () => {
  loadClientes();
  loadProdutos();
  loadVendas();
});
}

function filtrarTabela(tabelaId) {
  const input = document.getElementById("searchInput");
  const filtro = input.value.toLowerCase();
  const linhas = document.querySelectorAll(`#${tabelaId} tbody tr`);

  linhas.forEach(linha => {
    const texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(filtro) ? "" : "none";
  });
}

document.addEventListener("input", () => {
  const tabela = document.querySelector("table");
  if (tabela) filtrarTabela(tabela.id);
});

function resetTable() {
  document.getElementById("searchInput").value = "";
  const linhas = document.querySelectorAll("tbody tr");
  linhas.forEach(l => l.style.display = "");
}

