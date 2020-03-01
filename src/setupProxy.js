const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.NABS9yn2Ti-jfHiAjzz97-PGG697DWnQ.O51QBx3AhiCoJb0j.PHqxu7x0qMD0--JTw22U6nJKPkhnolaOexzZHyt2_hMwTqKvXGoE0zT3KDJHwIAoG23h4zXQQX1V2AX4BjfSFTNpwqSITNeHfzoc94VRjrnt3arrJM2bkFALXEjcwhAcmRad6SYIFzAKED0CIl1gVuq3RwFA0y6AfljyrJpwUE-NAkD2KvBy6ZtJ5SduwOcVFasRwWir1e_sUUZtXI3nZqBd-2ezyx6UOitOT9K9yLo5q75Qw6XhIGEuPIZGynS4hg0SlSsGe5YXty8eXEVAG4L_LHX8UvmOccKb99fcNlTkSXPUhsjjXN1q7r5Son-B_o3ETDnC4_zmV2NQjZZ5awm_CbHFcV53ESzXPGnWe50xb6f8c4gUk3fEiBhvBgYHN2J7NZIkla1HTc7l4l1dkig4ng_ouwsg02W2gHb19yPBm1VvKAwrBaeh0aLJLCkJ65Tf.WdzI0phZMtXb1ph-zt7DGw; _SESSION=0XULyiEr1H+/pN37/bYz8YGzmwnh2VLVJ/0tJhVfl8Qze5nFOK31T7SF1lfmdNwlOaqizbMtJS+2ODjc2o17q1V8HDhMTZliFO7Ysxi9D8pHB4JQ+Vdl/TgTgjFJgV3Dn1Xr2cyLdpRBCQTZjYrXw/gEaj+uYRQnW0VAYA4QVDl5VNjNSfKWhO5nkn7biFeVeSY+X1c09BuZwsOhlMVVcfyLIfrxLGYL1n3BPws=';
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
