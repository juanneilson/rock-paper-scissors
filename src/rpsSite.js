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
//import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { Row, Col } from 'react-grid-system';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';


class HiddenWebcam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        active: false,
    };
  }

  onStartWebcamClick(){
    this.setState({active:true})
    if (this.props.onStart){
        this.props.onStart();
    }
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
            return (<RaisedButton label="Start Webcam" primary={true} onClick={() => this.onStartWebcamClick() } />);
        }
    }
    return null;
  }
}

class StartButton extends React.Component {
  render() {
    if(this.props.show===true){
        return (
          <RaisedButton
              label="Play"
              labelPosition="after"
              primary={true}
              icon={<FontIcon className="material-icons" >play_arrow</FontIcon>}
              onClick={this.props.onClick}
           />

        );
    }
    return null
  }
}

class LastResult extends React.Component {
    jsUcfirst(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  render() {
    if(this.props.show===true){
        return (
            <Card id="human_game_paper">
                <CardHeader
                    title="Your move:"
                />
                <div>
                    <img src={this.props.prediction.imageDataURL} />
                    <div id="human_gesture_name">
                        <p><strong>{this.jsUcfirst(this.props.prediction.prediction)}</strong></p>
                    </div>
                </div>
            </Card>

        );
    }
    return null
  }
}

// Modern syntax < React 16.2.0
// You need to wrap in an extra element like div here
const HistResults = ({predictions, show}) => (
  <div>
    { predictions.length>1 ? <h2>Your previous games</h2> : null }
    {predictions.filter(pred => pred.id < predictions.length-1).map(pred => (
        <Card className="hist_prediction" key={pred.id}>
            <CardHeader
              title={"Game number " + pred.id}
              subtitle={"Detected " + pred.prediction}
              avatar={pred.imageDataURL}
              actAsExpander={true}
              showExpandableButton={true}
            />

            <CardText expandable={true}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
          </Card>

    ))}
  </div>
);

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
        webcamIsActive: false,
        predictions: [],
        predCounter: 0,
        imageData: null,
        imageDataURL: null,
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
    var c = document.createElement("canvas");
    //var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.canvas.width = 224;
    ctx.canvas.height = 224;
    ctx.putImageData(this.state.imageData, 0, 0);//,10,70);
    //Store image as src data
    this.state.imageDataURL = c.toDataURL("image/png");
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

    onPrediction(predictionState){
        console.log('onPrediction')
        console.log(predictionState)
        var newArray = this.state.predictions.slice();
        var newResult = {   prediction: predictionState['prediction'],
                            id: this.state.predCounter,
                            imageDataURL: this.state.imageDataURL
                        }
        newArray.unshift(newResult);
        this.setState({predictions:newArray, predCounter: this.state.predCounter +1})
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


            <div id="main_paper_div">
                <Row id="first_row">
                    <Col sm={8}>
                        <div>
                            <StartButton onClick={() => this.handleClick()} show={this.state.webcamIsActive}/>
                        </div>
                        <div>
                            <LastResult show={this.state.predCounter>0} prediction={this.state.predictions[0]}/>
                        </div>

                    </Col>
                    <Col sm={4}>
                         <div id="webcam-div">
                            <div>
                                <Paper zDepth={2} >
                                    <HiddenWebcam selectedImgSrc={this.state.selectedImgSrc} setRef={this.setRef} onStart={() => this.setState({webcamIsActive:true})}/>
                                </Paper>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div>
                    {this.state.showCountDown ? <Timer handler = {() => this.finishCountdown()}/> : null}
                </div>


                <div>
                    <ImageFile show={this.state.selectedImgSrc==='file'} onLoad={this.onFileImageLoad}/>
                </div>
                <div>
                    <HistResults predictions={this.state.predictions}/>
                </div>
                <div>
                    <ModelOutput show = {false} ref={this.modelRef} onPrediction={(aState) => this.onPrediction(aState)}/>
                </div>
            </div>





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