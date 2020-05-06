const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=Zf3e2sodzeHJK/raU4v4y7ujr7j08ptd6FWMqYbUkMIMUNVTh0EuxC4tSTYVMAlHiHyta3x86nRI+5W3vXzTMgYi63/r9K6cktq9+xreVsjPCLE1a+7x/mSWutoId3sv8KLaLIrXVkxTX0349fXo5+Ux4WUHa2wwfaC5Xg==; Path=/; Expires=Wed, 06-May-2020 07:21:04 GMT; HttpOnly';
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
