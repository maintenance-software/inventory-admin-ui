const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=9REeOiuamz5f/bsoqmAEzGQOuV3RU9C9Evusdexrrn0+v2LULeQ/FBNnj7x33E77zGgs3HFeqWknlI2bHZK4X2m6d/8FNAE5L1vEuGnRP9xGffeVjL8yvpHDJUIRURkc4xeK6zbgkus4T1HcZgMInsyr39NfgcW49ommFw==; Path=/; Expires=Tue, 05-May-2020 05:19:41 GMT; HttpOnly';
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
