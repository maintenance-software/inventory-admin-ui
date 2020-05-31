const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=PLXoh+xTqVTpafzIYWhoaUoElERczExYiRc+dP+Nve9k8Att/NRlKzJKGsob31tstzs1UUdRScRSIY+aOkP5oBxRr+cTpk2hF+SIiPzevFJkPNupn3RmbS42RJGPVLfNKiWWKX994Ygm5oRtTWjg8dcqgjuak4Mo9NxlR2O55RJBQ2UXkGwCWNjpD/K7+SXjR9YYjWLEJDId9n7h9OkYr6ts8IamXlMtmKCg5C8=; Path=/; Expires=Mon, 01-Jun-2020 01:05:22 GMT; HttpOnly';
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
