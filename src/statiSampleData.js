async function loadAndProcessData() {
    // Mappatura indici colonne come nello script Python
    const columnIndices = {
        "Country/Territory": 0,
        "Region": 1,
        "C/T": 2,
        "Edition": 3,
        "Status": 4,
        "PR rating": 5,
        "CL rating": 6,
        "A": 9,
        "B": 15,
        "C": 19,
        "PR": 21,
        "D": 26,
        "E": 30,
        "F": 35,
        "G": 40,
        "CL": 41,
        "Total": 42
    };

    // Carica il file Excel (percorso relativo dal browser)
    const url = "assets/countryData.xlsx";
    
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets['FIW13-25'];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "N/A" });

        const stati = [];

        // Itera dalle riga 4 (indice 3) come nello script Python
        for (let i = 3; i < rows.length; i++) {
            const row = rows[i];

            // Interrompi se non siamo nell'edizione 2025
            if (row[columnIndices["Edition"]] !== 2025) break;

            // Estrae i dati nello stesso formato dello script Python
            const countryData = {};
            for (const [key, idx] of Object.entries(columnIndices)) {
                countryData[key] = row[idx] === "N/A" || !row[idx] ? "N/A" : row[idx];
            }

            // Ottieni nomi e codice dalla mappatura esistente
            const englishName = countryData["Country/Territory"];
            const italianName = countryItalianNames[englishName] || englishName;
            const sigla = countryCodes[englishName] || "N/A";

            stati.push(new Stato(
                italianName,
                englishName,
                sigla,
                countryData["Total"], // indiceLiberta = Total
                countryData // democraziaDati/datiLiberta
            ));
        }
        return stati;
    } catch (error) {
        console.error("Errore nel caricamento dati:", error);
        return [];
    }
}