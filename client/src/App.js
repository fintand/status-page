import React, { Component } from 'react';
import './App.css';
import { fetchRequests } from './services/HttpFetch';
import { fetchUrls } from './services/HttpFetch';
import OperationMessage from './components/OperationMessage';
import SslPopover from './components/SslPopover';
import SslMessage from './components/SslMessage';
import ListUrls from './components/ListUrls';
import SystemMetrics from './components/SystemMetrics';
import { Container, Dimmer, Loader} from 'semantic-ui-react';

class App extends Component {

  state = {
    urls: [],
    requests: [],
    operationStatus: null,
    ssl: null
  };

  componentDidMount() {
    fetchRequests(this);
    fetchUrls(this);
  }

  render() {
    return (
      <div>

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
              <br/>
              <ListUrls urls={this.state.urls} />
              <SystemMetrics requests={this.state.requests} fetchRequests={fetchRequests} ctx={this} />
            </Container>

          </div>
        }

      </div>
    );
  }
}

export default App;