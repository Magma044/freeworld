# Mappa Interattiva della Libertà e Democrazia nel Mondo

Questo progetto consiste in una web app che visualizza una mappa interattiva del mondo, permettendo all'utente di cliccare su uno stato per accedere a informazioni dettagliate riguardo alla sua situazione democratica e al livello di libertà. Il progetto è sviluppato interamente con HTML, CSS (Bootstrap) e JavaScript vanilla.

## Struttura del Progetto

- **index.html**: Pagina principale che mostra la mappa interattiva.
- **dettaglio.html**: Pagina di dettaglio con le informazioni specifiche sul paese selezionato.
- **/data/**:
  - `countryCodes.js`: Codici ISO dei paesi utilizzati per collegare i dati.
  - `countryData.js`: Dataset principale con i dati su democrazia e libertà.
  - `countryNames.js`: Nomi estesi dei paesi per la leggibilità.
- **/src/**:
  - `main.js`: Script per la gestione della mappa e dell'interazione utente sulla homepage.
  - `dettaglio.js`: Script per il rendering dinamico della pagina di dettaglio.

## Funzionalità

- Visualizzazione interattiva della mappa tramite Google Charts.
- Cliccando su un paese, si accede a una pagina con informazioni dettagliate.
- I dati vengono gestiti in formato JSON esportato da uno script Python (non incluso in questa versione).
- Utilizzo di Bootstrap per il layout responsive.

## Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3, Bootstrap, JavaScript Vanilla
- **Librerie esterne**: Google Charts
- **Dataset**: Derivato da fonti internazionali tramite elaborazione in Python

## Come Usare il Progetto

1. Clona o scarica il repository.
2. Apri `index.html` in un browser moderno.
3. Clicca su un qualsiasi paese nella mappa per visualizzare i dettagli.

## Screenshot

*(Puoi inserire qui un'immagine della mappa o della pagina di dettaglio)*

## Autore

Pietro – Studente di informatica presso ITIS, appassionato di tecnologia e sicurezza informatica.

---

