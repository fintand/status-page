import React, { Component } from 'react';
import './App.css';
import uniqBy from 'lodash/uniqBy';
import OperationMessage from './components/OperationMessage';
import { Label, Container, Header, Segment, Icon, Popup, Dimmer, Loader } from 'semantic-ui-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

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
            {this.state.ssl && this.state.ssl.from &&
            <Popup
              trigger={<Icon name='question circle outline' size='large' />}
              size='medium'>
              <Popup.Header>SSL Validation</Popup.Header>
              <Popup.Content>
                {this.state.ssl.from} to {this.state.ssl.to}
              </Popup.Content>
            </Popup>
            }
          </div>

          <Container text>
            <br/>
            <br/>
            <OperationMessage operationStatus={this.state.operationStatus} />

            <Segment.Group>
              {this.state.urls.map(url =>
                <Segment key={url.id}><a href={url.url} target='_blank'>{url.name}</a>
                  <Popup
                    trigger={<Icon name={(url.isSuccess) ? 'check' : 'x'} size='large' color={(url.isSuccess) ? 'green' : 'red'} />}
                    content={url.isSuccess ? 'Operational' : 'Outage'}
                    size='tiny'
                    inverted
                  />
                </Segment>
              )}
            </Segment.Group>

            <Label>
              <Icon name='check' color='green' /> Operational
            </Label>
            <Label>
              <Icon name='x' color='red' /> Outage
            </Label>


            <h1>System Metrics</h1>

            {this.state.requests && this.state.requests.map(request => (
              <div>
                <Header>{request.name}</Header>
                <LineChart key={request.id} width={730} height={250} data={request.data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickFormatter={(str) => '1'} />
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