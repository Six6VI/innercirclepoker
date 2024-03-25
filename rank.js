// Update the ranks on the HTML page
document.addEventListener('DOMContentLoaded', function() {
    fetch('standings.csv')
        .then(response => response.text())
        .then(csvData => {
            const lines = csvData.split('\n');
            const ranks = {};

            lines.forEach(line => {
                const [name, lastRank, points] = line.split(',');
                ranks[name.trim()] = {
                    lastRank: lastRank.trim(),
                    points: parseFloat(points.trim())
                };
            });

            for (let i = 1; i <= 20; i++) {
                const name = document.getElementById(`name${i}`).innerText.trim();
                const lastRank = ranks[name].lastRank;
                const currentRank = i;
                const rankElement = document.getElementById(`rank${i}`);

                if (currentRank < parseInt(lastRank)) {
                    rankElement.textContent = '↑';
                    rankElement.classList.add('up');
                } else if (currentRank > parseInt(lastRank)) {
                    rankElement.textContent = '↓';
                    rankElement.classList.add('down');
                } else {
                    rankElement.textContent = '-';
                    rankElement.classList.add('even');
                }
            }
        })
        .catch(error => console.error('Error fetching CSV file:', error));
});


