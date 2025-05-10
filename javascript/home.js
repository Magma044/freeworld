google.charts.load('current', {
    'packages':['geochart'],
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
    var dataTable = [['Country', 'Indice di libertà']];

    datiNazioni.forEach(country => {
        dataTable.push([country["Country"], country["Total"]]);
    });

    var data = google.visualization.arrayToDataTable(dataTable);

    var options = {
        colorAxis: {colors: ["red","darkorange","green","darkgreen"]},
        datalessRegionColor: '#d3d3d3',
        defaultColor: '#f5f5f5',
        backgroundColor: 'none',
        enableRegionInteractivity: true,
        region: 'world',
    };

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'select', function() {
        var selection = chart.getSelection();
        if (selection.length) {
            var countryName = data.getValue(selection[0].row, 0);
            var countryNameItaliano = nome[countryName];
            var countryIndex = data.getValue(selection[0].row, 1);
        window.location.href = 'stato.html?country_code=' + codice[countryName] + '&country_name=' + countryNameItaliano + '&country_index=' + countryIndex + '&country_name_inglese=' + countryName;
        }
    });
}