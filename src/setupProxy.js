const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.LXA8HqNslbZioIPGJT-69lbWQyocYTnE.n3a_W9Jf5pTy77GO.8l0oMfaWVlpGZLj44aGl6y4QD7m9C90sEBE3oy-nZoWSNH9SS6e8TcX0vX2DJ5Bib0_-fx1S7Wg3qrcbeELF8w8tJxMZAB5-EMjPDKFzFyEMXs7Z3wn1cg9poPHwsAKdDVf5SffoOGHz4Fs7rm2G1XkMSwpPrTueO98-33EuphtP4Nl2e7mwpyVPkaZNFc1WTdo10P-kKvFUnRdI7syfT0md_qtegwXcmTgyN6E6LKk1htpVnLXNIOl3r0J0-_AI2CaCfRS--VCQGQpjyiskM45XPVBbhxENQLyj2ThV6y6mbNpek1R5vSt0yJwwRx3Mpoq7pDNFgzzHzdgOgXtFW6TwbEdd6QTXsw-148WVibc3B2T59m3zKue6bo03jN3eV12O3VnL5rZZnc9Ihdmgd50XI8juWuGl3sU3eY5EPCpjnwkyL_832uqfGIAoryxv2aUp.xHrOT7f15E7u-HxH2STW-Q; _SESSION=b4tEgg9I4FEWLgxUYKulRyF1PTdrMV4712IiYhPYFYlfhVMf/Wgcb+v5hjbXX9GpefnfKeNwx0KYw8XhcfL8rGJtm/Cw0Vz2ZKSYqB0NNb6aVoWMCr/n+2MOCsBx5UF4kHnw/q8zksBxvQQWSRQ8v81v4j/WZU9HaBxTDSjG56nCF8mGn7MReOUbsDUhS+/Ys5WatggY/YQk0IuU+FzWz+hn2Oa89BAMnjVDRco=';
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
