const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=fRtpjiM7r8ZW3EayFRxKP2B6CugeMn4s5oa2KOHYrZFhFUWbKbzZpjszfjHjfwc+Q+mEMoXD+x0Z05rDja9nyTDAOj/phMiHJah8+FXsBx6AsmUhEZ5UbFQf99gI4PKVz1VoqBFyoN88wSH2di5IYYeZbIzx+hkXgruCSg==; Path=/; Expires=Sat, 23-May-2020 19:34:29 GMT; HttpOnly';
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
