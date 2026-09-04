import pool from "../database/database.js";

const CONTEUDO_PADRAO = {
  hero: [
    {
      titulo: "Moda",
      video: "videos/video_moda_3.mp4",
      descricao: "Cena de moda com estética minimalista.",
    },
    {
      titulo: "Maquiagem",
      video: "videos/video_maquiagem_3.mp4",
      descricao: "Maquiagem sofisticada e acabamento impecável.",
    },
    {
      titulo: "Planos",
      video: "videos/video_planos_3.mp4",
      descricao: "Planos detalhados com estética contemporânea.",
    },
  ],
  destaques: [
    {
      titulo: "Famosos",
      imagem: "imagens/anitta_6.jpg",
      alt: "Anitta",
      link: "/celebridades",
    },
    {
      titulo: "Maquiagem",
      imagem: "imagens/noite_2.png",
      alt: "Maquiagem",
      link: "/maquiagem",
    },
    {
      titulo: "Tendências de Cores",
      imagem: "imagens/moda_cores.jpg",
      alt: "Tendências de cores",
      link: "/cores1",
    },
  ],
  introducao: {
    titulo: "Conteúdos explorando a moda.",
    texto:
      "A moda vai muito além das roupas — ela é expressão, atitude e descoberta. Aqui, você encontra conteúdos pensados para inspirar seu estilo, acompanhar tendências e explorar novas possibilidades dentro do seu próprio guarda-roupa.",
  },
  sobre: {
    titulo: "Sobre Nós",
    imagem: "imagens/arara.jpg",
    texto:
      "Bem-vindos à sua nova curadoria de estilo. Somos seu novo ponto de encontro digital para tudo o que envolve o universo da moda.",
  },
  planos: [
    {
      nome: "Plano Essencial",
      descricao: "Para quem quer começar a explorar seu estilo.",
      beneficios:
        "Looks em alta semanalmente\nCancelamento a qualquer momento\nArmazenamento de looks por 15 dias",
    },
    {
      nome: "Plano Estilo Plus",
      descricao: "Mais personalização e combinações exclusivas.",
      beneficios:
        "Tudo do plano essencial\nUpload de itens para sugestão personalizada\nArmazenamento de looks por 30 dias",
    },
    {
      nome: "Plano Premium Closet",
      descricao: "O assistente de moda completo e personalizado.",
      beneficios:
        "Recomendações de novas peças e acessórios\nArmazenamento de looks por 60 dias",
    },
  ],
  ia: {
    titulo: "Já conhece a nossa IA?",
    subtitulo: "Cansado de olhar para o guarda-roupa e não saber o que vestir?",
    texto:
      "É só preencher nosso Formulário de Estilo detalhado e nós te entregamos recomendações de combinações sob medida para você.",
    video: "videos/Projeto de Vídeo 1.mp4",
  },
  rodape: {
    descricao: "A moda que respeita sua história e valoriza suas raízes.",
    email: "montalooks@gmail.com",
  },
};

function mesclarPadrao(valor) {
  return valor ? { ...CONTEUDO_PADRAO, ...valor } : CONTEUDO_PADRAO;
}

class ConteudoHomeController {
  async obter(req, res) {
    try {
      const [rows] = await pool.query(
        "SELECT conteudo FROM conteudo_home WHERE id = 1 LIMIT 1",
      );
      const valorBanco = rows.length ? rows[0].conteudo : null;
      const conteudo =
        typeof valorBanco === "string" ? JSON.parse(valorBanco) : valorBanco;
      return res.json(mesclarPadrao(conteudo));
    } catch (error) {
      console.error("Erro ao buscar conteúdo da home:", error);
      return res
        .status(500)
        .json({ error: "Não foi possível carregar o conteúdo." });
    }
  }

  async salvar(req, res) {
    try {
      const conteudo = req.body;
      if (!conteudo || typeof conteudo !== "object") {
        return res
          .status(400)
          .json({ error: "Envie um objeto de conteúdo válido." });
      }

      await pool.query(
        `INSERT INTO conteudo_home (id, conteudo, atualizado_por)
                 VALUES (1, ?, ?)
                 ON DUPLICATE KEY UPDATE conteudo = VALUES(conteudo), atualizado_por = VALUES(atualizado_por)`,
        [
          JSON.stringify(mesclarPadrao(conteudo)),
          req.usuario.id_usuario || null,
        ],
      );

      return res.json({ message: "Conteúdo da home atualizado com sucesso." });
    } catch (error) {
      console.error("Erro ao salvar conteúdo da home:", error);
      return res
        .status(500)
        .json({ error: "Não foi possível salvar o conteúdo." });
    }
  }
}

export { CONTEUDO_PADRAO };
export default new ConteudoHomeController();
