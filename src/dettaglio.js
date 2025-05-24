// Classe principale per gestire i dettagli di un paese
class CountryDetailManager {
    constructor() {
        // Estrae i parametri dall'URL della pagina corrente
        this.urlParams = new URLSearchParams(window.location.search);
        // Inizializza i dati del paese a null
        this.countryData = null;
        // Inizializza il grafico a null
        this.chart = null;
        // Avvia l'inizializzazione della classe
        this.init();
    }

    // Metodo di inizializzazione principale
    init() {
        this.extractUrlParameters();
        this.setupEventListeners();
        this.loadCountryData();
        this.updatePageElements();
        this.loadGoogleCharts();
    }

    // Estrae e memorizza i parametri dall'URL
    extractUrlParameters() {
        this.countryCode = this.urlParams.get('country_code');
        this.countryName = this.urlParams.get('country_name');
        this.countryIndex = parseInt(this.urlParams.get('country_index'));
        this.countryNameEnglish = this.urlParams.get('country_name_inglese');

        // Se i parametri non sono validi, reindirizza alla home
        if (!this.isValidParameters()) {
            this.redirectToHome();
        }
    }

    // Verifica che tutti i parametri necessari siano presenti e validi
    isValidParameters() {
        return this.countryCode && 
               this.countryName && 
               !isNaN(this.countryIndex) && 
               this.countryNameEnglish;
    }

    // Reindirizza l'utente alla pagina principale
    redirectToHome() {
        window.location.href = 'index.html';
    }

    // Configura i listener per gli eventi
    setupEventListeners() {
        // Listener per il pulsante "Indietro"
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Listener per il pulsante "Indietro" del browser
        window.addEventListener('popstate', () => {
            window.location.href = 'index.html';
        });
    }

    // Carica i dati del paese dall'array globale datiNazioni
    loadCountryData() {
        // Verifica che i dati globali siano disponibili
        if (!datiNazioni || !Array.isArray(datiNazioni)) {
            console.error('Dati delle nazioni non disponibili');
            return;
        }

        // Cerca il paese nell'array basandosi sul nome inglese
        this.countryData = datiNazioni.find(country => 
            country.Country === this.countryNameEnglish
        );

        // Se i dati non sono trovati, mostra un errore
        if (!this.countryData) {
            console.error('Dati del paese non trovati:', this.countryNameEnglish);
            this.showDataError();
        }
    }

    // Aggiorna tutti gli elementi della pagina con i dati del paese
    updatePageElements() {
        this.updateBasicInfo();
        this.updateStatusBadge();
        this.updateScores();
        this.renderMetricsCards();
    }

    // Aggiorna le informazioni di base (nome, bandiera, icona)
    updateBasicInfo() {
        // Imposta l'icona della bandiera nel favicon
        document.getElementById('icona').href = 
            `https://flagsapi.com/${this.countryCode}/flat/16.png`;
        // Imposta il titolo della pagina
        document.getElementById('titolo').textContent = this.countryName;
        
        // Imposta il nome del paese nell'interfaccia
        document.getElementById('nome').textContent = this.countryName;
        // Imposta l'immagine della bandiera
        document.getElementById('bandiera').src = 
            `https://flagsapi.com/${this.countryCode}/flat/64.png`;
        document.getElementById('bandiera').alt = `Bandiera di ${this.countryName}`;
    }

    // Aggiorna il badge dello status di libertà
    updateStatusBadge() {
        const statusBadge = document.getElementById('statusBadge');
        const status = this.getCountryStatus();
        
        statusBadge.textContent = status.text;
        statusBadge.className = `status-badge ${status.class}`;
    }

    // Determina lo status del paese basandosi sui dati
    getCountryStatus() {
        if (!this.countryData) return { text: 'DATI NON DISPONIBILI', class: 'bg-secondary' };

        // Mappa degli status con i relativi testi e classi CSS
        const statusMap = {
            'NF': { text: 'NON LIBERO', class: 'bg-danger' },
            'PF': { text: 'PARZIALMENTE LIBERO', class: 'bg-warning' },
            'F': { text: 'LIBERO', class: 'bg-success' }
        };

        return statusMap[this.countryData.Status] || 
               { text: 'STATUS SCONOSCIUTO', class: 'bg-secondary' };
    }

    // Aggiorna i punteggi principali (totale, diritti politici, libertà civili)
    updateScores() {
        if (!this.countryData) return;

        // Aggiorna i valori numerici dei punteggi
        document.getElementById('totalScore').textContent = this.countryData.Total || '--';
        document.getElementById('politicalRights').textContent = this.countryData.PR || '--';
        document.getElementById('civilLiberties').textContent = this.countryData.CL || '--';

        // Aggiorna la barra di progresso
        const progressBar = document.getElementById('totalProgressBar');
        const percentage = (this.countryData.Total / 100) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.className = `progress-bar ${this.getProgressBarClass(this.countryData.Total)}`;
    }

    // Determina la classe CSS per la barra di progresso basandosi sul punteggio
    getProgressBarClass(score) {
        if (score >= 70) return 'bg-success';
        if (score >= 40) return 'bg-warning';
        return 'bg-danger';
    }

    // Renderizza le card delle metriche dettagliate
    renderMetricsCards() {
        const container = document.getElementById('metricsContainer');
        const metrics = this.getMetricsData();

        // Genera l'HTML per tutte le card delle metriche
        container.innerHTML = metrics.map(metric => 
            this.createMetricCard(metric)
        ).join('');
    }

