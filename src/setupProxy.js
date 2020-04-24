const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=/aX89NB3M8yfh7LvOjz0y5/j4QTk+iDRKqaz0FH9x3vU+r5mRjiDqVVK/bjgytTtM4OTVcubOfT3gsTU6qheALpecSmPlxusM5NDNmStHZuK6cXJPhOHwzFr6xINoW9muZxhI589lvOoU2yGnHNcBhy39Dvz6HAp5IzwjCPYrcIzcyQJDJ8qVkzOdf8uEbNwIwJHLU5dT02TNRI5Uak5njEl8vgBl734r2qUp84=; Path=/; Expires=Fri, 24-Apr-2020 05:20:44 GMT; HttpOnly';
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
