document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/standings');
        if (!response.ok) {
            return;
        }

        const payload = await response.json();
        const standings = payload.standings || [];

        for (let i = 0; i < standings.length; i++) {
            const player = standings[i];
            const currentRank = i + 1;
            const rankElement = document.getElementById(`rank${currentRank}`);
            if (!rankElement) {
                continue;
            }

            rankElement.classList.remove('up', 'down', 'even');

            if (player.lastRankNumber && currentRank < player.lastRankNumber) {
                rankElement.textContent = '↑';
                rankElement.classList.add('up');
            } else if (player.lastRankNumber && currentRank > player.lastRankNumber) {
                rankElement.textContent = '↓';
                rankElement.classList.add('down');
            } else {
                rankElement.textContent = '-';
                rankElement.classList.add('even');
            }
        }
    } catch (error) {
        console.error('Error fetching standings:', error);
    }
});


