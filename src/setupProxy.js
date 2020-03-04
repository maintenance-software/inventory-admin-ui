const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.90NGK5zANjaeCiCsFTu2klzhWnDiIHy1.OxlR1CsKSZXzu25w.gF3G4OXkDaR2URPT858RDqPacOUgBhPG3av718DxtXU59pPyfpdw75RYOK94dCfu_grzfYiCcnvxTDm8OqFno9LEW2D78IHF29km4p1HAGCYDZMKHznwx_yraf-pZFBsfS5jP2oTSQLPw5wHx00aR469qQQ7wWYIxFPg-go4W3rMnECGO4aHQK3AMw9eeKjqyHyx5tFygkzTgOdY22b163pQKXxWf2o2at8r74OAJg4-_PZ_EUKLdcu64HjHX87jnWADkRKqdF0sm1fRxp56qcu8a5r4udplL1yYSdXU-kK4d5Zz8Ns0BEwE5lG4VdnOpNEC1Nmm9pegn5n1Y-XGA11_jHZxy-A79MlRMoEiPFQxo4XMYYJkvnAT823WagyQAJn0Y3h59okolYQlM40aePOIsB9F8gB_2G2NZNMQizSVJ6FpuTxi7x382X335CVIqGe9.SQNciqXWTAo_X-stvkZKCQ; _SESSION=mK4KilGyQ/tPT1fpVHfrEMjtBv3elfkYjTpwighjLuGTHxFZRF/L0zx97akQQJ8yCEbuHmRxeh3flnEIiY4xYZ9cdMkMDyUvOs03enwCYIdu0OwSq4pwddkQaNHgaFrYbPXbzhiJwvJzvVYPk5J9NlYrj+J8rhogUWDPnJgtX1Wxy7thXfkFRj3t4xpuUyB5Ka9I/FzHg+2wDNUQoptpqT/xc+Mm4N9zXEi6xLk=';
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
