const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = '_SESSION=9RNatuFjtT4lI8Eba/5rWg3ihFeIR5s1jvftblVcolCug+weDBLjArvvgf8/vK84wGDcciBxkaOUwfI0IWiq0J86+L/CsGH/wU3VSjHktpxUP4e5bdSNephZzvuuLY9Rkyl4h90VyoQmPjyoQ6GkgfpZhQAMAvjwwS7AzZ4JSZvFq0veNbQIOCsVvhsbt1GAYVlY33OE66LV2+Ekdxn+XkkHnhmmuy7XfJx9JcI=; Path=/; Expires=Wed, 15-Apr-2020 05:30:14 GMT; HttpOnly';
module.exports = function(app) {
    app.use('/api', proxy({
        target: 'http://192.168.0.100:3000',
        changeOrigin: true,
    }));

    app.use('/graphql', proxy({
        target: 'http://192.168.0.107:3000',
        changeOrigin: true,
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            proxyReq.setHeader('Cookie', cookieValue);
        }
    }));
};
