const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=ukYCMw3NNA36JaCVLaOvpoueYXr991MXFef9YBL2gKEhT3hkV2uixW/E53HMjQ/RahaRKEEv8nbgKlQQVjB6LVAbF0BUQznjIRm8Ng3KPea62WldiMtso3NiKpiXQ620Vl9ndb7EJSW6xSmwyqr6KgOV9Lkf3DND/OKiwVfFzeh+JeGTswy+V+XopnAGWmvNQO4md44yTrtGCGuA2eVX+7YnzY511Axo0fYSK0g=; Path=/; Expires=Tue, 30-Jun-2020 03:21:52 GMT; HttpOnly';
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
