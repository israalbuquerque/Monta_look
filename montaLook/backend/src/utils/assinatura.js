const DURACAO_PLANOS = {
  1: 15,
  2: 30,
  3: 60,
};

export function obterDuracaoPlano(idPlano) {
  return DURACAO_PLANOS[Number(idPlano)] || null;
}

export function calcularFimVigencia(idPlano, inicio = new Date()) {
  const duracao = obterDuracaoPlano(idPlano);
  if (!duracao) return null;

  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + duracao);
  return fim;
}
