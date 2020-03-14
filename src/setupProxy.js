const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.GrROzviZ8GaDAV2vxzml-I1JGp6_4I6h.Z5C17WzJh8dTFoqa.CDTYSJZqvKEab-xfQRTA4NIof8ZCc3t5AoT585rxz2vhrsUJNk9hKDqFAD7FXneSPhuHIDpXdyl-q1rbIGrMN3agqikZ0vkzxGCMtaWXVToxsV3J4gkoDyyHFY65Qx5Gc2DyVRMgjzQzR5dmdZEUsxEo6KWEDChUjoOOPsuGK9bTpD0pBZhe5Q05s3YVzKshpBRizoldbdZteoTKtIMb-2Hik5AoT_TBcqTQs-FqLLl5-0L78Kt5fgJaJdlct9cAW5f6Wg-I1GhaLl1tpQAmcTIm_wIr5A7sXIpEzMJ0UGFpr2ybDh7jAH6nxo-CtCmAyr_Rn7Cg1JLKnj3WyN5gF7PkKZ_OyPd9GlNHZQS9-M1cr3ORIAdXrTwc60kzkDVyA4kQe00BcO8ovVO46ddwdq2FDdCt1b1utzFfwmqfVLpR7JFOhvFGyqBvWiYKvSlyJair.fBspZ2xWMOYbdn5-hyGuig; _SESSION=TXBbvvYozV6FUeaY8vNjit8tNf3OfJHSPgAcSRk6RXLwKBy2EWNqMtPvi8UCMs2e2EKLqnHHH4wqZNEjU/z6uFvybfdfFF5ujTLKUSgo9ip4BMErgZSMcRq2U7KcvsBBLAc5b/dE4mCff/eUKZx0GlDyWnkiHD9Q6VzHw+bMFHC8T77Y2R5djLGjuQNxi9jPllJHJ4+5riOTWT93v02VLrzk47KHII8z23x3Pjc=';
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
