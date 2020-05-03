const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=S18Xb7NrX3gJ9hnrRS2faJo5L0hqQ0wH4yPeb9m1macJjCLzJiVx7rYaHmkT833w4kI9XoX1f4qVBq5uRbJh9cTXd57nfGGIVBCBweTLvkYc4zDvIjm1D7RQ1QnQtPMghwoCttecJe7OB8gpzKHYow8S0ENi8SodvRqG8rrS0b1umfI6wF25raWo82VI3EHJZR3oizvOOibctNJOLxwPThxSHJLW052d0bMA5+s=; Path=/; Expires=Sun, 03-May-2020 21:00:27 GMT; HttpOnly';
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
