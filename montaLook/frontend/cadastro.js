// Inicialização do Stripe com sua chave pública
const stripe = Stripe('pk_test_51U5vX3R6jglS1J6STtIScbCy3k9QFHoclHASDxYwP2JJyV7IUEMyDP4EDn97zQZycmKVcAAoTRSqJ5Wjc8TUaK2h007fghzlMI');
const elements = stripe.elements();

// Criação do elemento de cartão da Stripe
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': { color: '#aab7c4' }
    },
    invalid: { color: '#fa755a' }
  }
});

let cardMontado = false;
let bsModalPagamento = null;

document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DO DOM ---
  const campoPagamento = document.getElementById('pagamentos');
  const formulario = document.querySelector('form');
  const btnCopiarPix = document.getElementById('btn-copiar-pix');
  
  const selectPlanos = document.getElementById('planos');
  const modalPagamentoEl = document.getElementById('modalPagamento');
  
  if (modalPagamentoEl) {
    bsModalPagamento = new bootstrap.Modal(modalPagamentoEl);
  }

  // --- MAPEAMENTO DE PLANOS E VALORES ---
  const detalhesPlanos = {
    'Plano1-Plano Essencial': { nome: 'Plano Essencial', valor: '(R$ 4,99/mês)', valorCentavos: 499 },
    'Plano2-Plano Estilo Plus': { nome: 'Plano Estilo Plus', valor: '(R$ 9,99/mês)', valorCentavos: 999 },
    'Plano3-Plano Premium Closet': { nome: 'Plano Premium Closet', valor: '(R$ 19,99/mês)', valorCentavos: 1999 }
  };

  function atualizarExibicaoPlanoModal() {
    const planoSelecionado = selectPlanos?.value;
    const info = detalhesPlanos[planoSelecionado];
    
    const spanNome = document.getElementById('modal-nome-plano');
    const spanValor = document.getElementById('modal-valor-plano');

    if (info) {
      if (spanNome) spanNome.textContent = info.nome;
      if (spanValor) spanValor.textContent = info.valor;
    } else {
      if (spanNome) spanNome.textContent = 'Nenhum plano selecionado';
      if (spanValor) spanValor.textContent = '';
    }
  }

  // 1. Ler Parâmetro 'plano' da URL e Selecionar no Dropdown
  const urlParams = new URLSearchParams(window.location.search);
  const planoUrl = urlParams.get('plano');

  if (planoUrl && selectPlanos) {
    selectPlanos.value = planoUrl;
  }

  // --- ACIONAMENTO DO POPUP / MODAL CONFORME A FORMA DE PAGAMENTO ---
  if (campoPagamento) {
    campoPagamento.addEventListener('change', (e) => {
      const opcao = e.target.value;
      const planoSelecionado = selectPlanos?.value;

      if (!planoSelecionado) {
        alert('Por favor, selecione um plano primeiro.');
        campoPagamento.value = '';
        return;
      }

      atualizarExibicaoPlanoModal();

      const containerCartaoModal = document.getElementById('modal-container-cartao');
      const containerPixModal = document.getElementById('modal-container-pix');

      if (opcao === 'Cartão Crédito' || opcao === 'Cartão Débito') {
        if (containerCartaoModal) containerCartaoModal.style.display = 'block';
        if (containerPixModal) containerPixModal.style.display = 'none';

        // Monta o elemento do cartão dentro do modal na primeira exibição
        if (!cardMontado) {
          cardElement.mount('#card-element-modal');
          cardMontado = true;

          cardElement.on('change', (event) => {
            const cardErrors = document.getElementById('card-errors-modal');
            if (cardErrors) {
              cardErrors.textContent = event.error ? event.error.message : '';
            }
          });
        }

        if (bsModalPagamento) bsModalPagamento.show();

      } else if (opcao && opcao.toLowerCase() === 'pix') {
        if (containerCartaoModal) containerCartaoModal.style.display = 'none';
        if (containerPixModal) containerPixModal.style.display = 'block';

        if (bsModalPagamento) bsModalPagamento.show();
      }
    });
  }

  // --- BOTÃO COPIAR PIX ---
  if (btnCopiarPix) {
    btnCopiarPix.addEventListener('click', () => {
      const inputPix = document.getElementById('pix-copia-cola');
      if (inputPix && inputPix.value) {
        inputPix.select();
        navigator.clipboard.writeText(inputPix.value);
        alert('Chave Pix copiada com sucesso!');
      }
    });
  }

  // --- SUBMISSÃO DO FORMULÁRIO DE CADASTRO E PAGAMENTO ---
  if (formulario) {
    formulario.addEventListener('submit', async (event) => {
      event.preventDefault();

      const opcaoPagamento = campoPagamento?.value;
      const planoSelecionado = selectPlanos?.value;
      const btnEnviar = formulario.querySelector('button[type="submit"]');

      if (!planoSelecionado) {
        alert("Por favor, selecione um plano.");
        return;
      }

      if (!opcaoPagamento) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
      }

      const infoPlano = detalhesPlanos[planoSelecionado] || { valorCentavos: 499 };

      const nome = document.getElementById('nome')?.value;
      const cpf = document.getElementById('cpf')?.value;
      const email = document.getElementById('email')?.value;
      const senha = document.getElementById('senha')?.value;
      const confirmarSenha = document.getElementById('confirmarSenha')?.value;

      if (senha !== confirmarSenha) {
        alert("As senhas informadas não coincidem.");
        return;
      }

      if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Processando...';
      }

      try {
        let stripePaymentIntentId = null;

        // 1. PROCESSAR CARTÃO DE CRÉDITO/DÉBITO
        if (opcaoPagamento === 'Cartão Crédito' || opcaoPagamento === 'Cartão Débito') {
          const respostaIntent = await fetch('https://montalook-api.onrender.com/api/clientes/criar-pagamento-cartao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor: infoPlano.valorCentavos })
          });

          const dadosIntent = await respostaIntent.json();
          if (dadosIntent.error) {
            alert("Erro ao iniciar pagamento: " + dadosIntent.error);
            return;
          }

          const resultadoStripe = await stripe.confirmCardPayment(dadosIntent.clientSecret, {
            payment_method: { card: cardElement }
          });

          if (resultadoStripe.error) {
            const cardErrors = document.getElementById('card-errors-modal');
            if (cardErrors) cardErrors.textContent = resultadoStripe.error.message;
            if (bsModalPagamento) bsModalPagamento.show();
            return;
          } else if (resultadoStripe.paymentIntent && resultadoStripe.paymentIntent.status === 'succeeded') {
            stripePaymentIntentId = resultadoStripe.paymentIntent.id;
          }
        } 
        
        // 2. PROCESSAR PIX
        else if (opcaoPagamento && opcaoPagamento.toLowerCase() === 'pix') {
          const respostaIntent = await fetch('https://montalook-api.onrender.com/api/clientes/criar-pagamento-pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor: infoPlano.valorCentavos })
          });

          const dadosIntent = await respostaIntent.json();

          if (dadosIntent.error) {
            alert('Erro ao gerar o Pix: ' + dadosIntent.error);
            return;
          }

          const { paymentIntent, error } = await stripe.confirmPixPayment(
            dadosIntent.clientSecret,
            {
              payment_method: {
                billing_details: {
                  name: nome || 'Cliente MontaLook',
                  email: email || 'cliente@email.com',
                },
              },
            }
          );

          if (error) {
            alert('Erro no pagamento Pix: ' + error.message);
            return;
          }

          stripePaymentIntentId = paymentIntent.id;
          const pixData = paymentIntent.next_action?.pix_display_qr_code;

          if (pixData) {
            const qrCodeImg = document.getElementById('pix-qr-code');
            if (qrCodeImg) {
              qrCodeImg.src = pixData.image_url_png;
              qrCodeImg.style.display = 'block';
            }

            const copiaColaInput = document.getElementById('pix-copia-cola');
            if (copiaColaInput) copiaColaInput.value = pixData.data;

            const wrapperCopiaCola = document.getElementById('wrapper-copia-cola');
            if (wrapperCopiaCola) wrapperCopiaCola.style.display = 'flex';

            if (bsModalPagamento) bsModalPagamento.show();
          }
        }

        // 3. REGISTRAR O USUÁRIO E A ASSINATURA NO BANCO DE DADOS
        const respostaCadastro = await fetch('https://montalook-api.onrender.com/api/cadastro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome,
            cpf,
            email,
            senha,
            plano: planoSelecionado,
            formaPagamento: opcaoPagamento,
            paymentIntentId: stripePaymentIntentId
          })
        });

        const dadosCadastro = await respostaCadastro.json();

      // CÓDIGO NOVO (COM O SALVAMENTO NO LOCALSTORAGE):
if (respostaCadastro.ok) {
  // Salva os dados e o ID retornado do banco no navegador
  const usuarioParaSalvar = {
    id_usuario: dadosCadastro.id_usuario || dadosCadastro.id || (dadosCadastro.usuario && dadosCadastro.usuario.id_usuario),
    nome: nome,
    email: email
  };

  localStorage.setItem("usuario", JSON.stringify(usuarioParaSalvar));

  alert('🎉 Cadastro e pagamento realizados com sucesso!');

  // Redireciona diretamente para a tela inicial já logado
  window.location.href = '/montaLook/frontend/index.html';
} else {
  alert('Erro no cadastro: ' + (dadosCadastro.error || 'Não foi possível concluir o registro.'));
}

      } catch (err) {
        console.error("Erro detalhado no processamento:", err);
        alert("Erro detalhado: " + (err.message || JSON.stringify(err)));
      } finally {
        if (btnEnviar) {
          btnEnviar.disabled = false;
          btnEnviar.textContent = 'Enviar';
        }
      }
    });
  }
});
