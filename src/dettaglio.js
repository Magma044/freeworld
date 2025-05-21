document.addEventListener('DOMContentLoaded', () => {
    const raw = localStorage.getItem('dettagliStato');
    if (raw) {
        const data = JSON.parse(raw);
        const stato = new Stato(data.codiceISO, data.nome, data.indiceLiberta, data.indiceDemocrazia);
        document.getElementById('dettagliStato').innerHTML = stato.toHTML();
    } else {
        document.getElementById('dettagliStato').innerHTML = '<p class="text-danger">Nessun dato disponibile.</p>';
    }
});