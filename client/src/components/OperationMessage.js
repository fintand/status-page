import React from 'react';
import { Message } from 'semantic-ui-react';
import Timer from './Timer';

const OperationMessage = (props) => (
    <div>
        {props.operationStatus !== null &&

        <Message
            icon={props.operationStatus ? 'check circle' : 'warning circle'}
            header={props.operationStatus ? 'All Systems Operational' : 'Some Systems are down'}
            content={<Timer/>}
            color={props.operationStatus ? 'green' : 'orange'}
        />
        }
    </div>
);

export default OperationMessage;