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

const somFundo = new Audio("assets/sounds/whistle.mp3");
somFundo.loop = true;

const somCampeao = new Audio("assets/sounds/champion.mp3");

const somMataMata = new Audio("/assets/sounds/mata-mata.mp3");
somMataMata.loop = true;

let gruposGlobais = {};
let tabelaGlobal;
let resultadosOitavas;
let resultadosQuartas;
let resultadosSemi;
let resultadoFinal;
let faseAtual = 0;

async function iniciar() {
  console.log("INICIOU O JOGO");

   // COMEÇA O SOM
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

  // OITAVAS - aqui começa o mata-mata e a música nova
  if (faseAtual === 0) {

    // paro o som da fase de grupos
    somFundo.pause();
    somFundo.currentTime = 0;

    // começo o som do mata-mata (só uma vez)
    somMataMata.currentTime = 0;
    somMataMata.play().catch(err => console.log(err));

    const oitavas = gerarOitavas(tabelaGlobal);
    resultadosOitavas = simularMataMata(oitavas);

    mostrarTela("telaMataMata");
    document.getElementById("mataMata").innerHTML = "";

    mostrarFase("Oitavas de Final", resultadosOitavas);
  }

  // QUARTAS - só continua normalmente
  else if (faseAtual === 1) {

    const quartas = proximaFase(resultadosOitavas);
    resultadosQuartas = simularMataMata(quartas);

    mostrarFase("Quartas de Final", resultadosQuartas);
  }

  // SEMIFINAL - mesma coisa, segue o fluxo
  else if (faseAtual === 2) {

    const semi = proximaFase(resultadosQuartas);
    resultadosSemi = simularMataMata(semi);

    mostrarFase("Semifinal", resultadosSemi);
  }

  // FINAL - ainda fica no slide 3 (não mostra campeão ainda)
  else if (faseAtual === 3) {

    const final = proximaFase(resultadosSemi);
    resultadoFinal = simularMataMata(final);

    // mostro a final aqui mesmo
    mostrarFase("Final", resultadoFinal);
  }

  // CAMPEÃO - agora sim vai pro slide final
  else if (faseAtual === 4) {

    // paro o som do mata-mata
    somMataMata.pause();
    somMataMata.currentTime = 0;

    // começo o som do campeão
    somCampeao.currentTime = 0;
    somCampeao.play()
      .then(() => console.log("Som do campeão tocando!"))
      .catch(err => console.log("Erro ao tocar som:", err));

    const campeao = resultadoFinal[0].vencedor;

    // troco de tela
    mostrarTela("telaFinal");

    // mostro o campeão
    document.getElementById("campeao").innerHTML = `
      <div class="card campeao-card">
        <h1 style="font-size: 60px;">🏆 CAMPEÃO</h1>
        <h2 style="font-size:40px; color: gold;">${campeao.nome}</h2>
        <p style="font-size:18px;">Parabéns pela conquista!</p>
      </div>
    `;

    // solto os confetes
    criarConfete();
  }

  faseAtual++;
  atualizarBotao();
}

function mostrarTela(id) {
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

// Torna a função acessível no HTML
window.iniciar = iniciar;
window.avancarFase = avancarFase;

