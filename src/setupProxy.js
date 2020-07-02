const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=jOu0H4fF+KN3/RKxrLIEtkHwEH3sfT3RQ3tZJLVBl7t4P+ICQKgYnWlQy+ctb7k0MBbbsNmqBQUSfhXwATFlcNSM1HWo+LMl1K66tTuMFHD9VrxcwkSkWZO55+qS5lZ1XthfVwbUaiJVwSJ4pZseMprUB1BVRh+AtKQctA==; Path=/; Expires=Thu, 02-Jul-2020 02:43:26 GMT; HttpOnly';
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
