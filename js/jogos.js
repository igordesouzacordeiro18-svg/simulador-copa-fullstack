// Gera um número aleatório de gols (0 a 4)
export function gerarGols() {
  return Math.floor(Math.random() * 5);
}

// Simula uma partida entre dois times
export function simularJogo(timeA, timeB) {
  const golsA = gerarGols();
  const golsB = gerarGols();

  return {
    timeA,
    timeB,
    golsA,
    golsB
  };
}