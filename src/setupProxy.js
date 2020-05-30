const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=xtBuDduyhX6IcnpKp+U3uGfkd+uWDWy2zUFk++HNba75L7rkikK038WF53uc5XskHrSfyxFJODg8PBzo5q7SizdMdHOeOU3SqrpI53fZnZY0if4hm3lX2Oz5cJHk5LeB6UOqQ+kLOJYUk0H0+g9/yrmbtNX8SeH1VjwwsUVl+6qmpJAjtqh0vGJhBePbfsFZpqWMY1z0yssR/GERbqnRzgnIczWAJomZEfC6Vr4=; Path=/; Expires=Sat, 30-May-2020 19:41:52 GMT; HttpOnly';
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
