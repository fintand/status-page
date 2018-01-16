import React from 'react';
import { Message } from 'semantic-ui-react';
import moment from 'moment';

const SslMessage = (props) => {

    if(!props.ssl) return null;
    this.isDueToExpire = moment(props.ssl.to).diff(moment(), 'months');

    return (
        <div>
            {
                this.isDueToExpire <= 1 &&
                <Message
                    icon='warning circle'
                    header='SSL Cert is due to expire soon.'
                    content={props.ssl.from + ' to ' + props.ssl.to}
                    color='red'
                />
            }
        </div>
    )

};

export default SslMessage;
