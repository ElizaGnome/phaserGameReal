import { updateVisualization } from './d3_scripts.js';
import { trainModel } from './logisticModel.js';

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

    
    document.getElementById('refreshButton').addEventListener('click', async () => {
        console.log('Refresh button clicked. Fetching new data...');
         
        const gameData =  await fetchData();
        console.log('refresh', gameData); 
        const predictions =await trainModel(); 
        console.log('Predictions:', predictions);
        updateVisualization(gameData,predictions);  
    });



