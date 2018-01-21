import cron from 'node-cron';
import fetch from 'node-fetch';
import _ from 'lodash';

function fetchApis(pg) {
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

export default (pg) => {
  cron.schedule('*/5 * * * *', () => {
    console.log('running a task every 5 minutes');

    fetchApis(pg);

  }, true);
}