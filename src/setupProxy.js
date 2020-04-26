const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=QsaWHsSr+XEB+PbBWFS1vhH4cnX7hnR0U5m926PJlHiPOB2KLYcHx36Dq+orKa0gHpxs8+HqsRYLuP/hEGGBDJiGx4L9XJUlun2bf4qlRXrcWl9HyAW9iuF0yNDaZD6IQnbXEkDbkOlSWMj/ttpGC1gaXdDGMjle9QDMwrAfyAyqx63V7JhEL3vN9V1qrNi12jsxjlKFbb4h4FrXnjm7O/xKIOzuRBHF2m67v8k=; Path=/; Expires=Sun, 26-Apr-2020 20:52:20 GMT; HttpOnly';
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
