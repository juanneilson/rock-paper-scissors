import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ModelOutput from './rpsmodel.js';
import Webcam from 'react-webcam';

/*
function StartButton(props) { //Idéntica a una clase que tiene sólo render (Functional Component)
  return (
    <button {...this.props}>
      Start
    </button>
  );
}*/

class StartButton extends React.Component {
  render() {
    return (
      <button {...this.props}>
        Start
      </button>
    );
  }
}
/*
class Board extends React.Component {

  renderSquare(i) {
     return <Square
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}/>

  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
*/

class Site extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
        showCountDown: false,
        imageSource: null,
    };
    this.hideStart = this.hideStart.bind(this)

  }

  setRef = (webcam) => { this.webcam = webcam; };

  modelRef = (model_obj) => { this.model_obj = model_obj; };

  handleClick() {
    this.setState({
      showCountDown: true,
      imageSource: null,
    });
  }

  hideStart() {
    this.setState({
      showCountDown: false
    });
  }
  finishCountdown() {
    this.takeImageAndProcess();
    this.hideStart();

  }

  getScreenshotImageData(){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    //var img = document.getElementById('myimg');
    var img = document.getElementsByTagName('video')[0];
    canvas.width = img.width;
    canvas.height = img.height;
    var sw = 224.0/img.width;
    var sh = 224.0/img.height
    //context.scale( sw, )
    context.drawImage(img, 0, 0, 224, 224 );
    console.log('sw' + sw);
    var myData = context.getImageData(0, 0, 224, 224);//img.width, img.height);
    return myData
  }

  takeImageAndProcess(){
    const imageSrc = this.webcam.getScreenshot();//sirve para mostrar
    const imageData = this.getScreenshotImageData();
    this.setState({
      imageSource: imageSrc,
      imageData: imageData
    });
    //Draw data
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.canvas.width = 224;
    ctx.canvas.height = 224;
    ctx.putImageData(imageData, 0, 0);//,10,70);
    //Predict
    this.model_obj.predict(imageData);
  }


  render() {

    return (
      <div className="site">
        <div className="Title">
            <h1>Rock-Paper-Scissors</h1>
        </div>
        <div>
            <StartButton onClick={() => this.handleClick()} />
        </div>
        <div>
            {this.state.showCountDown ? <Timer handler = {() => this.finishCountdown()}/> : null}
        </div>
        <div>
            <Webcam audio={false} width={350} height={260} screenshotFormat="image/jpeg" ref={this.setRef}/>
        </div>
        <div>
            <ModelOutput ref={this.modelRef}/>
        </div>


        <div>
            <canvas id="myCanvas" />
        </div>

      </div>
    );
  }
}

class Timer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        secondsRemain: 0.5, //Starting time seconds on countdown
    };
  }
  getInitialState() {
    return {secondsRemain: 0};
  }
  tick() {
    const elapsed = this.state.secondsRemain - 1;
    this.setState({secondsRemain: elapsed});
    if (elapsed<0){
        this.props.handler();
    }
  }
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    //if(this.state.secondsRemain>=0)
    //{
        return (
          <div>Seconds remaining: {this.state.secondsRemain}</div>
        );
    //}
    //else
    //    return (<div></div>);
  }
}

// ========================================

ReactDOM.render(
  <Site />,
  document.getElementById('root')
);

