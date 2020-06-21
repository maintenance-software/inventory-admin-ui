const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=BE7HOXNwyr7afkX7rBSTnHCzPvJgizoqdndZU7Y5Fq1IvJDWNKcCkt3kIxJFEOllHPTySt8nszdApvEODXKPpQyHU0XFJbXHXyPl2o1yz8sF1jkwHksoC55IisCl3N3joTxSeyhsGYuwawgc/PQVJN9YS3jdnMrvGKAHg/Oa/7VCf1HWW5Xwuc9BNOk4CCUt88o72b/sq/U2jofjfu44o5EUgyfxTHYaYYxKCDc=; Path=/; Expires=Sun, 21-Jun-2020 04:28:10 GMT; HttpOnly';
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
