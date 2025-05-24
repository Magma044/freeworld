// Classe principale per gestire la mappa mondiale della libertà
class FreedomMapManager {
    constructor() {
        // Inizializza il grafico e i dati a null
        this.chart = null;
        this.data = null;
        // Avvia l'inizializzazione della classe
        this.init();
    }

    // Metodo di inizializzazione principale
    init() {
        this.loadGoogleCharts();
    }

    // Carica la libreria Google Charts e inizializza la mappa
    loadGoogleCharts() {
        google.charts.load('current', { packages: ['geochart'] });
        google.charts.setOnLoadCallback(() => this.drawMap());
    }

    // Prepara i dati per la visualizzazione sulla mappa
    prepareMapData() {
        // Inizializza la tabella dati con le intestazioni
        const dataTable = [['Country', 'Indice di libertà']];
        
        // Verifica che i dati globali delle nazioni siano disponibili
        if (!datiNazioni || !Array.isArray(datiNazioni)) {
            console.error('Dati delle nazioni non disponibili');
            return dataTable;
        }

        // Itera attraverso tutti i paesi e aggiunge i dati validi alla tabella
        datiNazioni.forEach(country => {
            if (country.Country && country.Total !== undefined) {
                dataTable.push([country.Country, country.Total]);
            }
        });

        return dataTable;
    }

    // Disegna la mappa mondiale con i dati di libertà
    drawMap() {
        try {
            // Prepara i dati per Google Charts
            const mapData = this.prepareMapData();
            this.data = google.visualization.arrayToDataTable(mapData);

            // Configurazione delle opzioni per la mappa mondiale
            const options = {
                colorAxis: { 
                    colors: ['#dc3545', '#fd7e14', '#28a745', '#155724'],
                    minValue: 0,
                    maxValue: 100
                },
                datalessRegionColor: '#d3d3d3',
                defaultColor: '#f8f9fa',
                backgroundColor: 'transparent',
                enableRegionInteractivity: true,
                region: 'world',
                legend: 'none',
                tooltip: {
                    textStyle: { fontSize: 12 },
                    showColorCode: false
                }
            };

            // Crea e disegna la mappa
            this.chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
            this.chart.draw(this.data, options);
            
            // Configura i listener per gli eventi
            this.setupEventListeners();
        } catch (error) {
            console.error('Errore durante il caricamento della mappa:', error);x   
            this.showError();
        }
    }

    // Configura i listener per gli eventi della mappa
    setupEventListeners() {
        // Listener per la selezione di un paese sulla mappa
        google.visualization.events.addListener(this.chart, 'select', () => {
            this.handleCountrySelection();
        });

        // Listener per quando la mappa è pronta
        google.visualization.events.addListener(this.chart, 'ready', () => {
            this.addMapInteractivity();
        });
    }

    // Gestisce la selezione di un paese sulla mappa
    handleCountrySelection() {
        const selection = this.chart.getSelection();
        if (!selection.length) return;

        // Estrae il nome del paese e l'indice dai dati selezionati
        const countryName = this.data.getValue(selection[0].row, 0);
        const countryIndex = this.data.getValue(selection[0].row, 1);
        
        // Verifica che i dati del paese siano validi
        if (!this.isValidCountryData(countryName, countryIndex)) {
            this.showCountryError(countryName);
            return;
        }

        // Naviga alla pagina di dettaglio del paese
        this.navigateToCountryPage(countryName, countryIndex);
    }

    // Verifica se i dati del paese sono validi e completi
    isValidCountryData(countryName, countryIndex) {
        return countryName && 
               countryIndex !== null && 
               countryIndex !== undefined &&
               codice && codice[countryName] &&
               nome && nome[countryName];
    }

    // Mostra un messaggio di errore per paesi con dati incompleti
    showCountryError(countryName) {
        const toast = this.createToast(
            'Dati non disponibili', 
            `I dati per ${countryName} non sono completamente disponibili.`,
            'warning'
        );
        toast.show();
    }

    // Naviga alla pagina di dettaglio del paese selezionato
    navigateToCountryPage(countryName, countryIndex) {
        // Costruisce i parametri URL per la pagina di dettaglio
        const params = new URLSearchParams({
            country_code: codice[countryName],
            country_name: nome[countryName],
            country_index: countryIndex,
            country_name_inglese: countryName
        });

        // Reindirizza alla pagina di dettaglio con i parametri
        window.location.href = `dettaglio.html?${params.toString()}`;
    }

    // Aggiunge interattività visiva alla mappa
    addMapInteractivity() {
        const mapElement = document.getElementById('regions_div');
        if (mapElement) {
            // Cambia il cursore per indicare che la mappa è cliccabile
            mapElement.style.cursor = 'pointer';
        }
    }

    // Mostra un messaggio di errore quando la mappa non può essere caricata
    showError() {
        const errorDiv = document.getElementById('regions_div');
        errorDiv.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <i class="bi bi-exclamation-triangle fs-1"></i>
                <h4 class="alert-heading">Errore di caricamento</h4>
                <p>Non è stato possibile caricare la mappa. Controlla la connessione internet e riprova.</p>
                <button class="btn btn-outline-danger" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise"></i> Ricarica
                </button>
            </div>
        `;
    }

    // Crea un toast notification per mostrare messaggi all'utente
    createToast(title, message, type = 'info') {
        const toastContainer = this.getOrCreateToastContainer();
        const toastId = 'toast-' + Date.now();
        
        // HTML per il toast con Bootstrap
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${title}</strong><br>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                            data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        // Aggiunge il toast al container e restituisce l'istanza Bootstrap
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        return new bootstrap.Toast(document.getElementById(toastId));
    }

    // Ottiene o crea il container per i toast notifications
    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            // Crea il container se non esiste
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(container);
        }
        return container;
    }
}

// Inizializza l'applicazione quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', () => {
    new FreedomMapManager();
});