const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.Vxf0ubMPhZapnqpgZjhCU4eCwaNXNYKx.y1Eo2I2IBnZbjggl.RBDP652xT-CPhC3FeV_qZx7F91N394_GUtNPdiDjZ6D0SwZW4ihhpHcQJzy1VyCn-0s3WnBDTshQe1Jo0b3EtpaSiUyxTcdxEmL78v_AF9AxKbcSkg5iRwsI_3ICMddWASpKK7vwvED-0nB-_w.PQkMO-uag_TChFQ-z2SoWw; _SESSION=Zc/MRevAHL3KQkc/gGTPZQG+vC5lm6AiPBYyPUYWqB9RqJF9KJmU1oZaeBBvc8LUDMdxBHAm/QqGKhpL6809SMYUlUXgK355WXMk06kD3jozMtbCB95i5oPFcxQM7KU36T9uw3qYL71d6uW3WRE7/R9r/YJO9V/KEgXDj1ea4q25bZjBAWV3U84yghcBlNO20PDNQ7Sd39iA/R6Z7W46PwMaevzMPXV3HPyXtH0=';
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
