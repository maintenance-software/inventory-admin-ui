const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=m1qyWaJ/phu3eEexgGnzkW/L2HOqZMS3tcB2nN0ziLWUGm0ZP5AFmb5TYlsKrQmXVmeABsfxg+1wcRxymxHJg+NaAUSPN9/VncsOb8k1u/lInDZTprbMQWzL46Byvgz24U4y78dumSFORxUQw+QeICtnNVxEXh8GtlAmfQ==; Path=/; Expires=Sun, 17-May-2020 04:55:41 GMT; HttpOnly';
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
