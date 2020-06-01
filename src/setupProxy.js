const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=fJW5sp+yFXlJ4drXq9K06XKMC3X8D3uC+q0DVTrmgRzag/NnwzU1ljA8yDZlQ8VfJV6X29kVzbXFnxhPehYZHGD8rzKtKW0J64jZ208i90vfT2YzaKAOsJd8uac+P7lERUMq194r/noy+ZjB7M9Oh3qrQHh/mP7FK/461w==; Path=/; Expires=Mon, 01-Jun-2020 03:09:26 GMT; HttpOnly';
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
