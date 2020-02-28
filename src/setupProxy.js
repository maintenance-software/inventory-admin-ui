const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.6z5LgXeDBvMvT-FkIcNmlcnhHLAI5txb.6JZvfu7ZnxGOINEh.pnwPnhN5SdV7Qu5mMbHp6gVf-3SgiIMWRnLm0PED3V424FBLz96LpcRPFkW6nIs0FcCSP12H8_ep-Yanf_2XCwt2wGAoXKGM5Pa675O2DUoJfasFlQPotPqwpGanWRlTgQ01xfUKIzQStJMHs9ToWOxpZLEZUQlTZEOyHLfYpA5BdJ4T5FB6sd-9vixeZKYs-6jdN6J3r9byr8FH3h4NZICn20oHpM0aCIcfCYUsBug8oEyUkbK0nxyykdIy_ptrH2bpwuijW7Az3dW29iEy7K3_RKAG8jykTGsHbmQrWef19mo_FqjYm4wTVhbHA5OImexDeK8rOes3PCkPTusPKVooR_EqaqRhSWYq8ohbnsoEIkbFYzUzl8V8xOAturlFb1nkz6tZd0YoxWogxaWVoVYwujaH_Qfi0sQNK9h0mzfgQmO5SJSnQT9N8fKF3rZxLMfm.1SaYuW2qoNBfU-YNn-Jd2Q; _SESSION=Za7LvOogD9QsYCnGQcAXArY9S+ad6WGlwwRVOGj9V7nqXr/0aIr6O4f2KBiiBQpjqWlyZiQnzBzBiZk+vatUmItx+TCM8jSiZCT3eYRj6irCv9RpwXEjA7rHEfknZEPzpJX5VlBzynBZg/lQTSBvRlrb4bQMdFjcaIzzWg==';
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
