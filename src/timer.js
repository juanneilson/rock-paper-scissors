import React from 'react';

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

export default Timer;