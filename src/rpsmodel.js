import React from 'react';
import * as KerasJS from 'keras-js'
import ndarray from 'ndarray'
import ops from 'ndarray-ops'

class ModelOutput extends React.Component {

  constructor(props) {
    super(props);
    // in browser, URLs can be relative or absolute
    this.model = new KerasJS.Model({
      filepaths: {
        model: 'static/model/model.json',
        weights: 'static/model/model_weights.buf',
        metadata: 'static/model/model_metadata.json'
      },
      gpu: true
    })
    this.state = {
        status: 'Not Ready',
        prediction: null,
        //imageSource: null,
    };
    this.model.ready().then(() => {this.setState({'status': 'Ready'}); console.log('Hola')})
    //this.hideStart = this.hideStart.bind(this)
  }

  preprocess(imageData){
    const { data, width, height } = imageData
    // data processing
    // see https://github.com/fchollet/keras/blob/master/keras/applications/imagenet_utils.py
    let dataTensor = ndarray(new Float32Array(data), [width, height, 4])
    let dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3])
    ops.subseq(dataTensor.pick(null, null, 2), 103.939)//2
    ops.subseq(dataTensor.pick(null, null, 1), 116.779)//1
    ops.subseq(dataTensor.pick(null, null, 0), 123.68)//0
    ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 2))//2))
    ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1))//1))
    ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 0))//0))
    ops.mulseq(dataProcessedTensor, 1.0/255.0)
    const inputData = { input: dataProcessedTensor.data }
    console.log(inputData)
    return inputData;
  }

  indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
  predict(imageData) {
    console.log('Predicting');
    //Llevar a vector y normalizar
    var inputData = this.preprocess(imageData)
    //Realizar predicción
    this.model.predict(inputData).then(outputData => {
    // outputData is an object keyed by names of the output layers
    // or `output` for Sequential models
    // e.g.,
    // outputData['fc1000']
    //Almacenar resultado
    var predictionVec = outputData['output']
    var i =this.indexOfMax(predictionVec);
    var classLabels = ['paper', 'rock', 'scissors'];

    console.log('vec: ' + predictionVec + ', i: ' + i)
    this.setState({'prediction': classLabels[i]})
  })

  }



  render() {
    return (
      <p>Status: {this.state.status}, predicción: {this.state.prediction}</p>
    );
  }
}

export default ModelOutput;

