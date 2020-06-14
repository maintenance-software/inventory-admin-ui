const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=D95yrOuHrb4JnZMQMbz7MH6sdw7UR4wBUJ/uoSimY0WrvbgycIsuknHChqm2b0Z9NuNjc5RYcuKNixoPPAi8OntZxhGPkNixC5m50sKP0YRfqXbNwkXOQed96YvQrz1PZa/vqmPWLNScKuJwjJdUZjbuxu+GuiFCbLmIy2OwWUvvvI9OKARuETzHDYRFVYPaCg5tdRlNYAhj9WibFybZCBzSMfoG9ZfjzWYQaH4=; Path=/; Expires=Sun, 14-Jun-2020 05:37:57 GMT; HttpOnly';
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
