import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const SslPopover = (props) => (
    <div>
        {props.ssl && props.ssl.from &&
        <Popup
            trigger={<Icon name='question circle outline' size='large' />}
            size='small'>
            <Popup.Header>SSL Validation</Popup.Header>
            <Popup.Content>
                {props.ssl.from} to {props.ssl.to}
            </Popup.Content>
        </Popup>
        }
    </div>
);
export default SslPopover;