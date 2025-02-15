//grab data from sessions storage

function setUpModel(){
let rawData =sessionStorage.getItem('gameData');
console.log(rawData);
//input features
rawData = JSON.parse(rawData);

console.log(rawData);
const inputValues = rawData.allUserData.map(user=>[
    user.total_deaths,
    user.total_eggs,
    user.total_plays,
    user.total_session_duration,
    user.opened_inventory,
    user.damage_taken

]);
//needs to be a binary, so if user win greater than 0 then 1, elso 0 which means theyve never won
const predictedValues = rawData.allUserData.map(user => user.win > 0 ? 1 : 0);



//tensors 

const inputTensor = tf.tensor2d(inputValues);
const labelTensor = tf.tensor2d(predictedValues, [predictedValues.length, 1]);

//model creation
const model = tf.sequential();
//dense is neural network
//number neurals
//specifies neurons
//defines the shape of data
model.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid',
    inputShape: [inputValues[0].length]

}));

//binaryCrossentropy for measuring the difference between proabbilities predicted and actual
// optimize specifies optimizer to be used during training
// metrics to be avaluated udring training and testing

model.compile({
    loss: 'binaryCrossentropy', 
    optimizer: tf.train.adam(), 
    metrics: ['accuracy']
});
return { inputTensor, labelTensor, model };
}
//logistic model from tensor flow
//use await training the model with fit.
export async function trainModel(){
    try{
    const { inputTensor, labelTensor, model } = setUpModel();
    console.log('trainmodel', inputTensor, labelTensor)
    await model.fit(inputTensor, labelTensor, {
        epochs: 100,
        batchSize: 32
    });
    console.log('Trained the model');
    const predictions = model.predict(inputTensor).dataSync(); 
    console.log('predictions',predictions);
    return predictions;
}catch(error){
    console.error('error MODEL', error);
    return [];
}

};

