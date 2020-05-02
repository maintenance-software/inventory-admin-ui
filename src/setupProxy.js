const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=fitcZtnWTxulMOnJtqaRL9D36AqKXQdg25026ZiG7/DUltqiBHxzEUNuamhIsH5Ka0tgKSh/mVh5t+5NZGwEYI13ofQLqSU5MYcM3PmciSGE936CvOTxg+h3HxwzWzg9i/4/TBJZfexJshOWH09VTYoo7o5biR15+fUr8irj9/gdc/KJr45MAcgz/RxfUjnp6rKjwOZlK+M13G0+QIQF6IOMR/75gmPvtWYQ5l0=; Path=/; Expires=Sat, 02-May-2020 23:40:07 GMT; HttpOnly';
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
