const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.2lHMcB6BOuPSfvEQndhSfXUbf03oNOxx.E1g_LL3q94xo2UJq.PV-ChNQLu8XoTXk7iCbVcMokeWXyHNC9cvW6-N8z1tzw0JRT06aE9sSuo6G3mFkOgWJoqDe81AgoC2Vb4KZfd7NlihtBT2A023zPOWA62BFT3uE_eN7iLzoGKQgWiDkbnBZZdozB3Q3j5ksv79MWU5yX7g3S2sUMIyCDXOD6KAlq6uACkuE3qylUKdyPewuMZ1-n2YCFcWp5FTtcxjK_1v0Po8ZA5g8mnO8Mj0IRzwbSTCi09l1MjZA_h_Ls2rrxKyQ6YOG_US2LUYGuR8uNIVqKmIhmdEAhXMp-mowB9ovJE2lreRI039Gtjmsw5XGQB3oUnDzEG7-Os8MyocrT2B5at5k7youmcu6O_wn5mkfQ-u476WraYX_aejkJOf4UNn2wXo026H8dUXT4n6dp0AVR64QaL2IjU1g0URIzq4W0ZBEneqeJ7eUP7IRH7AQMMBhl.K3AU_yDNY4N5UJgwXFi-Aw; _SESSION=pKidOMBSPB9xvA9IdPUzYv8MwS3Y8C0scLpLBhOoNCU3yEQT7E6lN+h3A+ui1VLSnETwoaquJVsjptcFK+FuGvHBHlDqgCc40EYKHJUL1yBo73xWxvr/5qnxXXRML2HyfcV09bRoBTQeZaJdP2oxB60foLhbAwhNEp2a3bEHKGNaWv9wdbHkJiluauV9VNxqCH8cu7zRfv0DkCwPVrU5vC8PFgRUwcH9pCx0g1I=';
module.exports = function(app) {
    app.use('/api', proxy({
        target: 'http://192.168.0.100:3000',
        changeOrigin: true,
    }));

    app.use('/graphql', proxy({
        target: 'http://192.168.0.100:3000',
        changeOrigin: true,
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            proxyReq.setHeader('Cookie', cookieValue);
        }
    }));
};
