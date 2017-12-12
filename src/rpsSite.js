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
    if(this.props.show===true && this.props.prediction != null){
        return (
            <Card id="human_game_paper">
                <CardHeader id="card_header"
                    title={this.props.title}
                    className={this.props.header_class}
                />
                <div>
                    <img className="image_result" src={this.props.prediction.imageDataURL} />
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
    { predictions.length>1 ? <h2>Your previous rounds</h2> : null }
    {predictions.map(pred => (
        <Card key={pred.human.id}>
            <CardHeader
              title={"Round number " + pred.human.id}
              subtitle={"Detected " + pred.human.prediction}
              avatar={pred.human.imageDataURL}
              actAsExpander={true}
              showExpandableButton={true}
              className={pred.result.resultString}
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

const Scores = ({result}) => (
  <div>
        <Card id="score_card">
            <CardHeader
              title={"Score"}
              //subtitle={"Detected " + pred.human.prediction}
              //avatar={pred.human.imageDataURL}
              //actAsExpander={true}
              //showExpandableButton={true}
              //className={pred.result.resultString}
            />
            <CardText id="score_card_text">
              <h2><FontIcon className="material-icons" >person</FontIcon>
              <span>{result.human + " - " + result.computer}</span>
              <FontIcon className="material-icons" >computer</FontIcon></h2>
            </CardText>
          </Card>
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
        lastGame: null,
        gameHistory: [],
        predCounter: 0,
        imageData: null,
        imageDataURL: null,
        scores:{human:0, computer:0}
        //imageSource: null,
    };
    this.hideStart = this.hideStart.bind(this)
    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.onFileImageLoad = this.onFileImageLoad.bind(this)
  }

  setRef = (webcam) => { this.webcam = webcam; };

  modelRef = (model_obj) => { this.model_obj = model_obj; };

  handleClick() {
    this.pushLastGameToHistory();
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

        var human = {   prediction: predictionState['prediction'],
                            id: this.state.predCounter,
                            imageDataURL: this.state.imageDataURL
                        }
        var computer = this.makeComputerRandomMove()
        var gameResult = this.resolveGame(human.prediction, computer.prediction)
        var newScore = {human: this.state.scores.human + gameResult.human, computer: this.state.scores.computer + gameResult.computer}

        this.setState({lastGame:{human: human, computer: computer, result: gameResult}, predCounter: this.state.predCounter +1, scores: newScore})
    }

    pushLastGameToHistory()
    {
        if(this.state.lastGame){
            var newArray = this.state.gameHistory.slice();
            newArray.unshift(this.state.lastGame);
            this.setState({lastGame:null, gameHistory: newArray})
        }
    }

    makeComputerRandomMove(){
        var possibleResults = ["rock", "paper", "scissors"]
        var index = Math.floor((Math.random() * possibleResults.length));
        var newResult = {   prediction: possibleResults[index],
                            id: this.state.predCounter,
                            imageDataURL: "/static/images/" + possibleResults[index] + ".png"
                        }
        return newResult;
    }

    resolveGame(strHuman, strComputer){
        var modifier = {human:0, computer:0, resultString: "tie"}
        //var new_scores = {human: scores["human"], computer: scores["computer"]};
        if(strHuman === strComputer){
            return modifier;
        }
        else if ((strHuman === 'rock' && strComputer === 'scissors') ||
                 (strHuman === 'paper' && strComputer === 'rock') ||
                 (strHuman === 'scissors' && strComputer === 'paper') ){
            modifier['human'] += 1
            modifier['resultString'] = 'you_win'
        }
        else{
            modifier['resultString'] = 'you_loose'
            modifier['computer'] += 1
        }
        return modifier;


    }
/*

*/

  render() {

    return (
      <div className="site">
        <AppBar
            title="Rock-Paper-Scissors"
            iconClassNameRight="muidocs-icon-navigation-expand-more" />
        <div id="main_paper_div">
            <Row id="first_row">
                <Col sm={8}>
                    <Row>
                        <div  id="play_button_div">
                            <StartButton onClick={() => this.handleClick()} show={this.state.webcamIsActive}/>
                        </div>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            {this.state.lastGame!=null?<LastResult show={this.state.predCounter>0}
                                                                   title="Your move:"
                                                                   prediction={this.state.lastGame.human}
                                                                   header_class={this.state.lastGame.result.resultString} />: null }
                        </Col>
                        <Col sm={6}>
                            {this.state.lastGame!=null?<LastResult show={this.state.predCounter>0} title="Computer's move:" prediction={this.state.lastGame.computer}/>: null }
                        </Col>
                    </Row>

                </Col>
                <Col sm={4}>
                    <Scores result={this.state.scores}/>
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
                <HistResults predictions={this.state.gameHistory}/>
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