const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.lwM5YkMhffNg4PYCt52GexKes6S1unNG.yCw-yU9SDjdqmsC2.1KaRcvzHfasSnCF_uEDksTDRRhERGhAxa8LPPR54kg-bV_gQPmHUkrMzSKeZ54hWKHoK83en2paxM9PhPC68rJ3ZGLsRxUuBomhE0QqDO29nY1hjrETaruGlzfYHqOz8OFXZvo66lygEiXkrnkDiVDet2LQUILUUoMGL5RB4GeRDQl6noV7j4G6Sh-Gr8MAYUQr3sM0ydNXoN4Mo6suyD42fxcIu2JOPgk7YoJm88RyGZGiUsgf5lPThFd4oigSBVxA-Akgvb6miKIl7SWUjy69w9al5uWOjFOcO425KMV-5c9NZj0HGbNzoR2Hk0BA19cXFlaO-P6jjt0jPWfvEmtmfi9e4SzrysF0XTVES9wthyFlwCZKMbgXKD7SOoPzcp1w2zSj5uFclNl7F2a4E0IWX8Lr0YDAoMnhDYBlFQl4KePZGaUiff6ctR-LAm7qhseVa.D87o4zdzkKQ7yYk7ryeqyA; _SESSION=PSfCGOf/koqbIgEs2RGaehimW/hlIAm+VWeXo5Z3d2AWJiL3m0e6ngMJrXaeR6Pw6a2B7bdzZ6keZh8hcLWxRJVDY2Or16D/ihmtegw2NvM6WX8o1v22e/62olhHoJszvMu5Cy+cMrmvRPmfuZTfXVPcH8icgo1iOYKAvprWkbFOuHUBeRkFKhfbuBeUj8vUXi+0TvvXNsY3ii+j9tyCHpOD4upaXfRvxRa9Kjo=';
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