    // Restituisce i dati delle metriche strutturati per la visualizzazione
    getMetricsData() {
        if (!this.countryData) return [];

        return [
            {
                title: 'Processo Elettorale',
                icon: 'bi-vote',
                score: this.countryData.A || 0,
                description: 'Libertà e correttezza delle elezioni'
            },
            {
                title: 'Pluralismo Politico',
                icon: 'bi-people',
                score: this.countryData.B || 0,
                description: 'Partecipazione politica e pluralismo'
            },
            {
                title: 'Funzionamento Governo',
                icon: 'bi-building',
                score: this.countryData.C || 0,
                description: 'Efficacia e trasparenza governativa'
            },
            {
                title: 'Libertà di Espressione',
                icon: 'bi-chat-quote',
                score: this.countryData.D || 0,
                description: 'Libertà di parola e religione'
            },
            {
                title: 'Diritti di Associazione',
                icon: 'bi-people-fill',
                score: this.countryData.E || 0,
                description: 'Libertà di riunione e associazione'
            },
            {
                title: 'Stato di Diritto',
                icon: 'bi-shield-check',
                score: this.countryData.F || 0,
                description: 'Indipendenza giudiziaria e rule of law'
            },
            {
                title: 'Autonomia Personale',
                icon: 'bi-person-check',
                score: this.countryData.G || 0,
                description: 'Diritti individuali e libertà personali'
            }
        ];
    }

    // Crea l'HTML per una singola card metrica
    createMetricCard(metric) {
        const scoreColor = this.getScoreColor(metric.score);
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card metric-card">
                    <div class="card-body text-center">
                        <div class="score-circle mx-auto mb-3" style="background-color: ${scoreColor}">
                            ${metric.score}
                        </div>
                        <h6 class="card-title">
                            <i class="${metric.icon}"></i> ${metric.title}
                        </h6>
                        <p class="card-text text-muted small">${metric.description}</p>
                        <div class="progress" style="height: 5px;">
                            <div class="progress-bar" 
                                 style="width: ${(metric.score / 16) * 100}%; background-color: ${scoreColor}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Determina il colore basandosi sul punteggio (scala 0-16)
    getScoreColor(score) {
        // Soglie adattate per scala 0-16
        if (score >= 11) return '#28a745';    // ~70% di 16
        if (score >= 6.4) return '#fd7e14';   // 40% di 16
        return '#dc3545';
    }

    // Carica la libreria Google Charts e inizializza la mappa
    loadGoogleCharts() {
        google.charts.load('current', { packages: ['geochart'] });
        google.charts.setOnLoadCallback(() => this.drawCountryMap());
    }

    // Disegna la mappa geografica del paese con Google Charts
    drawCountryMap() {
        if (!this.countryData) return;

        try {
            // Prepara i dati per la visualizzazione della mappa
            const data = google.visualization.arrayToDataTable([
                ['Country', 'Indice di libertà'],
                ['', 0],
                ['', 100],
                [this.countryNameEnglish, this.countryData.Total]
            ]);

            // Configurazione delle opzioni per la mappa
            const options = {
                colorAxis: { 
                    colors: ['#dc3545', '#fd7e14', '#28a745', '#155724'],
                    minValue: 0,
                    maxValue: 100
                },
                datalessRegionColor: '#e9ecef',
                defaultColor: '#f8f9fa',
                backgroundColor: 'transparent',
                enableRegionInteractivity: false,
                region: this.countryCode,
                legend: 'none',
                tooltip: {
                    textStyle: { fontSize: 12 }
                }
            };

            // Crea e disegna la mappa
            this.chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
            this.chart.draw(data, options);
        } catch (error) {
            console.error('Errore durante il caricamento della mappa del paese:', error);
            this.showMapError();
        }
    }

    // Mostra un messaggio di errore quando la mappa non può essere caricata
    showMapError() {
        const mapDiv = document.getElementById('regions_div');
        mapDiv.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                <i class="bi bi-geo-alt fs-2"></i>
                <h5 class="mt-2">Mappa non disponibile</h5>
                <p class="mb-0">La visualizzazione geografica per questo paese non è al momento disponibile.</p>
            </div>
        `;
    }

    // Mostra un messaggio di errore quando i dati del paese non sono disponibili
    showDataError() {
        const container = document.querySelector('.container');
        const errorAlert = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle"></i>
                <strong>Errore!</strong> I dati per questo paese non sono disponibili.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        container.insertAdjacentHTML('afterbegin', errorAlert);
    }
}

// Classe per la validazione dei dati
class DataValidator {
    // Verifica se un punteggio è valido (tra 0 e 16)
    static isValidScore(score) {
        return score !== null && score !== undefined && score >= 0 && score <= 16;
    }

    // Formatta un punteggio per la visualizzazione
    static formatScore(score) {
        return DataValidator.isValidScore(score) ? score.toString() : 'N/A';
    }

    // Determina la categoria di un punteggio (libero, parzialmente libero, non libero)
    static getScoreCategory(score) {
        if (!DataValidator.isValidScore(score)) return 'unknown';
        if (score >= 11) return 'free';
        if (score >= 6.4) return 'partially-free';
        return 'not-free';
    }
}

// Inizializza il gestore dei dettagli del paese quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', () => {
    new CountryDetailManager();
});