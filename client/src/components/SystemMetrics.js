import React from 'react';
import { Header, Button } from 'semantic-ui-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import moment from 'moment';

const ButtonExampleGroupColored = (props) => (
    <Button.Group>
        <Button onClick={() => props.fetch(1)}>Day</Button>
        <Button onClick={() => props.fetch(7)}>Week</Button>
        <Button onClick={() => props.fetch(30)}>Month</Button>
    </Button.Group>
);

const SystemMetrics = (props) => (
    <div>
        <h1>System Metrics</h1>

        <ButtonExampleGroupColored fetch={this.fetchRequests} />
        <br/>
        {props.requests && props.requests.map(request => (
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
    </div>
);

export default SystemMetrics;
