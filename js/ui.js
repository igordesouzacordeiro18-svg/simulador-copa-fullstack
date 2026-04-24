export function mostrarJogos(resultados) {
  const div = document.getElementById("jogos");
  div.innerHTML = "";

  resultados.forEach(jogo => {
    div.innerHTML += `
      <p>
        ${jogo.timeA.nome} ${jogo.golsA} x ${jogo.golsB} ${jogo.timeB.nome}
      </p>
    `;
  });
}

export function mostrarTabela(tabela) {
  const div = document.getElementById("tabela");
  div.innerHTML = "";

  for (let grupo in tabela) {
    div.innerHTML += `
      <div class="card">
        <h3>Grupo ${grupo}</h3>

        ${tabela[grupo].map(time => `
          <p>
            ${time.nome} - ${time.pontos} ${time.pontos === 1 ? "pt" : "pts"} 
            | GP: ${time.golsPro} 
            | GC: ${time.golsContra} 
            | SG: ${time.saldo}
          </p>
        `).join("")}

      </div>
    `;
  }
}

export function mostrarFase(nomeFase, jogos) {
  const div = document.getElementById("mataMata");

  div.innerHTML += `
    <div class="card">
      <h3>${nomeFase}</h3>

      ${jogos.map(jogo => {

        // se teve empate → mostra pênaltis
        if (jogo.golsA === jogo.golsB) {
          return `
            <p>
              ⚽ ${jogo.timeA.nome} 
              <strong>${jogo.golsA} x ${jogo.golsB}</strong> 
              ${jogo.timeB.nome}
              <br>
              🥅 Pênaltis: <strong>${jogo.penaltisA} x ${jogo.penaltisB}</strong>
            </p>
          `;
        }

        // jogo normal
        return `
          <p>
            ⚽ ${jogo.timeA.nome} 
            <strong>${jogo.golsA} x ${jogo.golsB}</strong> 
            ${jogo.timeB.nome}
          </p>
        `;

      }).join("")}

    </div>
  `;
}