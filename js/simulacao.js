import { simularJogo } from "./jogos.js";

// Simula todos os jogos da fase de grupos
export function simularFaseDeGrupos(grupos) {
  const resultados = [];

  // Percorre cada grupo (A até H)
  for (let grupo in grupos) {
    let times = grupos[grupo];

    // Todos contra todos dentro do grupo
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

  // cria a estrutura inicial da tabela
  for (let grupo in grupos) {
    tabela[grupo] = grupos[grupo].map(time => ({
      nome: time.nome,
      pontos: 0,
      golsPro: 0,
      golsContra: 0,
      saldo: 0
    }));
  }

  // passa por todos os jogos e soma os dados
  resultados.forEach(jogo => {
    const grupo = jogo.grupo;

    const timeA = tabela[grupo].find(t => t.nome === jogo.timeA.nome);
    const timeB = tabela[grupo].find(t => t.nome === jogo.timeB.nome);

    // soma gols
    timeA.golsPro += jogo.golsA;
    timeA.golsContra += jogo.golsB;

    timeB.golsPro += jogo.golsB;
    timeB.golsContra += jogo.golsA;

    // define pontuação
    if (jogo.golsA > jogo.golsB) {
      timeA.pontos += 3;
    } else if (jogo.golsA < jogo.golsB) {
      timeB.pontos += 3;
    } else {
      // empate
      timeA.pontos += 1;
      timeB.pontos += 1;
    }
  });

  // calcula saldo e ordena
  for (let grupo in tabela) {

    tabela[grupo].forEach(time => {
      time.saldo = time.golsPro - time.golsContra;
    });

    // ordena por:
    // 1. pontos
    // 2. saldo de gols
    // 3. gols pró
    // 4. sorteio (pra desempate total)
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

    // se empatar no tempo normal → vai pros pênaltis
    if (golsA === golsB) {

      penaltisA = Math.floor(Math.random() * 5);
      penaltisB = Math.floor(Math.random() * 5);

      // não pode empatar nos pênaltis
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
  const classificados = jogos.map(jogo => jogo.vencedor);

  const confrontos = [];

  for (let i = 0; i < classificados.length; i += 2) {
    confrontos.push({
      timeA: classificados[i],
      timeB: classificados[i + 1]
    });
  }

  return confrontos;
}