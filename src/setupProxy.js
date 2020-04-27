const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=TmnBDzdfQ901jI51CN2OUnFysFwOgEibpu0dHQaOYEt8u7xrIxnfG6HZ8L0/l5Cqn2EFFkxaAeWNZi5irnRAWBeaIC8t8KQcVl/c0JHc4Aii4WM9DjPPoUxOZi5Gtwjw6/0n6wMwvyN/yd3YE0zYEj4Jl2V/uijf2o2xnGKEb1iiBMx8nInDRJNGcwNqAAn1E+4j2iC9hdiGvAz16mOqOVCohy/PNck0dlZkxw4=; Path=/; Expires=Mon, 27-Apr-2020 02:51:50 GMT; HttpOnly';
module.exports = function(app) {
    app.use('/api', proxy({
        target: 'http://192.168.0.100:3000',
        changeOrigin: true,
    }));

    app.use('/graphql', proxy({
        target: 'http://192.168.0.107:3000',
        changeOrigin: true,
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            proxyReq.setHeader('Cookie', cookieValue);
        }
    }));
};
