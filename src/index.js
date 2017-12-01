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

 function HiddenWebcam(props) {
      console.log('HW')
      console.log(props)
      const isShown = props.selectedImgSrc === 'webcam';
      if (isShown) {
        return (<Webcam audio={false} width={350} height={260} screenshotFormat="image/jpeg" ref={props.setRef}/>);
      }
      return null;
    }


class StartButton extends React.Component {
  render() {
    return (
      <button {...this.props}>
        Start
      </button>
    );
  }
}

class ImageFile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        url: 'static/images/rock_sample.jpg',
    };
    this.loadImage();
  }

  loadImage(){
    console.log('loadImage')
    var img = new Image();
    var props = this.props;
    console.log(props)

    img.onload = function(){
        console.log('onLoad')
        console.log(props)
        if ( props.onLoad){
            var canvas = document.createElement("canvas");
            canvas.width =this.width;
            canvas.height =this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, 224, 224);
            var imgData = ctx.getImageData(0, 0, 224, 224);
            props.onLoad(imgData);
        }
    }
    img.src=this.state.url
  }

  render() {
    if (this.props.show === true)
    {
        return (
            <div> <img src={this.state.url} width={350}  /></div>
        );
    }
    else
        return (null);
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
        selectedImgSrc:'',
        //imageSource: null,
    };
    this.hideStart = this.hideStart.bind(this)
    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.onFileImageLoad = this.onFileImageLoad.bind(this)
  }

  setRef = (webcam) => { this.webcam = webcam; };

  modelRef = (model_obj) => { this.model_obj = model_obj; };

  handleClick() {
    if(this.state.selectedImgSrc==='webcam'){
        this.setState({  showCountDown: true, });
    }
    else{
        this.processImage();
        this.hideStart();
    }
  }

  hideStart() {
    this.setState({
      showCountDown: false
    });
  }
  finishCountdown() {
    this.getWebcamScreenshotImageData();
    this.processImage();
    this.hideStart();

  }

  getWebcamScreenshotImageData(){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    //var img = document.getElementById('myimg');
    var img = document.getElementsByTagName('video')[0];
    canvas.width = img.width;
    canvas.height = img.height;
    //var sw = 224.0/img.width;
    //var sh = 224.0/img.height
    //context.scale( sw, )
    context.drawImage(img, 0, 0, 224, 224 );
    //console.log('sw' + sw);
    var myData = context.getImageData(0, 0, 224, 224);//img.width, img.height);
    this.setState({
      //imageSource: imageSrc,
      imageData: myData
    });
    //return myData
  }
/*
  getImageFromFile(filePath){
    var img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        context.drawImage(this, 0, 0, 224, 224 );

        var dataURL = canvas.toDataURL("image/png");

        alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    };

    img.src = url;
  }*/

  processImage(){
    //const imageSrc = this.webcam.getScreenshot();//sirve para mostrar
    //const imageData = this.getScreenshotImageData();

    //Draw data
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.canvas.width = 224;
    ctx.canvas.height = 224;
    ctx.putImageData(this.state.imageData, 0, 0);//,10,70);
    //Predict
    this.model_obj.predict(this.state.imageData);
  }

    handleOptionChange (changeEvent) {
      this.setState({
        selectedImgSrc: changeEvent.target.value
      });
      console.log(this.state.selectedImgSrc)
    }

    onFileImageLoad(imageData){
        console.log('onFileImageLoad')
        this.setState({
            imageData: imageData
        });
    }

/*

*/

  render() {

    return (
      <div className="site">
        <div className="Title">
            <h1>Rock-Paper-Scissors</h1>
        </div>
        <form>
            <h3>Choose an image acquisition method</h3>
            <div className="radio">
              <label>
                <input type="radio" value="webcam" checked={this.state.selectedImgSrc === 'webcam'} onChange={this.handleOptionChange}/>
                Use webcam
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="file" checked={this.state.selectedImgSrc === 'file'} onChange={this.handleOptionChange}/>
                Load from file
              </label>
            </div>
        </form>
        <div>
            <StartButton onClick={() => this.handleClick()} />
        </div>
        <div>
            {this.state.showCountDown ? <Timer handler = {() => this.finishCountdown()}/> : null}
        </div>
        <div>
            <HiddenWebcam selectedImgSrc={this.state.selectedImgSrc} setRef={this.setRef}/>
        </div>
        <div>
            <ImageFile show={this.state.selectedImgSrc==='file'} onLoad={this.onFileImageLoad}/>
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
        secondsRemain: 1, //Starting time seconds on countdown
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

