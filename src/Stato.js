class Stato {
  constructor(nomeIT, nomeEN, sigla, indiceLiberta, datiLiberta) {
    this.nomeIT = nomeIT;
    this.nomeEN = nomeEN;
    this.sigla = sigla;
    this.indiceLiberta = indiceLiberta;
    this.datiLiberta = datiLiberta
  }

  toHTML() {
    return `
          <h2 class="mb-4">${this.nomeIT}</h2>
          <ul class="list-group">
            <li class="list-group-item"><strong>Codice ISO:</strong> ${this.sigla}</li>
            <li class="list-group-item"><strong>Indice di Libertà:</strong> ${this.indiceLiberta}</li>
          </ul>
        `;
  }
}