const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.dOkPEKEaYSxUMIp8WRbFI45i4vqe0-mx.YTAHtnmqrf9JN8bm.cwaTPo1DSwBYePFjri5gP-Q7J0X-gWjxFstBVU3lW0E0W_tePSkMgI_7ZSxqcDMOkx5qDuh5Rar5BWYm6sQIk5mZSbABFDzf9vUhmqnVITgjXf_1FFwiyrgLQKlEjkRhhGgxAQBC05Y1UCoXte1LDIIqinahyE1uL34UXKyaSl7tEgSzfFJZyIqbOCCrhjmnQ36MIkiJgpmixmDZj0JR1x3cFzGShQyA_Pt0N-7Ix7-WLyyBo5IpescOv8uQcBtk49NbpPabBqfVgISzS2pbwsI5_OgFGqs5j6JsLm0jdQiHJNiKRl4GZQWPTvbyY8D5DB3NkFdgrJW0_UUypp24xwNOUJFgR02_NXsv06YDnaODqzwpbi4n_unTOBFQbstwKYV0_fyMLNMCz53BV4swjGjZBJhNEebzZEvwum81us1HdLpSfmtJJxzuKAdJZPw.V9lSnZTAxZB1gjPw1-b-rg; _SESSION=dmx63NvECZxz3uu5Tn9txcI+jVjek+rmZZdx53HTvachTRhpP4gMO1E5IFeQP7xWNrWDZqaGav+kc/F1/uPsJ1qfSesdEvKba0QySzVWyHVdz8QN5epj3kI79VsQ/TndHinSTkWiy/R5rYWt02JzM4nXK6AxXWovsKKcYiWLTxEXiTeTiSGw7TRWPZFYByHrdG5IrfluMdxrU80uv/pC2+nGKtJUmQu5w+yUHPI=';
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
