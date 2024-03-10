// Function to fetch and parse CSV file
async function fetchCSV() {
    const response = await fetch('standings.csv');
    const data = await response.text();
    return parseCSV(data);
}

// Function to parse CSV data
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim()); // Trim whitespace from headers
    const standings = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
            entry[headers[j]] = values[j].trim(); // Trim whitespace from values
        }

        standings.push(entry);
    }

    return standings;
}

//function parseCSV(csv) {
//    const lines = csv.split('\n');
//    const headers = lines[0].split(',');
//    const standings = [];
//
//    for (let i = 1; i < lines.length; i++) {
//        const values = lines[i].split(',');
//        const entry = {};
//
//        for (let j = 0; j < headers.length; j++) {
//            entry[headers[j]] = values[j];
//        }
//
//        standings.push(entry);
//    }
//
//    return standings;
//}

// Function to update HTML list with standings data

function updateStandings(standings) {
    for (let i = 0; i < standings.length; i++) {
        const player = standings[i];
        const listItem = document.getElementById(`name${i + 1}`);
        const lastRank = document.getElementById(`last${i + 1}`);
        const points = document.getElementById(`points${i + 1}`);

        if (listItem && lastRank && points) {
            listItem.textContent = player.Name;
            lastRank.textContent = `Last Rank - ${player.LastRank}`;
            points.textContent = player.Points;

            console.log(`Player ${i + 1} Points:`, player.Points); // Debugging output
        }
    }
}
//function updateStandings(standings) {
//    for (let i = 0; i < standings.length; i++) {
//        const player = standings[i];
//        const listItem = document.getElementById(`name${i + 1}`);
//        const lastRank = document.getElementById(`last${i + 1}`);
//        const points = document.getElementById(`points${i + 1}`);
//
//        if (listItem && lastRank && points) {
//            listItem.textContent = player.Name;
//            lastRank.textContent = `Last Rank - ${player.LastRank}`;
//            points.textContent = player.Points;
//        }
//    }
//}

// Main function to fetch CSV and update standings
async function main() {
    try {
        const standings = await fetchCSV();
        updateStandings(standings);
    } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
    }
}

// Call the main function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', main);
