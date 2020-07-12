const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=mZ5exRY/QN88l1Fcp9VdiJxYE+bscHP4/SuKd6utbjnS33N2LYP79e2OCuuMQDt0lNP8mpuTTnLMVnMHeSmxV+4YRjROETJx5c/ALlerUFwxDqt2nlIvuiTnhIH3BI9ySpGTATY9HKqVuhz2JwlAy2XIMa7aoMEG9fYE5sWDQ4VDSQo0BuF/NSFoUyjzHioYxgEqBFCAi+4dcqx5xArkAR4HmmZCSTsTS7dTg14=; Path=/; Expires=Sun, 12-Jul-2020 03:21:35 GMT; HttpOnly';
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
