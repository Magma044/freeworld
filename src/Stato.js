class Stato {
  constructor(codiceISO, nome, indiceLiberta, indiceDemocrazia) {
    this.codiceISO = codiceISO;
    this.nome = nome;
    this.indiceLiberta = indiceLiberta;
    this.indiceDemocrazia = indiceDemocrazia;
  }

  toHTML() {
    return `
          <h2 class="mb-4">${this.nome}</h2>
          <ul class="list-group">
            <li class="list-group-item"><strong>Codice ISO:</strong> ${this.codiceISO}</li>
            <li class="list-group-item"><strong>Indice di Libertà:</strong> ${this.indiceLiberta}</li>
            <li class="list-group-item"><strong>Indice di Democrazia:</strong> ${this.indiceDemocrazia}</li>
          </ul>
        `;
  }
}