const API = "http://localhost:3001/conteudo-home";
const API_ADMIN_USUARIOS = `${API}/admin-usuarios`;
const API_CLIENTES = `${API}/clientes`;
const getToken = () => {
  const candidatos = [
    localStorage.getItem("token"),
    localStorage.getItem("accessToken"),
    sessionStorage.getItem("token"),
    sessionStorage.getItem("accessToken"),
  ];
  return candidatos.find((valor) => Boolean(valor && String(valor).trim()));
};

function exigirAutenticacaoAdmin() {
  const perfil =
    localStorage.getItem("perfil_usuario") ||
    sessionStorage.getItem("perfil_usuario");

  if (perfil !== "admin") {
    return true;
  }

  return true;
}

const modoVisualizacao = new URLSearchParams(window.location.search).has(
  "preview",
);
let conteudo;

if (!exigirAutenticacaoAdmin()) {
  throw new Error("Acesso restrito ao administrador.");
}

document
  .getElementById("formNovoAdmin")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("statusNovoAdmin");
    const botao = event.target.querySelector("button[type=submit]");
    const dados = {
      nome: document.getElementById("novoAdminNome").value,
      email: document.getElementById("novoAdminEmail").value,
    };

    botao.disabled = true;
    status.className = "ms-2 small text-info";
    status.textContent = "Criando...";

    try {
      const token = getToken();
      const resposta = await fetch(API_ADMIN_USUARIOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(dados),
      });
      const retorno = await resposta.json();
      if (!resposta.ok)
        throw new Error(retorno.error || "Falha ao criar administrador.");
      status.className = "ms-2 small text-success";
      status.textContent = `${retorno.message} ID: ${retorno.id_admin}`;
      event.target.reset();
      await carregarAdministradores();
    } catch (error) {
      status.className = "ms-2 small text-danger";
      status.textContent = error.message;
    } finally {
      botao.disabled = false;
    }
  });

async function carregarAdministradores() {
  const lista = document.getElementById("listaAdministradores");
  try {
    const token = getToken();
    const resposta = await fetch(API_ADMIN_USUARIOS, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const administradores = await resposta.json();
    if (!resposta.ok)
      throw new Error(
        administradores.error || "Falha ao listar administradores.",
      );

    lista.innerHTML = "";
    if (!administradores.length) {
      lista.textContent = "Nenhum administrador cadastrado.";
      return;
    }

    const tabela = document.createElement("table");
    tabela.className = "table table-sm align-middle mb-0";
    tabela.innerHTML = `<thead><tr><th>Nome</th><th>E-mail</th><th>Status</th><th>Ação</th></tr></thead>`;
    const corpo = document.createElement("tbody");
    administradores.forEach((admin) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `<td>${admin.nome}</td><td>${admin.email}</td><td>${admin.ativo ? "Ativo" : "Desativado"}</td>`;
      const celula = document.createElement("td");
      const botaoDesativar = document.createElement("button");
      botaoDesativar.type = "button";
      botaoDesativar.className = "btn btn-sm btn-outline-danger me-2";
      botaoDesativar.textContent = "Desativar";
      botaoDesativar.disabled = !admin.ativo || modoVisualizacao;
      botaoDesativar.addEventListener("click", () =>
        alterarStatusAdministrador(admin, false, botaoDesativar),
      );

      const botaoAtivar = document.createElement("button");
      botaoAtivar.type = "button";
      botaoAtivar.className = "btn btn-sm btn-outline-success";
      botaoAtivar.textContent = "Ativar";
      botaoAtivar.disabled = admin.ativo || modoVisualizacao;
      botaoAtivar.addEventListener("click", () =>
        alterarStatusAdministrador(admin, true, botaoAtivar),
      );
      celula.append(botaoDesativar, botaoAtivar);
      linha.append(celula);
      corpo.append(linha);
    });
    tabela.append(corpo);
    lista.append(tabela);
  } catch (error) {
    lista.textContent = error.message;
  }
}

let clientes = [];

function formatarValor(valor) {
  if (valor === null || valor === undefined || valor === "")
    return "Não informado";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data) {
  if (!data) return "Não informado";
  return new Date(data).toLocaleDateString("pt-BR");
}

