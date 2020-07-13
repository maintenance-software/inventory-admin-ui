const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=rjVdhJ+yZhNLg3AYrryE7JK5dIACBNJvtf211DME/TDR4CrQ5LzI/JqLcHFXn37ELcnUFfqWhuM5M4DPlTaG6Tokp7m/IyixOs156aH9bLsC/aMt6/UHSd0KPVMz/tmpuYQwbBfdprog8NfdF7T1xNs3FNXApB0QZaNNcg==; Path=/; Expires=Mon, 13-Jul-2020 02:03:38 GMT; HttpOnly';
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
