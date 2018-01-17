import uniqBy from "lodash/uniqBy";

export function fetchRequests(ctx, days = 1, id = '') {
    fetch(`/api/requests?days=${days}&id=${id}`)
        .then(res => res.json())
        .then(requests => {

            let urlNames = uniqBy(requests, (req) => req.name).map(obj => obj.name);

            let temp2 = [];
            urlNames.forEach(name => {

                let tmp = {};
                tmp.name = name;
                tmp.data = [];
                requests.forEach(obj => {
                    if(obj.name === name)
                        tmp.data.push(obj)
                });

                temp2.push(tmp)
            });

            ctx.setState({ requests: temp2 })
        })
        .catch(e => {console.log(e);})
}

export function fetchUrls(ctx) {
    fetch('/api/urls')
        .then(res => res.json())
        .then(urls => {
            ctx.setState({ urls: urls.urls, operationStatus: urls.allUp, ssl: {from: urls.sslStart, to: urls.sslEnd} })
        })
        .catch(e => {console.log(e);});
}