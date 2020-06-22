const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=dWhhObPqk2VoaI3K+xEI5dqz3O6MiiK3dWgtiy/OmLhdSCh/KtgJxVmEmXNMLwnfFpL5dC0HmhO2oz3YCwYNGJ5ilRC0SE5WRdWSqWM536yIKBN5evtlnJxDAZi3TVDWCwJypcaikwj9k3hT48TcBZH8YDHA07gWBtAzew==; Path=/; Expires=Mon, 22-Jun-2020 02:33:03 GMT; HttpOnly';
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
