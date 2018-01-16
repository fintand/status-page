import React, { Component } from 'react';
import './App.css';
import uniqBy from 'lodash/uniqBy';
import OperationMessage from './components/OperationMessage';
import SslPopover from './components/SslPopover';
import SslMessage from './components/SslMessage';
import { Label, Container, Header, Segment, Icon, Popup, Dimmer, Loader, Button } from 'semantic-ui-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import moment from 'moment';

const ButtonExampleGroupColored = (props) => (
  <Button.Group>
    <Button onClick={() => props.fetch(1)}>Day</Button>
    <Button onClick={() => props.fetch(7)}>Week</Button>
    <Button onClick={() => props.fetch(30)}>Month</Button>
  </Button.Group>
);

class App extends Component {

  state = {
    urls: [],
    requests: [],
    operationStatus: null,
    ssl: null
  };

  fetchRequests(days = 1, id = '') {
    fetch(`/api/requests?days=${days}&id=${id}`)
      .then(res => res.json())
      .then(requests => {

        let urlNames = uniqBy(requests, (req) => req.name).map(obj => obj.name);

        let temp2 = [];
        urlNames.forEach(name => {

          let tmp = {};
          tmp.name = name;
          tmp.data = [];
          requests.forEach(obj => {
            if(obj.name === name)
              tmp.data.push(obj)
          });

          temp2.push(tmp)
        });

        this.setState({ requests: temp2 })
      })
      .catch(e => {console.log(e);})
  }

  componentDidMount() {
    fetch('/api/urls')
      .then(res => res.json())
      .then(urls => {
        this.setState({ urls: urls.urls, operationStatus: urls.allUp, ssl: {from: urls.sslStart, to: urls.sslEnd} })
      })
      .catch(e => {console.log(e);});


    this.fetchRequests(5);

  }

  render() {
    return (
      <div className="">

        <Dimmer active={!this.state.requests}>
          <Loader>Loading</Loader>
        </Dimmer>

        {this.state.requests &&
        <div>
          <div className="Ab-Banner">
            <div>
              <span>abinitio.online</span>
              <span> | </span>
              <span>status</span>
            </div>
            <SslPopover ssl={this.state.ssl} />
          </div>

          <Container text>
            <br/>
            <br/>
            <SslMessage ssl={this.state.ssl} />
            <br/>
            <OperationMessage operationStatus={this.state.operationStatus} />

            <Segment.Group>
              {this.state.urls.map(url => (
                  <Segment key={url.id}><a href={url.url} target='_blank'>{url.name}</a>
                      <Popup
                          trigger={<Icon name={(url.isSuccess) ? 'check' : 'x'} size='large' color={(url.isSuccess) ? 'green' : 'red'} />}
                          content={url.isSuccess ? 'Operational' : 'Outage'}
                          size='tiny'
                          inverted
                      />
                  </Segment>

              ))}
            </Segment.Group>

            <Label>
              <Icon name='check' color='green' /> Operational
            </Label>
            <Label>
              <Icon name='x' color='red' /> Outage
            </Label>


            <h1>System Metrics</h1>

            <ButtonExampleGroupColored fetch={this.fetchRequests} />
            <br/>


              {this.state.requests && this.state.requests.map(request => (
              <div key={request.id}>
                <Header>{request.name}</Header>
                <LineChart width={730} height={250} data={request.data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdOn" tickFormatter={(str) => moment(str).hour() + 'h'} />
                  <YAxis />
                  <Tooltip formatter={(str) => str+'ms'} />
                  <Legend />
                  <Line type="monotone" dataKey="responseTime" stroke="#8884d8" />
                </LineChart>
              </div>
            ))}

          </Container>

        </div>
        }

      </div>
    );
  }
}

export default App;