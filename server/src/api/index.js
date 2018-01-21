import { version } from '../../package.json';
import https from 'https';
import { Router } from 'express';
import moment from 'moment';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // needed for cert error
let sslStart = null;
let sslEnd = null;

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

export default ({ config, pg }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

  // Retrieve all urls
  api.get('/urls', (req, res) => {
    pg('urls').count('id').then(urlRes => {
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
  api.get('/requests', (req, res) => {


    pg.from('urls')
      .innerJoin('requests', 'urls.id', 'requests.url_id')
      .orderBy('requests.created_on', 'asc')
      .modify((queryBuilder => {
        if(req.query.id) {
          queryBuilder.where('urls.id', req.query.id);
        }
        if(req.query.days) {

          let col = 'requests.created_on';
          let date;
          let today = moment().format('YYYY-MM-DD');

          if(req.query.days == 1) {
            queryBuilder.whereRaw('requests.created_on::DATE = ? ', today);
            queryBuilder.where(pg.raw(`(SELECT date_part( ? , ${col}) = '00')`, ['minute']))
          }

          if(req.query.days != 1) {
            date = moment().subtract(parseInt(req.query.days),'d').format('YYYY-MM-DD');
            queryBuilder.whereRaw('requests.created_on::DATE >= ? ', date);
            queryBuilder.whereRaw('requests.created_on::DATE < ? ', today);


            queryBuilder.where(pg.raw(`(SELECT date_part( ? , ${col}) = '18')`, ['hour']));
            queryBuilder.where(pg.raw(`(SELECT date_part( ? , ${col}) = '00')`, ['minute']));
          }

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

	return api;
}
