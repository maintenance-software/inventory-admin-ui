const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
module.exports = function(app) {
    app.use('/api', proxy({
        target: 'http://192.168.0.100:3000',
        changeOrigin: true,
    }));
};