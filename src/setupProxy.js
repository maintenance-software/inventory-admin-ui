const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=eVo4u8WDoLl9Tzlr7tDLFQroe/lefjqYVuJsNgRBde2rFYul4YtRRWdVdKX06coQDxW097KaIn/E9C9GMj73GN0CW5eMCBWCoqWCiflE61cppfJrL1lVRaUnziJrtadKq1q5nPLf459hOpEUjgg9bpszaVY6kmoP3oPptw==; Path=/; Expires=Tue, 30-Jun-2020 04:09:12 GMT; HttpOnly';
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
