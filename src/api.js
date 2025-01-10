import { updateVisualization } from './d3_scripts.js';

console.log('api.js loaded');

 async function fetchData() {
    try {
        const response = await fetch('https://localhost:5000/view-user-data');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        sessionStorage.setItem('gameData', JSON.stringify(data)); // Store in sessionStorage
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}


window.addEventListener('DOMContentLoaded', () => {
    console.log('STARTED DOM LISTEN')
    const storedData = sessionStorage.getItem('gameData');

    if (storedData) {
        console.log('Data loaded from sessionStorage');
        updateVisualization(JSON.parse(storedData));
    } else {
        console.log('No data in sessionStorage. Fetching from API...');
        fetchData();
    }
});

    
    document.getElementById('refreshButton').addEventListener('click', async () => {
        console.log('Refresh button clicked. Fetching new data...');
        await fetchData();  
        const gameData = sessionStorage.getItem("gameData");
        console.log('refresh', gameData)
        updateVisualization(gameData);  
    });



