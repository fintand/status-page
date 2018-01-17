import React from 'react';
import { Segment, Popup, Icon, Label } from 'semantic-ui-react';

const ListUrls = (props) => (
    <div>
        <Segment.Group>
            {props.urls.map(url => (
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
    </div>

);

export default ListUrls;
