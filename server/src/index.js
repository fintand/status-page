import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import https from 'https';
import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import Knex from 'knex';
import fetch from 'node-fetch';
import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // needed for cert error

let sslStart = null;
let sslEnd = null;

console.log(process.env.DB_HOST);

const pg = new Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
  },
  searchPath: ['status_page'],
});

function fetchSslCert() {
  const options = {
    host: 'ab-initio.online',
    method: 'get',
    path: '/'
  };

  const req = https.request(options,
    function (res) {
      const ssl = res.socket.getPeerCertificate();
      sslStart = ssl.valid_from;
      sslEnd = ssl.valid_to;
    });
  req.end();
}

fetchSslCert();


function fetchApis() {
  pg.select().table('urls').then((rsSet) => {
    rsSet.map(api => {
      let start  = new Date();
      return fetch(api.url).then((res) => {
        let success = (_.isArray(api.status)) ? _.includes(api.status, res.status) : api.status === res.status;

        pg('requests').insert({
          url_id: api.id,
          is_success: success,
          status_code_received: res.status,
          response_time: new Date - start
        }).then(res => {
          // console.log(res);
        })

      })
    });
  });
}

fetchApis();



cron.schedule('*/5 * * * *', () => {
  console.log('running a task every 5 minutes');

  fetchApis();

}, true);

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use(express.static(path.join(__dirname, 'public')));





// Retrieve all urls
app.get('/api/urls', (req, res) => {
  pg('urls').count('id').then(urlRes => {
    console.log(urlRes[0].count);
    const urlsLength = urlRes[0].count;


    pg.from('urls')
      .innerJoin('requests', 'urls.id', 'requests.url_id')
      .orderBy('requests.id', 'desc')
      .limit(urlsLength)
      .then(urlsRes => {

        let allUp = true;

        const responseModel = urlsRes.map(rs => {

          if(!rs.is_success) allUp = false;

          return {
            name: rs.name,
            url: rs.url,
            createdOn: rs.created_on,
            isSuccess: rs.is_success,
            responseTime: rs.response_time
          }
        });

        res.json({
          allUp,
          sslStart: moment(sslStart).format('YYYY-MM-DD'),
          sslEnd: moment(sslEnd).format('YYYY-MM-DD'),
          urls: responseModel
        });
      })

  });


});

// Retrieve all the requests
app.get('/api/requests', (req, res) => {


  pg.from('urls')
    .innerJoin('requests', 'urls.id', 'requests.url_id')
    .orderBy('requests.created_on', 'desc')
    .modify((queryBuilder => {
      if(req.query.id) {
        queryBuilder.where('urls.id', req.query.id);
      }
      if(req.query.days) {

        let date = moment().subtract(parseInt(req.query.days),'d').format('YYYY-MM-DD');
        console.log(date);


        queryBuilder.whereRaw('requests.created_on >= ? ::date', date);

        // WHERE update_date >= '2013-05-03'::date
      }
    }))
    .then(rsSet => {

    const requestModel = rsSet.map(rs => {
      return {
        requestId: rs.id,
        name: rs.name,
        url: rs.url,
        statusReceived: rs.status_code_received,
        isSuccess: rs.is_success,
        responseTime: rs.response_time,
        createdOn: rs.created_on
      }
    });

    res.json(requestModel);
  })

});


app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

// // connect to db
// initializeDb( db => {
//
// 	// internal middleware
// 	app.use(middleware({ config, db }));
//
// 	// api router
// 	app.use('/api', api({ config, db }));
//
// 	app.server.listen(process.env.PORT || config.port, () => {
// 		console.log(`Started on port ${app.server.address().port}`);
// 	});
// });

export default app;
