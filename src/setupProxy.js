const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=L5QhbKFQvQF9h8yus8R5gf8CU6BBDSfB52n6RpAJI3aIFP7pmfpPCcvYNL7XZpXd/B4Ish920b+bsQp/ljNFGyuQIrIU5H2YVZkQRu4j61s4fvWlVvFkvSx6+cCqZ38ijVfz5pfk7EzDbxUYPj/AtJgpFqTWXRKCFUUD1rUPqqfiBo8VkLHxWDU9uZkpQqkAPmkMRZriR0cbHxHFAFyQORDcfQ1Xs9AXB0puMAU=; Path=/; Expires=Tue, 14-Jul-2020 03:59:13 GMT; HttpOnly';
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
