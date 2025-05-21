const mappaStati = Object.fromEntries(stati.map(s => [s.codiceISO, s]));

google.charts.load('current', {
  packages: ['geochart']
});

google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  const data = google.visualization.arrayToDataTable([
    ['Country', 'Libertà'],
    ...stati.map(s => [s.nome, s.indiceLiberta])
  ]);

  const options = {
    colorAxis: { colors: ["red", "darkorange", "darkgreen", "green"] },
    backgroundColor: '#f8f9fa',
    datalessRegionColor: '#e0e0e0',
    defaultColor: '#f5f5f5'
  };

  const chart = new google.visualization.GeoChart(document.getElementById('geoChart'));

  chart.draw(data, options);

  google.visualization.events.addListener(chart, 'regionClick', function (event) {
    const stato = mappaStati[event.region];
    if (stato) {
      localStorage.setItem('dettagliStato', JSON.stringify(stato));
      window.location.href = 'stato.html';
    }
  });
}