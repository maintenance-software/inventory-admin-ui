const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=OVCsK++CjiHxWZ0RQ2PR1bXcEAqXsHeW8iUciZLb6rMfXwp+nlrV0JX1vjuZga0O2o+wdi34XdlY/vO148omwq0XbHsQNogWB6YSuT3DUcP40zxFmMo0nYPGFVn0Y6b2KBCrH2vW5mKOiCXQTG243nFiNwmnwY89xYmWjNfYobjxuvFzaAWYA+HIUqmFKfzT87uE+MvqTc6yg8Jk6rRTbooVqLcALwscJSXj850=; Path=/; Expires=Thu, 23-Apr-2020 06:23:34 GMT; HttpOnly';
module.exports = function(app) {
    app.use('/api', proxy({
        target: 'http://192.168.0.100:3000',
        changeOrigin: true,
    }));

    app.use('/graphql', proxy({
        target: 'http://192.168.0.107:3000',
        changeOrigin: true,
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            proxyReq.setHeader('Cookie', cookieValue);
        }
    }));
};
