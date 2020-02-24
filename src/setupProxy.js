const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.wM0nfGVbpBbBum1Yf1RE41B5lUPA4YAd.Yw2DNlVB9VZVXFd0.Lw2nnTDeOMJse1dluSABm5A6JGd2N8UZ5--Hq7SllPXbwRSYgkgTOPP_E3SGSTynYLwmljVuLIa1bu7ktCSHjHjeYqFgHqCbd6eQHD3wpYgc_qo1oATWTb34Dyi1AZqwZ32td5_Pdc6JTl7VfTBaA4CYYNmNOw0ypF0WauFu2k6sZEQN-YreB9nGig5Dq_YMS_fpSMz0GoZ-P3BTY04pJKjLENRbTrVNRAwdHePhNsTkFhgUUkFQX2cb-zADYDdFzWD1c1BmsZl1bX7YvCit3daDnr09CrlQ1DQEojegx8CrzycuABiCCHus7Pb7iRLI8Zfk6Ylcwe6S5XivdEn3NrhDoRbATWUoYuDNmMBlXDyGZWlA_uZfpus60VtYnj6KhF9eoafOqnTRh7JOr33hSngQUhrKwwusqSeHFflAWu8sGEQet9KtyM7rxO3m96kxGwDr.eckS9cAryUOm3ORzR5x-Lw; _SESSION=MO8N8hp7Fh/EzVCgFTQczaENPB7mFc5eiiR/QeUe+uz8OVVQdQUXmfWQ+chNtxlDDrfqq2yRTD57XHc+ge80N3Ijdo4CRz4eD/dB3I4xDJkZS/hHq8b3PeUQ2m/UbA1Qqg2MNOGpfPavwqYx7V4V9QebPpdyseE3tXPaDA==';
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
