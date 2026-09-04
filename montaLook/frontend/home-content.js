const HOME_API = "http://localhost:3001/conteudo-home";

function aplicarTexto(seletor, valor) {
  const elemento = document.querySelector(seletor);
  if (elemento && valor) elemento.textContent = valor;
}

function aplicarAtributo(seletor, atributo, valor) {
  const elemento = document.querySelector(seletor);
  if (elemento && valor) elemento.setAttribute(atributo, valor);
}

function aplicarBeneficios(seletor, valor) {
  const lista = document.querySelector(seletor);
  if (!lista || !valor) return;

  lista.replaceChildren(
    ...String(valor)
      .split(/\r?\n/)
      .map((beneficio) => beneficio.trim())
      .filter(Boolean)
      .map((beneficio) => {
        const item = document.createElement("li");
        item.textContent = beneficio;
        return item;
      }),
  );
}

function aplicarVideo(seletor, caminho) {
  const fonte = document.querySelector(seletor);
  if (!fonte || !caminho) return;

  const video = fonte.closest("video");
  if (fonte.getAttribute("src") === caminho) return;

  fonte.setAttribute("src", caminho);
  if (video) {
    video.load();
    video.play().catch(() => {});
  }
}

async function carregarConteudoHome() {
  try {
    const resposta = await fetch(HOME_API);
    if (!resposta.ok) return;
    const conteudo = await resposta.json();

    conteudo.hero?.forEach((item, index) => {
      aplicarVideo(`[data-home-video="${index}"]`, item.video);
    });
    conteudo.destaques?.forEach((item, index) => {
      aplicarTexto(`[data-home-destaque-titulo="${index}"]`, item.titulo);
      aplicarAtributo(
        `[data-home-destaque-imagem="${index}"]`,
        "src",
        item.imagem,
      );
      aplicarAtributo(
        `[data-home-destaque-imagem="${index}"]`,
        "alt",
        item.alt,
      );
    });
    conteudo.cardsConteudo?.forEach((item, index) => {
      aplicarTexto(`[data-home-card-titulo="${index}"]`, item.titulo);
      aplicarTexto(`[data-home-card-texto="${index}"]`, item.texto);
      aplicarAtributo(`[data-home-card-imagem="${index}"]`, "src", item.imagem);
      aplicarAtributo(`[data-home-card-imagem="${index}"]`, "alt", item.alt);
      aplicarAtributo(`[data-home-card-link="${index}"]`, "href", item.link);
    });
    aplicarTexto(
      '[data-home-texto="introducao-titulo"]',
      conteudo.introducao?.titulo,
    );
    aplicarTexto(
      '[data-home-texto="introducao-texto"]',
      conteudo.introducao?.texto,
    );
    aplicarTexto('[data-home-texto="sobre-titulo"]', conteudo.sobre?.titulo);
    aplicarTexto('[data-home-texto="sobre-texto"]', conteudo.sobre?.texto);
    aplicarAtributo("[data-home-sobre-imagem]", "src", conteudo.sobre?.imagem);
    aplicarTexto('[data-home-texto="ia-titulo"]', conteudo.ia?.titulo);
    aplicarTexto('[data-home-texto="ia-subtitulo"]', conteudo.ia?.subtitulo);
    aplicarTexto('[data-home-texto="ia-texto"]', conteudo.ia?.texto);
    aplicarVideo("[data-home-ia-video]", conteudo.ia?.video);
    aplicarTexto(
      '[data-home-texto="rodape-descricao"]',
      conteudo.rodape?.descricao,
    );
    aplicarTexto('[data-home-texto="rodape-email"]', conteudo.rodape?.email);
    conteudo.planos?.forEach((item, index) => {
      aplicarTexto(`[data-home-plano-nome="${index}"]`, item.nome);
      aplicarTexto(`[data-home-plano-descricao="${index}"]`, item.descricao);
      aplicarBeneficios(
        `[data-home-plano-beneficios="${index}"]`,
        item.beneficios,
      );
    });
  } catch (error) {
    console.warn(
      "Conteúdo dinâmico indisponível; mantendo conteúdo original.",
      error,
    );
  }
}

carregarConteudoHome();
