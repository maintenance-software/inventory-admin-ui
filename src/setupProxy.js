const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=eHidwksILo8wobcsXPdJHfzfJxcOU5g/gdG8qUqpYKgNmgU3/zQDKFHqlW/v+qIG08qLqUYm9i83y7Bbz/A5++/TJfzdzruAfWDivpuhC3VwhaBtGm61mcLrkUGi8KmKIoSr8nupKP3DYjK+Q/jTHXaqHIBoW1nzG2NXHA==; Path=/; Expires=Tue, 02-Jun-2020 07:00:22 GMT; HttpOnly';
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
