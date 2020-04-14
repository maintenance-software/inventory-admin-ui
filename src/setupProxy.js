const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=nk+vdOCrj6WwI7QEIKc2b8r2y8pYQFnZEjF1j/EB2k6qEzzhqKWbGOp1yM7pjcLpNTRGkLJjar/XIJ4MEZl5flnPXNhg1TmRBjAojMxOiodN8ZYAr238jGrwE6r99/8bj2BsZgerm5+Rz0wQ3B1peSOnwQjpxW5ALddSRAoPv2s7r6iRS/Z90doXl1qPkwrfKUZLGameQARYqrseBY1/szTcjEzurCgRgEtCihI=';
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