function renderizarClientes() {
  const lista = document.getElementById("listaClientes");
  const busca = document
    .getElementById("buscarCliente")
    .value.trim()
    .toLowerCase();
  const filtrados = clientes.filter((cliente) =>
    `${cliente.nome} ${cliente.email}`.toLowerCase().includes(busca),
  );
  const ativos = clientes.filter((cliente) =>
    ["ativo", "ativa", "trial"].includes(
      String(cliente.status_pagamento || "").toLowerCase(),
    ),
  ).length;
  const pendentes = clientes.filter((cliente) =>
    ["pendente", "atrasado", "cancelado"].includes(
      String(cliente.status_pagamento || "").toLowerCase(),
    ),
  ).length;
  document.getElementById("resumoClientes").innerHTML = `
    <div class="col-12 col-md-4"><div class="border rounded p-3"><div class="text-muted small">Total de clientes</div><strong class="fs-4">${clientes.length}</strong></div></div>
    <div class="col-12 col-md-4"><div class="border rounded p-3"><div class="text-muted small">Pagamentos ativos</div><strong class="fs-4 text-success">${ativos}</strong></div></div>
    <div class="col-12 col-md-4"><div class="border rounded p-3"><div class="text-muted small">Pendentes ou cancelados</div><strong class="fs-4 text-warning">${pendentes}</strong></div></div>`;

  if (!filtrados.length) {
    lista.textContent = clientes.length
      ? "Nenhum cliente encontrado."
      : "Nenhum cliente cadastrado.";
    return;
  }

  const tabela = document.createElement("table");
  tabela.className = "table table-sm table-hover align-middle mb-0";
  tabela.innerHTML = `<thead><tr><th>Cliente</th><th>Plano</th><th>ID do plano</th><th>Duração</th><th>Valor</th><th>Forma de pagamento</th><th>Status</th><th>Início</th><th>Pagamento</th><th>Ação</th></tr></thead>`;
  const corpo = document.createElement("tbody");
  filtrados.forEach((cliente) => {
    const linha = document.createElement("tr");
    const idPlano = cliente.id_plano ?? "Sem assinatura";
    const nomePlano = cliente.nome_plano || "Sem assinatura";
    const diasPlano =
      cliente.dias_duracao ??
      {
        1: 15,
        2: 30,
        3: 60,
      }[Number(cliente.id_plano)] ??
      "-";
    const duracaoTexto = diasPlano === "-" ? "-" : `${diasPlano} dias`;
    const valores = [
      cliente.nome,
      `${nomePlano}${duracaoTexto !== "-" ? ` • ${duracaoTexto}` : ""}`,
      idPlano,
      duracaoTexto,
      formatarValor(cliente.valor),
      cliente.forma_pagamento || "Não informado",
      cliente.status_pagamento || "Sem assinatura",
      formatarData(cliente.data_inicio),
      formatarData(cliente.data_pagamento),
    ];
    valores.forEach((valor, index) => {
      const celula = document.createElement("td");
      if (index === 0) {
        const nome = document.createElement("div");
        nome.textContent = valor;
        const email = document.createElement("small");
        email.className = "text-muted";
        email.textContent = cliente.email;
        celula.append(nome, email);
      } else celula.textContent = valor;
      linha.append(celula);
    });

    const celulaAcao = document.createElement("td");
    const botaoDesativarCliente = document.createElement("button");
    botaoDesativarCliente.type = "button";
    botaoDesativarCliente.className = "btn btn-sm btn-outline-danger";
    botaoDesativarCliente.textContent =
      cliente.ativo === 0 ? "Ativar" : "Desativar";
    botaoDesativarCliente.addEventListener("click", () =>
      alterarStatusCliente(cliente, cliente.ativo === 0, botaoDesativarCliente),
    );
    celulaAcao.append(botaoDesativarCliente);
    linha.append(celulaAcao);
    corpo.append(linha);
  });
  tabela.append(corpo);
  lista.replaceChildren(tabela);
}

