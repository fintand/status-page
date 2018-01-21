import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import moment from 'moment';

const ButtonExampleGroupColored = (props) => (
    <Button.Group>
        <Button onClick={() => props.handler(1)}>Day</Button>
        <Button onClick={() => props.handler(7)}>Week</Button>
        <Button onClick={() => props.handler(30)}>Month</Button>
    </Button.Group>
);

class SystemMetrics extends Component {

  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
  }

  state = {
    numDays: 1
  };

  handler(num) {
    this.setState({numDays: num});
    this.props.fetchRequests(this.props.ctx, num);
  }


  render() {
    return (
      <div>
        <h1>System Metrics</h1>

        <ButtonExampleGroupColored handler={this.handler} />
        <br/>
        {this.props.requests && this.props.requests.map(request => (
          <div key={request.id}>
            <Header>{request.name}</Header>
            <LineChart width={730} height={250} data={request.data}
                       margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="createdOn" tickFormatter={(str) => {

                if(this.state.numDays !== 1)
                  return moment(str).format('D, MMM');
                return moment(str).hour() + 'h'
              }}/>
              <YAxis/>
              <Tooltip formatter={(str) => str + 'ms'}/>
              <Legend/>
              <Line type="monotone" dataKey="responseTime" stroke="#8884d8"/>
            </LineChart>
          </div>
        ))}
      </div>
    )
  }


}

export default SystemMetrics;
