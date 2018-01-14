import React from 'react';
import { Message } from 'semantic-ui-react';
import Timer from './Timer';

class OperationMessage extends React.Component {

  render() {
    return (
      <div>
      {this.props.operationStatus !== null &&

        <Message
          icon={this.props.operationStatus ? 'check circle' : 'warning circle'}
          header={this.props.operationStatus ? 'All Systems Operational' : 'Some Systems are down'}
          content={<Timer/>}
          color={this.props.operationStatus ? 'green' : 'orange'}
        />
      }
      </div>
    )
  }

}

export default OperationMessage;