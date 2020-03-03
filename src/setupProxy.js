const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.4_U5YQBOhtTaUSv8o4UdFft-RWZidLIO.10FU7TaIvcvh-CQa.oaNe5VncZBfocTohfBTODRsuDSHm36G9bjGScnbplEZgJ9T4VdI8l9lCXQFcE0WdmOnon3kYuEww-iKtkAT-P8141uEnYu3cCiHkOv5436VefQQguuCXZ3rLVk-QnTBb56CNziHQtcfgnr8Gfw.FHrKleD7cFy9_rukAlNOdw; _SESSION=O8KCqRYRPjTEuXF5vo9WoyvnKxACt5q4lVldriAAcs1NMqL3ocErxUDHytEdSiZaAX9eccOTMQLbdjydVwn5UUSQxAeKOq+7+Y7ZtsXm6CfIG2sMoW0p1ULuxJOrdk15CMUyGQxjfpjYCMHcqa+aPlwgLa5eJKhPKDqSq2gu5V7nFkrXMspnX/pi5LbiZe3YSHNP+Stof3jd7nG3d1wnN11NwGrtKtlRlnJUHUY=';
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