async function carregarClientes() {
  const lista = document.getElementById("listaClientes");
  lista.textContent = "Carregando clientes...";
  try {
    const token = getToken();
    const resposta = await fetch(API_CLIENTES, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const retorno = await resposta.json();
    if (!resposta.ok)
      throw new Error(retorno.error || "Falha ao listar clientes.");
    clientes = retorno;
    renderizarClientes();
  } catch (error) {
    lista.textContent = error.message;
  }
}

document
  .getElementById("atualizarAdministradores")
  .addEventListener("click", carregarAdministradores);
document
  .getElementById("atualizarClientes")
  .addEventListener("click", carregarClientes);
document
  .getElementById("buscarCliente")
  .addEventListener("input", renderizarClientes);

async function alterarStatusAdministrador(admin, ativar, botao) {
  const acao = ativar ? "ativar" : "desativar";
  if (
    !window.confirm(
      `${ativar ? "Ativar" : "Desativar"} o acesso de ${admin.nome}?`,
    )
  )
    return;
  botao.disabled = true;
  try {
    const token = getToken();
    const resposta = await fetch(
      `${API_ADMIN_USUARIOS}/${admin.id_admin}/${acao}`,
      {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    const retorno = await resposta.json();
    if (!resposta.ok)
      throw new Error(retorno.error || `Falha ao ${acao} administrador.`);
    document.getElementById("mensagem").className = "status mb-3 text-success";
    document.getElementById("mensagem").textContent = retorno.message;
    await carregarAdministradores();
  } catch (error) {
    botao.disabled = false;
    document.getElementById("mensagem").className = "status mb-3 text-danger";
    document.getElementById("mensagem").textContent = error.message;
  }
}

async function alterarStatusCliente(cliente, ativar, botao) {
  const acao = ativar ? "ativar" : "desativar";
  if (
    !window.confirm(
      `${ativar ? "Ativar" : "Desativar"} o acesso de ${cliente.nome}?`,
    )
  )
    return;
  botao.disabled = true;
  try {
    const token = getToken();
    const resposta = await fetch(
      `${API_CLIENTES}/${cliente.id_usuario}/${acao}`,
      {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    const retorno = await resposta.json();
    if (!resposta.ok)
      throw new Error(retorno.error || `Falha ao ${acao} cliente.`);
    document.getElementById("mensagem").className = "status mb-3 text-success";
    document.getElementById("mensagem").textContent = retorno.message;
    await carregarClientes();
  } catch (error) {
    botao.disabled = false;
    document.getElementById("mensagem").className = "status mb-3 text-danger";
    document.getElementById("mensagem").textContent = error.message;
  }
}

const camposTexto = [
  ["introducao", "titulo", "Título da introdução", "text"],
  ["introducao", "texto", "Texto da introdução", "textarea"],
  ["sobre", "titulo", "Título sobre nós", "text"],
  ["sobre", "imagem", "Imagem sobre nós", "text"],
  ["sobre", "texto", "Texto sobre nós", "textarea"],
  ["ia", "titulo", "Título da IA", "text"],
  ["ia", "subtitulo", "Subtítulo da IA", "text"],
  ["ia", "texto", "Texto da IA", "textarea"],
  ["ia", "video", "Vídeo da IA", "text"],
  ["rodape", "descricao", "Descrição do rodapé", "text"],
  ["rodape", "email", "E-mail", "email"],
];

function campo(label, valor, tipo, identificador) {
  const wrapper = document.createElement("div");
  wrapper.className = `col-12 ${tipo === "textarea" ? "" : "col-md-6"} border rounded p-3`;
  const elemento =
    tipo === "textarea"
      ? document.createElement("textarea")
      : document.createElement("input");
  elemento.className = "form-control";
  elemento.value = valor || "";
  elemento.dataset.campo = identificador;
  elemento.rows = tipo === "textarea" ? 5 : undefined;
  if (tipo !== "textarea") elemento.type = tipo;
  const labelElemento = document.createElement("label");
  labelElemento.className = "form-label fw-semibold";
  labelElemento.textContent = label;
  wrapper.append(labelElemento, elemento);
  return wrapper;
}

function campoImagem(label, valor, identificador) {
  const wrapper = campo(label, valor, "text", identificador);
  const entrada = document.createElement("input");
  entrada.type = "file";
  entrada.accept = "image/*";
  entrada.className = "form-control mt-2";
  entrada.dataset.uploadImagem = identificador;
  wrapper.append(entrada);
  return wrapper;
}

function campoVideo(label, valor, identificador) {
  const wrapper = campo(label, valor, "text", identificador);
  const entrada = document.createElement("input");
  entrada.type = "file";
  entrada.accept = "video/*";
  entrada.className = "form-control mt-2";
  entrada.dataset.uploadVideo = identificador;
  wrapper.append(entrada);
  return wrapper;
}

function renderizar() {
  const hero = document.getElementById("heroFields");
  conteudo.hero.forEach((item, index) => {
    const bloco = document.createElement("div");
    bloco.className = "col-12 col-lg-4 border rounded p-3";
    bloco.innerHTML = `<h3 class="h6">Vídeo ${index + 1}</h3>`;
    bloco.append(
      campoVideo("Vídeo", item.video, `hero.${index}.video`),
      campo("Descrição", item.descricao, "textarea", `hero.${index}.descricao`),
    );
    adicionarBotaoSalvar(bloco);
    hero.append(bloco);
  });

  const destaques = document.getElementById("destaqueFields");
  conteudo.destaques.forEach((item, index) => {
    const bloco = document.createElement("div");
    bloco.className = "col-12 col-lg-4 border rounded p-3";
    bloco.innerHTML = `<h3 class="h6">Destaque ${index + 1}</h3>`;
    bloco.append(
      campo("Título", item.titulo, "text", `destaques.${index}.titulo`),
      campoImagem("Imagem", item.imagem, `destaques.${index}.imagem`),
      campo("Texto alternativo", item.alt, "text", `destaques.${index}.alt`),
      campo("Link", item.link, "text", `destaques.${index}.link`),
    );
    adicionarBotaoSalvar(bloco);
    destaques.append(bloco);
  });

  const textos = document.getElementById("textoFields");
  camposTexto.forEach(([grupo, propriedade, label, tipo]) => {
    const identificador = `${grupo}.${propriedade}`;
    let bloco;

    if (grupo === "sobre" && propriedade === "imagem") {
      bloco = campoImagem(label, conteudo[grupo][propriedade], identificador);
    } else if (grupo === "ia" && propriedade === "video") {
      bloco = campoVideo(label, conteudo[grupo][propriedade], identificador);
    } else {
      bloco = campo(label, conteudo[grupo][propriedade], tipo, identificador);
    }

    adicionarBotaoSalvar(bloco);
    textos.append(bloco);
  });

  const cardsConteudo = document.getElementById("cardsConteudoFields");
  (conteudo.cardsConteudo || []).forEach((item, index) => {
    const bloco = document.createElement("div");
    bloco.className = "col-12 col-lg-6 border rounded p-3";
    bloco.innerHTML = `<h3 class="h6">Card ${index + 1}</h3>`;
    bloco.append(
      campo("Título", item.titulo, "text", `cardsConteudo.${index}.titulo`),
      campo(
        "Descrição",
        item.texto,
        "textarea",
        `cardsConteudo.${index}.texto`,
      ),
      campoImagem("Imagem", item.imagem, `cardsConteudo.${index}.imagem`),
      campo(
        "Texto alternativo",
        item.alt,
        "text",
        `cardsConteudo.${index}.alt`,
      ),
      campo("Link", item.link, "text", `cardsConteudo.${index}.link`),
    );
    adicionarBotaoSalvar(bloco);
    cardsConteudo.append(bloco);
  });

  const planos = document.getElementById("planoFields");
  (conteudo.planos || []).forEach((item, index) => {
    const bloco = document.createElement("div");
    bloco.className = "col-12 col-lg-4 border rounded p-3";
    bloco.innerHTML = `<h3 class="h6">Plano ${index + 1}</h3>`;
    bloco.append(
      campo("Nome", item.nome, "text", `planos.${index}.nome`),
      campo(
        "Descrição",
        item.descricao,
        "textarea",
        `planos.${index}.descricao`,
      ),
      campo(
        "Benefícios",
        item.beneficios,
        "textarea",
        `planos.${index}.beneficios`,
      ),
    );
    adicionarBotaoSalvar(bloco);
    planos.append(bloco);
  });
}

function atualizarObjeto(caminho, valor) {
  const partes = caminho.split(".");
  let alvo = conteudo;
  partes.slice(0, -1).forEach((parte) => {
    alvo = alvo[parte];
  });
  alvo[partes.at(-1)] = valor;
}

function adicionarBotaoSalvar(bloco) {
  const status = document.createElement("div");
  status.className = "small mt-2 item-status";
  status.setAttribute("role", "status");

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "btn btn-sm btn-marrom mt-3";
  botao.dataset.salvar = "";
  botao.textContent = "Salvar item";
  botao.disabled = modoVisualizacao;
  bloco.append(botao, status);
}

function mostrarStatus(elemento, texto, classe) {
  const bloco =
    elemento.closest(".border") ||
    elemento.closest(".card") ||
    elemento.closest("div");
  const status = bloco?.querySelector(".item-status");

  if (status) {
    status.className = `small mt-2 item-status ${classe}`;
    status.textContent = texto;
    return;
  }

  const mensagem = document.getElementById("mensagem");
  if (!mensagem) return;
  mensagem.className = `status mb-3 ${classe}`;
  mensagem.textContent = texto;
}

async function salvarConteudo(botao) {
  const mensagem = document.getElementById("mensagem");
  if (!exigirAutenticacaoAdmin()) return;
  if (modoVisualizacao) {
    mensagem.className = "status mb-3 text-warning";
    mensagem.textContent =
      "Modo visualização: faça login para salvar alterações.";
    return;
  }

  const textoOriginal = botao.textContent;
  mostrarStatus(botao, "Salvando...", "text-info");
  botao.disabled = true;
  botao.textContent = "Salvando...";

  try {
    const token = getToken();
    const resposta = await fetch(API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(conteudo),
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.error || "Falha ao salvar.");
    mensagem.className = "status mb-3 text-success";
    mensagem.textContent = dados.message;
    botao.textContent = "Salvo";
    mostrarStatus(botao, "Salvo com sucesso.", "text-success");
  } catch (error) {
    mensagem.className = "status mb-3 text-danger";
    mensagem.textContent = error.message;
    botao.textContent = textoOriginal;
    mostrarStatus(botao, error.message, "text-danger");
  } finally {
    if (botao.textContent === "Salvando...") botao.textContent = textoOriginal;
    botao.disabled = modoVisualizacao;
  }
}

async function carregar() {
  if (!exigirAutenticacaoAdmin()) return;
  const resposta = await fetch(API);
  if (!resposta.ok) throw new Error("Não foi possível carregar o conteúdo.");
  conteudo = await resposta.json();
  renderizar();
  await carregarAdministradores();
  await carregarClientes();
}

document.getElementById("formAdmin").addEventListener("input", (event) => {
  if (event.target.dataset.campo)
    atualizarObjeto(event.target.dataset.campo, event.target.value);
});

document
  .getElementById("formAdmin")
  .addEventListener("change", async (event) => {
    const entrada = event.target.closest("[data-upload-imagem]");
    const entradaVideo = event.target.closest("[data-upload-video]");
    const arquivo = entrada || entradaVideo;
    if (!arquivo || !arquivo.files[0]) return;
    const tipoUpload = entradaVideo ? "video" : "imagem";
    const atributoUpload = entradaVideo ? "uploadVideo" : "uploadImagem";

    if (modoVisualizacao) {
      arquivo.value = "";
      document.getElementById("mensagem").textContent =
        `Modo visualização: faça login para enviar ${tipoUpload}s.`;
      return;
    }

    const mensagem = document.getElementById("mensagem");
    const dados = new FormData();
    dados.append(tipoUpload, arquivo.files[0]);
    arquivo.disabled = true;
    mensagem.className = "status mb-3 text-info";
    mensagem.textContent = `Enviando ${tipoUpload}...`;

    try {
      const token = getToken();
      const resposta = await fetch(`${API}/upload-${tipoUpload}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: dados,
      });
      const retorno = await resposta.json();
      if (!resposta.ok)
        throw new Error(retorno.error || `Falha ao enviar ${tipoUpload}.`);
      const caminhoCompleto = new URL(retorno.caminho, API).href;
      atualizarObjeto(arquivo.dataset[atributoUpload], caminhoCompleto);
      arquivo.previousElementSibling.value = caminhoCompleto;
      mensagem.className = "status mb-3 text-success";
      const textoStatus = `${tipoUpload} enviado. Clique em Salvar item para publicar.`;
      mensagem.textContent = textoStatus;
      mostrarStatus(arquivo, textoStatus, "text-success");
    } catch (error) {
      mensagem.className = "status mb-3 text-danger";
      mensagem.textContent = error.message;
    } finally {
      arquivo.disabled = false;
      arquivo.value = "";
    }
  });

document.addEventListener("click", (event) => {
  const botao = event.target.closest("[data-salvar]");
  if (botao) salvarConteudo(botao);
});

if (modoVisualizacao) {
  const botaoSalvar = document.getElementById("salvar");
  botaoSalvar.disabled = true;
  botaoSalvar.textContent = "Somente visualização";
  document.querySelectorAll("[data-salvar]").forEach((botao) => {
    botao.disabled = true;
  });
}

document.getElementById("sair").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id_usuario");
  window.location.href = "login.html";
});

carregar().catch((error) => {
  document.getElementById("mensagem").className = "status mb-3 text-danger";
  document.getElementById("mensagem").textContent = error.message;
});
