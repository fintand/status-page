import React from 'react';


class Timer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      minutesElapsed: 1
    }
  }

  tick() {
    this.setState({minutesElapsed: this.state.minutesElapsed + 1});
  }
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <div>Refreshed less than {this.state.minutesElapsed} {this.state.minutesElapsed <= 1 ? 'minute' : 'minutes'} ago</div>
    );
  }
}

export default Timer;