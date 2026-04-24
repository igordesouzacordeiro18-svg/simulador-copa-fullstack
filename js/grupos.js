// Busca as 32 seleções da API
export async function buscarTimes() {
  const resposta = await fetch("https://development-internship-api.geopostenergy.com/WorldCup/GetAllTeams", {
    headers: {
      "git-user": "igordesouzacordeiro18-svg"
    }
  });

  const dados = await resposta.json();
  return dados;
}

// Embaralha os times de forma aleatória
function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Divide os times em 8 grupos (A até H)
export function gerarGrupos(times) {
  const grupos = {};
  const letras = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const timesEmbaralhados = embaralhar(times);

  let index = 0;

  // Distribui 4 times para cada grupo
  letras.forEach(letra => {
    grupos[letra] = timesEmbaralhados.slice(index, index + 4);
    index += 4;
  });

  return grupos;
}

// Renderiza os grupos na tela
export function mostrarGrupos(grupos) {
  const div = document.getElementById("grupos");
  div.innerHTML = "";

  for (let grupo in grupos) {
    let html = `
      <div class="card">
        <h3>Grupo ${grupo}</h3>
        <ul>
    `;

    grupos[grupo].forEach(time => {
      html += `<li>${time.nome}</li>`;
    });

    html += `</ul></div>`;

    div.innerHTML += html;
  }
}