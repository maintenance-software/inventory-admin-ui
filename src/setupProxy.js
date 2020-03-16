const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.pt3Uk0nPDeuNoggMBh0H9oG3K1FkLc4F.l7zYMI4I_1_s_BKK.IIABIvjBpeJnmd79ZUPHGBPFQFaVeaeTBIcMU7Zwx8XKLrcQW-umXcxuWFUetORV-5voVHeAWOHZEuT_175xrmkAt9ru1txHfjPRAjZMFSIQZbXQIHhsnI4mLhZY_u9l78q-eCERAZ5QmVXq3Mn9XUdB7ko4A1BSJ0LnSNeHNW4RQ1Rl3UxXdNvzLBPVmSM1Lb_-rexkEZUckt3nVG3zTmw5oUv2oqxQIxZ-xSPUVQDcVHA7RtZ5yCXo06SqCKlrPdjdur9f8v4AvBLxN4ogDWQlwIwKPmIfs9-OBKITzN7QmOChEomG0-ZHyXT1j_UBA5FwWkc6fafSuf0MwzisqrNWfy5YvsZhqGgRMdp7HgfssDeypfmJJG-Cez1Mo6qhQx4KaN5GrVvD1417z8Vezyg-q9EPVcoQmH7wSfX6UHkrUU0JL-TFi0bQYUtn6us.fF664bE87qKtl_8xmcVkHg; _SESSION=2Xz4+y+LKrWVetonFdrcSvC1yNcrKhRj95eefmv6/JSmQYdZnIcu8push7XGbMZOwf1T/4bR1PDjJx43xigOlyl9cUMoD/trYs1TgIdZLKj0QMpTxrcuAJJmxn0OwNzbaa8uMZSRb06I+QJzzGq5oHK30HM3fBhBiJO/OyQqvQaPO3/M0GLlVZCbtQlFabNoM0KOQpjF2D1HW2My4CJOsspI2tcIvtQ9L8aqBo8=';
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
