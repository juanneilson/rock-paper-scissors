import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import ModelOutput from './rpsmodel.js';
//import Webcam from 'react-webcam';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//import Paper from 'material-ui/Paper';
import Site from './rpsSite.js';

// ========================================

ReactDOM.render(
  <MuiThemeProvider  muiTheme={getMuiTheme(darkBaseTheme)}>
    <Site />
  </MuiThemeProvider>,
  document.getElementById('root')
);

