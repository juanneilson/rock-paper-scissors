import React from 'react';
//import ReactDOM from 'react-dom';
//import './index.css';
import ModelOutput from './rpsmodel.js';
import Timer from './timer.js';
import Webcam from 'react-webcam';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
//import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
//import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


class HiddenWebcam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        active: false,
    };
  }

  render() {
 //function HiddenWebcam(props) {
      console.log('HW')
      console.log(this.props)
      const isShown = this.props.selectedImgSrc === 'webcam';
      if (isShown) {
        if (this.state.active){
            return (<Webcam audio={false} width={350} height={260} screenshotFormat="image/jpeg" ref={this.props.setRef}/>);
        }
        else{
            return (<RaisedButton label="Start Webcam" primary={true} onClick={() => this.setState({active:true})}/>)
        }
      }
      return null;
    }
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

  //This method loads image from file
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


class Site extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
        showCountDown: false,
        selectedImgSrc:'webcam',
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
        <AppBar
            title="Rock-Paper-Scissors"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <Paper>
            <div>
                {this.state.showCountDown ? <Timer handler = {() => this.finishCountdown()}/> : null}
            </div>
            <div id="webcam-div">
                <div>
                    <Paper zDepth={2} >
                        <HiddenWebcam selectedImgSrc={this.state.selectedImgSrc} setRef={this.setRef}/>
                    </Paper>
                </div>
            </div>
            <div>
                <StartButton onClick={() => this.handleClick()} />
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
        </Paper>

      </div>
    );
  }
}


// ========================================
export default Site;

/*
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
            */