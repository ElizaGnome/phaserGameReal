import * as tf from '@tensorflow/tfjs';


//grab data from sessions storage
const rawData = sessionStorage.getItem('gameData');
rawData = JSON.parse(rawData);
//input features
const cleanData = rawData.allUserData.map(user=>{
//total death, total eggs, total palays, total session duartion, damage taken, opened inventory etc

});
//logistic model from tensor flow
//prepare data for the analysis
//predicted output values. 
//ys
//build the model
