let nome = document.getElementById("nome");
let bandiera = document.getElementById("bandiera");
let home = document.getElementById("home");
let titolo = document.getElementById("titolo");
let icona = document.getElementById("icona");
let colore = document.getElementById("colore");
let iconaLiberta = document.getElementById("iconaLiberta");
var urlParams = new URLSearchParams(window.location.search);
var countryCode = urlParams.get('country_code');
var countryName = urlParams.get('country_name');
var countryIndex = parseInt(urlParams.get('country_index'));
var countryNameInglese = urlParams.get('country_name_inglese');

home.addEventListener("click", function(){
    window.location.href = 'index.html';
});

icona.href = `https://flagsapi.com/${countryCode}/flat/16.png`
titolo.innerText = countryName;
nome.innerText = countryName;
bandiera.src = `https://flagsapi.com/${countryCode}/flat/64.png`;

const countryData = datiNazioni.find(country => country["Country"] === countryNameInglese);
let classificazione = "";
if(countryData["Status"] == "NF"){
    classificazione = "STATO NON LIBERO";
    colore.style.backgroundColor = "red";
    iconaLiberta.innerText = "thumb_down";

}
else if(countryData["Status"] == "PF"){
    classificazione = "STATO PARZIALMENTE LIBERO";
    colore.style.backgroundColor = "orangered";
    iconaLiberta.innerText = "thumbs_up_down";
}
else{
    classificazione = "STATO LIBERO";
    colore.style.backgroundColor = "green";
    iconaLiberta.innerText = "thumb_up";
}

if (countryData) {
    document.getElementById('freedom').innerText = classificazione
    document.getElementById('totale').innerText = countryData["Total"];
    document.getElementById('elezioni').innerText = countryData["A"];
    document.getElementById('politica').innerText = countryData["B"];
    document.getElementById('governo').innerText = countryData["C"];
    document.getElementById('espressione').innerText = countryData["D"];
    document.getElementById('associazione').innerText = countryData["E"];
    document.getElementById('diritto').innerText = countryData["F"];
    document.getElementById('individuali').innerText = countryData["G"];
    document.getElementById('civili').innerText = countryData["CL"];
    document.getElementById('politici').innerText = countryData["PR"];
}

google.charts.load('current', {
    'packages':['geochart'],
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
    var data = google.visualization.arrayToDataTable([
        ['Country', 'Indice di libertà'],
        ['',0],
        ['',100],
        [countryNameInglese, countryData["Total"]],
    ]);

    var options = {
        colorAxis: {colors: ["red","darkorange","green","darkgreen"]},
        datalessRegionColor: '#d3d3d3',
        defaultColor: '#f5f5f5',
        backgroundColor: 'none',
        enableRegionInteractivity: true,
        region: countryCode
    };

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);
}