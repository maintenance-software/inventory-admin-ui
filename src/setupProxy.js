const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=BjdWWH9mpJjlYY82GK48bBKYFqnsT8HaA+dOe5swvfkuZNKEi/qG/eUHgEMqLfBEQjqTfDgabMR2DEPtiUlTtsvQhuDm7LYRxoeq0+SN8n3yilkew5WI+131UsriAt0MKtBChR+QcyDaT/nOQ3CeyTLgG/Hjeij/pkTqVw==; Path=/; Expires=Sun, 03-May-2020 23:01:14 GMT; HttpOnly';
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
