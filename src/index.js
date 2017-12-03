import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import ModelOutput from './rpsmodel.js';
//import Webcam from 'react-webcam';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//import Paper from 'material-ui/Paper';
import Site from './rpsSite.js';

// ========================================

let override = {
    "palette": {
        "primary1Color": "#673ab7",
        "primary2Color": "#5c6bc0",
        "accent1Color": "#4527a0",
        "accent2Color": "#f57f17"
    },
    "appBar": {
        "textColor": "#ffffff"
    },
    "raisedButton": {
        "primaryTextColor": "#ffffff"
    }
}

ReactDOM.render(
  <MuiThemeProvider  muiTheme={getMuiTheme(lightBaseTheme, override)}>
    <Site />
  </MuiThemeProvider>,
  document.getElementById('root')
);

