const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=GXg4AAg2lgu9/zi7cbQzct3MiQQs/2iBBkHMvX1H0uuIQoS0z2GuIMuD4tfusdiuS/f45BE28rVwul0yHj5OC5iIyJgv9BL3gUPGW/yzUZxUeLGumL0TQIPkwUlfEjNTKxN5x93In+hmbOmWRRnnN5/h17NSfu9HlRodCw==; Path=/; Expires=Sun, 21-Jun-2020 06:33:06 GMT; HttpOnly';
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
