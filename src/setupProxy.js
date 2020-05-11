const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=q8b70Up2/Zg/I2eYozQ0LdDsJJ6/TE5LCoOk+D1b3IeJBQCbwBgl4VFPiMDiq57HeAa2wPzlGN41v+aULntcO6DbR74F8eSsOw5mFKmWLDWBLjwjzHf3SV/ThfMr/7Vh3S0eQjK98v1DwBMvU9HDGM7wHkocDfmYUFxJCQ==; Path=/; Expires=Mon, 11-May-2020 04:17:54 GMT; HttpOnly';
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
