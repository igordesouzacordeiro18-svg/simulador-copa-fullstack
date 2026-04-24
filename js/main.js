import { buscarTimes, gerarGrupos, mostrarGrupos } from "./grupos.js";

import {
  simularFaseDeGrupos,
  calcularTabela,
  gerarOitavas,
  simularMataMata,
  proximaFase
} from "./simulacao.js";

import {
  mostrarJogos,
  mostrarTabela,
  mostrarFase
} from "./ui.js";

// Sons do sistema
const somFundo = new Audio("assets/sounds/whistle.mp3");
somFundo.loop = true;

const somCampeao = new Audio("assets/sounds/champion.mp3");

const somMataMata = new Audio("/assets/sounds/mata-mata.mp3");
somMataMata.loop = true;

// Estado global da simulação
let gruposGlobais = {};
let tabelaGlobal;
let resultadosOitavas;
let resultadosQuartas;
let resultadosSemi;
let resultadoFinal;
let faseAtual = 0;

async function iniciar() {
  console.log("INICIOU O JOGO");

  // Inicia trilha sonora da fase de grupos
  somFundo.currentTime = 0;
  somFundo.play().catch(err => console.log(err));

  mostrarTela("telaGrupos");

  try {
    const times = await buscarTimes();

    gruposGlobais = gerarGrupos(times);
    mostrarGrupos(gruposGlobais);

    const resultados = simularFaseDeGrupos(gruposGlobais);
    mostrarJogos(resultados);

    tabelaGlobal = calcularTabela(gruposGlobais, resultados);
    mostrarTabela(tabelaGlobal);

    faseAtual = 0;
    atualizarBotao();

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

function avancarFase() {
  if (!tabelaGlobal) {
    alert("Os dados ainda não foram carregados 😢");
    return;
  }

  // Oitavas de final (início do mata-mata)
  if (faseAtual === 0) {

    somFundo.pause();
    somFundo.currentTime = 0;

    somMataMata.currentTime = 0;
    somMataMata.play().catch(err => console.log(err));

    const oitavas = gerarOitavas(tabelaGlobal);
    resultadosOitavas = simularMataMata(oitavas);

    mostrarTela("telaMataMata");
    document.getElementById("mataMata").innerHTML = "";

    mostrarFase("Oitavas de Final", resultadosOitavas);
  }

  // Quartas de final
  else if (faseAtual === 1) {
    const quartas = proximaFase(resultadosOitavas);
    resultadosQuartas = simularMataMata(quartas);

    mostrarFase("Quartas de Final", resultadosQuartas);
  }

  // Semifinal
  else if (faseAtual === 2) {
    const semi = proximaFase(resultadosQuartas);
    resultadosSemi = simularMataMata(semi);

    mostrarFase("Semifinal", resultadosSemi);
  }

  // Final
  else if (faseAtual === 3) {
    const final = proximaFase(resultadosSemi);
    resultadoFinal = simularMataMata(final);

    mostrarFase("Final", resultadoFinal);
  }

  // Encerramento + campeão
  else if (faseAtual === 4) {

    somMataMata.pause();
    somMataMata.currentTime = 0;

    somCampeao.currentTime = 0;
    somCampeao.play().catch(err => console.log(err));

    const final = resultadoFinal[0];
    const campeao = final.vencedor;

    // Envio do resultado final para API (requisito do desafio)
    fetch("https://development-internship-api.geopostenergy.com/WorldCup/FinalResult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "git-user": "igordesouzacordeiro18-svg"
      },
      body: JSON.stringify({
        teamA: final.timeA.nome,
        teamB: final.timeB.nome,
        scoreA: final.golsA,
        scoreB: final.golsB,
        penaltyScoreA: final.penaltisA || 0,
        penaltyScoreB: final.penaltisB || 0
      })
    });

    mostrarTela("telaFinal");

    document.getElementById("campeao").innerHTML = `
      <div class="card campeao-card">
        <h1 style="font-size: 60px;">🏆 CAMPEÃO</h1>
        <h2 style="font-size:40px; color: gold;">${campeao.nome}</h2>
        <p style="font-size:18px;">Parabéns pela conquista!</p>
      </div>
    `;

    criarConfete();
  }

  faseAtual++;
  atualizarBotao();
}

function mostrarTela(id) {
  // Controla navegação entre telas do sistema
  const telas = document.querySelectorAll(".tela");

  telas.forEach(tela => {
    tela.classList.remove("ativa");
  });

  const novaTela = document.getElementById(id);
  novaTela.classList.add("ativa");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function atualizarBotao() {
  const botoes = document.querySelectorAll(".botao-avancar");

  const textos = [
    "Ir para Oitavas ▶️",
    "Ir para Quartas ▶️",
    "Ir para Semifinal ▶️",
    "Ir para Final ▶️",
    "Ver Campeão 🏆"
  ];

  botoes.forEach(botao => {
    botao.innerText = textos[faseAtual] || "Fim";
  });
}

function criarConfete() {
  // Efeito visual de celebração do campeão
  for (let i = 0; i < 80; i++) {
    const confete = document.createElement("div");
    confete.classList.add("confete");

    confete.style.left = Math.random() * 100 + "vw";
    confete.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confete.style.animationDuration = (Math.random() * 2 + 2) + "s";

    document.body.appendChild(confete);

    setTimeout(() => confete.remove(), 3000);
  }
}

// Exposição das funções para o HTML
window.iniciar = iniciar;
window.avancarFase = avancarFase;

