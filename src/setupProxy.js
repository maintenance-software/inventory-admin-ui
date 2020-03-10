const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.-11pk9UU5R9c1FnRq2ZwbQchW6_n25qp.ufdf-0MQh8UqyTW8.LdpDJlM_qGjrQK7egR1obMAevPVJcNutr4JuSvjdH575zBZeAny_WD26urrc75RGCC-xHLwgungi5CPFFGCrAJO48TcJdE4iEcbyfoprcuCZl9Xr74LD6VmAHwayaFz3PlCXDUj0h8g8ILsHUzQVL-CIj8-CUH08-r5kfeeII99KHEZaRtWG-KP8m64XCtoYJx8g2AsVWz-9YFAwvtpahzs3diQd_8PR1-nen8VRJWQdPOaalU9oTm-dr-V7VtVF96TYiqlUzH1VlHa-ydWEVvezM2wUWKlPP-1AI2w03tiOgnHbWFsg74cA9UImiD6t8iaEdc9ieJG7vdJ_q-hFArMTuA0YUk-v1k9xJYUrhpVUjnAqKDsg-7cHT0GlAY664PenjHLpd8WW9vRqyTHTwi1vzPiKRoIRVEg4GFMs2On3Wgg4cBJ__gpOsoc3YlwCaFcW.vYUnC2d4wbWwLfbSjpukyg; _SESSION=LtX70nC3z29sIlbIiojr1wtY7b5BlQz7DVcq8OF+zkICQIQSWPainsLn4hVKPgaZGwPG4KiWKR2AQxU3RXn5Ic6qbWVGtDfICC2dsirtay5IpAoOEl7oy1DKXvKBGq4pPvlYOe/8hYPjysnvqMTQTQmBhmQtnPNqRMj2CGBF83VKJ8O8kmVXV1bA8GObXaV4HL+v89dFUfus0kkzLqpFXuo7NhXq2SJ3tgw8LzA=';
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
