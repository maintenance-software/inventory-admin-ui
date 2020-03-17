const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.-hE29FiGQVWKU8NcZFU5PBUZMkdDqZpa.V66M19IUexhoPTfx.UBtn-FGcKS2Kzez055O-mOfgHvOFrIuI3PLYSAfLmqNqYKpqAyJ4GHKKP2LUZQ2tQrMZZuGgPkYxGUQnrzs0hiMBd3kon3AnMuTbKobRog618pjOte9m5AieVeRgjazR2tLF8RcKnppjbk-K6g.MJ7uCs7jWgNfID_aIpB7PA; _SESSION=IvRsjXmYg1okvmWK1aj86qQUenz8EJc4f7cHokF7zzhvtc+lfYQ4v2RppQ4oAu+hY6jobeolQMmaTxcG8kgKZCFoFTQpZJPXfTSjgaU22RhN9r7diyn8bvJbWMunMQh2Mn0/GtMbaUwLEK8KdRaChcvSxPeLgHP9sU5Txdrvhrt4IWbG5iq+qjvfg/66Slm+QYzTwr6CPGiDjMuA5lQtsaR0+UrSPQ8t7CxehcI=';
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
