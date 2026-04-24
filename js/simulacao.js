import { simularJogo } from "./jogos.js";

// Simula todos os jogos da fase de grupos (todos contra todos)
export function simularFaseDeGrupos(grupos) {
  const resultados = [];

  for (let grupo in grupos) {
    let times = grupos[grupo];

    // Gera confrontos dentro do grupo
    for (let i = 0; i < times.length; i++) {
      for (let j = i + 1; j < times.length; j++) {

        const jogo = simularJogo(times[i], times[j]);

        resultados.push({
          grupo,
          ...jogo
        });
      }
    }
  }

  return resultados;
}

export function calcularTabela(grupos, resultados) {
  const tabela = {};

  // Inicializa estrutura da tabela por grupo
  for (let grupo in grupos) {
    tabela[grupo] = grupos[grupo].map(time => ({
      nome: time.nome,
      pontos: 0,
      golsPro: 0,
      golsContra: 0,
      saldo: 0
    }));
  }

  // Atualiza estatísticas com base nos jogos
  resultados.forEach(jogo => {
    const grupo = jogo.grupo;

    const timeA = tabela[grupo].find(t => t.nome === jogo.timeA.nome);
    const timeB = tabela[grupo].find(t => t.nome === jogo.timeB.nome);

    timeA.golsPro += jogo.golsA;
    timeA.golsContra += jogo.golsB;

    timeB.golsPro += jogo.golsB;
    timeB.golsContra += jogo.golsA;

    // Define pontuação
    if (jogo.golsA > jogo.golsB) {
      timeA.pontos += 3;
    } else if (jogo.golsA < jogo.golsB) {
      timeB.pontos += 3;
    } else {
      timeA.pontos += 1;
      timeB.pontos += 1;
    }
  });

  // Calcula saldo e ordena classificação
  for (let grupo in tabela) {
    tabela[grupo].forEach(time => {
      time.saldo = time.golsPro - time.golsContra;
    });

    // Critérios de desempate
    tabela[grupo].sort((a, b) =>
      b.pontos - a.pontos ||
      b.saldo - a.saldo ||
      b.golsPro - a.golsPro ||
      Math.random() - 0.5
    );
  }

  return tabela;
}

export function gerarOitavas(tabela) {
  // Cruzamento padrão da fase de oitavas
  return [
    { timeA: tabela["A"][0], timeB: tabela["B"][1] },
    { timeA: tabela["B"][0], timeB: tabela["A"][1] },

    { timeA: tabela["C"][0], timeB: tabela["D"][1] },
    { timeA: tabela["D"][0], timeB: tabela["C"][1] },

    { timeA: tabela["E"][0], timeB: tabela["F"][1] },
    { timeA: tabela["F"][0], timeB: tabela["E"][1] },

    { timeA: tabela["G"][0], timeB: tabela["H"][1] },
    { timeA: tabela["H"][0], timeB: tabela["G"][1] },
  ];
}

export function simularMataMata(confrontos) {
  return confrontos.map(jogo => {
    let golsA = Math.floor(Math.random() * 5);
    let golsB = Math.floor(Math.random() * 5);

    let penaltisA = 0;
    let penaltisB = 0;
    let vencedor;

    // Caso de empate: decisão por pênaltis
    if (golsA === golsB) {

      penaltisA = Math.floor(Math.random() * 5);
      penaltisB = Math.floor(Math.random() * 5);

      // garante vencedor nos pênaltis
      while (penaltisA === penaltisB) {
        penaltisB = Math.floor(Math.random() * 5);
      }

      vencedor = penaltisA > penaltisB ? jogo.timeA : jogo.timeB;

    } else {
      vencedor = golsA > golsB ? jogo.timeA : jogo.timeB;
    }

    return {
      ...jogo,
      golsA,
      golsB,
      penaltisA,
      penaltisB,
      vencedor
    };
  });
}

export function proximaFase(jogos) {
  // Extrai os vencedores da fase atual
  const classificados = jogos.map(jogo => jogo.vencedor);

  const confrontos = [];

  // Monta novos confrontos em pares
  for (let i = 0; i < classificados.length; i += 2) {
    confrontos.push({
      timeA: classificados[i],
      timeB: classificados[i + 1]
    });
  }

  return confrontos;
}