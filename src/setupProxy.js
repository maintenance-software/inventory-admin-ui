const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=6GToBlqP4h2ojbrrSppHgG4MDMHIAh7H4W7EMEUa47+UWKmiR4/Zov7wzM516Q+pBBqW8KoCb0l8EgkKt1oYAlfrGzA3uI3WHDyjIbF1ovPbPHyuowaf4jWcifaFRPHWuZMDGGEjV3d3g2jAo7xxM5Av435CszeXCamYY9xo2Sg1hXgluzx+j/1D6guEpDHbky7R3VdHXnvL4+8mBkkVFUFYzo5IeDoIa05PFqU=; Path=/; Expires=Wed, 22-Apr-2020 08:23:03 GMT; HttpOnly';
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
