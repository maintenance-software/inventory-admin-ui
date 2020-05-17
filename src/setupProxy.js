const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=ey3kaTxcMwa4D2NSFDUo8KRkfsniI3VYcq1bvTkOQu7ewTAJ1mIa4dSyu9ty/czoMGGPWOfgmW/BcmyMh9yf2XCIFTmi5GU/+S2kILnUqkjpwqx8C4NXZ5nTJdVWGY5YVlqsqjjYx8PFcDrjYRZZpkQuN4389vl3OFdatg==; Path=/; Expires=Mon, 18-May-2020 00:42:36 GMT; HttpOnly';
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
