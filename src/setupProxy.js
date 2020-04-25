const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=2rp2hwA8S9ncedZQMQTYdEdSbfht4U5X7t7NwyhVGJCJpZP90duvL/BeyQ0lOZEkoHh7eRyVWk0Ql+nRI9baMghWynKJYpDba7Fd1TCP53D5A0X+tkTCjjZ5/Sl9Ir26YnOs/p6fMIWoDGA9ICikT8I4DyPTJfTXEPS1ecuO0T/VGbVVnC7un1xW/B8HlJ9BsrwFLViI333hxkx0BYMD5U0lHZj3TWkur5BxB3o=; Path=/; Expires=Sat, 25-Apr-2020 04:19:55 GMT; HttpOnly';
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
