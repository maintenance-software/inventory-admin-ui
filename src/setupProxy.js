const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.DCjRFR2mpqWpyoAOk1Ft3Tp7HiXzYwnU.eI9AtqZtzJSP1mFL.SapU8md4hHuMmESg7w84JWdGo9jZcYPSm-hu-wPyMIxeYTjSp2kgsqAYHjo_KrUSllsQpGZXIWKn-RxKFT4_isZJzrWe3zMDYah02LIQbRPzWV0Sc40ZQR_2AZajLFtTWeqm71qCgKH2NWzK07S_UAYPvh0o3HqXZh8MBjSyi0QnkbUqNNRjY0UQdVB7ZmSQMlu8-fwarubr8_JLzLKt3jP9Yy-SIo5-wdQjnSWMKlNt6WeyCYPKXJ9e4rJozI7l7sYGVLhM92zrRDpUuY10Z_Z8mXbsO2qF97FtCt1c7yy26mKL4qfIrcaKgzsyal7scrSoJAgXbGnHFCTOLHkboiQqxv7ul_1QOsYNV4FIgXiIsNtArdFOhugei2OGNM12OyBtrR-twxenpIfDf9E9CocFQa4ZgrDCdNIMptn1Qq2oYxr2-A26ajcm2nafopwfILSC.PNZ9G82J1G6oc9qvDgl5EA; _SESSION=Au3j10HQBzgr2xxQNIrMnCDeySi4RVwUZTtKngXY87yiTRT1E3EwJyVjJ3ip+/1AwJn7sfdYFA/bJFLlj9AKOt0lG9a1U71mtvApXdjfUfMgqW/cNNCa3grMh6O8oGBs+PWk2/ioleXRudaLzQuuouWbJE0NDlNF918mbnaFcDbhrmVyR05w7Nj1IIcEBcBpPHalSScecKhDdFOVKqKTcwSTua+sZqjsrC6x5Z0=';
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
