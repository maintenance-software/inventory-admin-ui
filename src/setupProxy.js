const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.ixNldQtMrTYxCjcLPOYUfLyMEiWwTBOK.o42P4EgGZfzTdTzk.ByNTzcmNtgIFii6Fag4Ep3pm_71DX4iw_p1PHtY-lo3WlacifEVkqHCOXou8tjj66E2DOPHvuZJetQdwBPxRFuribksUkFK2KqxBxz5abmfU-BZGpZHYHog1QvGimCIR4xRL7HMLNLQ2M6uJT52Y1TEgaOvUn-y2cPUtQKuB6qq5F3D7WIaFD7MF3SDCJd2ozXwtgQrRpDhC6BT-vI2oj4me-k7joIqXTqO4ChMkXbVZ6NDsqL4z2Pjo1m8bNX6dk8ckcboXX-i-CaWw-X8shI_HXZYQOy-9TYer8_RER-QJIEjmjqLmuMoH0-LeIpyEVPfkv6pP50KM_YsZrmch2pV0jqUuMak2wRbLQ1e7UjqAQ4OH7FR_HHxC7CTvDo12PF6rfOukDFKVYcDmioEL94oJJDiGiXITb8s07yjPx0jbYeHzuJrpv3aX768CxIS0ODR_.HyTn1ad_D7nuThW9_4hvmg; _SESSION=Ij/Nc86NyJCb1g6XKbIQgUIaUCrjGtsc3oakBy7lT5rGt6sJJgI9isVgKgSCToTO+6PM20wuo6Cw/PzyWUiq1zfinCIs6TAiSTDQ27y/bBk9A2SagW4JULhQU1dkV37cuq7Ex7kVWhK+XWwyEyYJtyvFb9OL8OwFujN5sGprt5rpYi3FNwgMOuCqm24BC235IQya8rzwD23GtxA4Is16uyCeTjZZHINsNkjJ8lg=';
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
