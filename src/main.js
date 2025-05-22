class FreedomMapManager {
    constructor() {
        this.chart = null;
        this.data = null;
        this.init();
    }

    init() {
        this.loadGoogleCharts();
    }

    loadGoogleCharts() {
        google.charts.load('current', { packages: ['geochart'] });
        google.charts.setOnLoadCallback(() => this.drawMap());
    }

    prepareMapData() {
        const dataTable = [['Country', 'Indice di libertà']];
        
        if (!datiNazioni || !Array.isArray(datiNazioni)) {
            console.error('Dati delle nazioni non disponibili');
            return dataTable;
        }

        datiNazioni.forEach(country => {
            if (country.Country && country.Total !== undefined) {
                dataTable.push([country.Country, country.Total]);
            }
        });

        return dataTable;
    }

    drawMap() {
        try {
            const mapData = this.prepareMapData();
            this.data = google.visualization.arrayToDataTable(mapData);

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

            this.chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
            this.chart.draw(this.data, options);
            
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Errore durante il caricamento della mappa:', error);
            this.hideLoading();
            this.showError();
        }
    }

    setupEventListeners() {
        google.visualization.events.addListener(this.chart, 'select', () => {
            this.handleCountrySelection();
        });

        google.visualization.events.addListener(this.chart, 'ready', () => {
            this.addMapInteractivity();
        });
    }

    handleCountrySelection() {
        const selection = this.chart.getSelection();
        if (!selection.length) return;

        const countryName = this.data.getValue(selection[0].row, 0);
        const countryIndex = this.data.getValue(selection[0].row, 1);
        
        if (!this.isValidCountryData(countryName, countryIndex)) {
            this.showCountryError(countryName);
            return;
        }

        this.navigateToCountryPage(countryName, countryIndex);
    }

    isValidCountryData(countryName, countryIndex) {
        return countryName && 
               countryIndex !== null && 
               countryIndex !== undefined &&
               codice && codice[countryName] &&
               nome && nome[countryName];
    }

    showCountryError(countryName) {
        const toast = this.createToast(
            'Dati non disponibili', 
            `I dati per ${countryName} non sono completamente disponibili.`,
            'warning'
        );
        toast.show();
    }

    navigateToCountryPage(countryName, countryIndex) {
        const params = new URLSearchParams({
            country_code: codice[countryName],
            country_name: nome[countryName],
            country_index: countryIndex,
            country_name_inglese: countryName
        });

        window.location.href = `dettaglio.html?${params.toString()}`;
    }

    addMapInteractivity() {
        const mapElement = document.getElementById('regions_div');
        if (mapElement) {
            mapElement.style.cursor = 'pointer';
        }
    }

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

    createToast(title, message, type = 'info') {
        const toastContainer = this.getOrCreateToastContainer();
        const toastId = 'toast-' + Date.now();
        
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
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        return new bootstrap.Toast(document.getElementById(toastId));
    }

    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(container);
        }
        return container;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FreedomMapManager();
});