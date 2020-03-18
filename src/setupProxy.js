const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.vuJebG49pFU0iUyiUJAf7ViXBQGuHP7Q.a6tbgFYWw874MS5x.5t4cZGtYwR8ndzcM3P3jIhs7yUH3tx4BLGRKujMqgCdu0Ws02oKk61NbxznqPn18EdbPTccM-EGl-s7sAP3O-Glk2xSiMPiCbrRpxOLUDHq3tEaZllje0c2hZZLIgTHnPl_W5UJ6p9UwywQyCb6nzKL4mxrgrhegWi4XQRpb6d1TQcydXAkRd1oOPyZsOzqZXJeveZy4CWZFB-5PwMUcrzQmb0JfQ1tjB-pq4fgWYnTCnhOfA135treLCSBFuUYqv1swYufaL4ebN3GxVSZzLUzXAo8bkzoI20Eh5v41OLUam-AH8EBBQjHLX_mtsxLrOGIIUo7xYFEi75KQ-OTYRBc1_BtyertECm7kjeIH7Cu0uY9FuQYCmzMXBFdxcOhK78kP3E8mWn6LJtEwxXTqk8F1hL7-oV4VeuPCP5RTtBezAloU6hPzZ87orrP7g_lgdkwT.GGEshCVZdZbBsVKaNoWglg; _SESSION=UWwJB4EKwgx0i320cfMM8ViBy+2Ks54aGpRwehOwWP0YYimEC2zQVOxcPyC2unEfj+8u8aQn/dfD1bdO9lPi2z3nUEMyejCLqt3OEYsrLuY64F8WN4YB7PyEPpleIXQgiAo5eQUyinNK1qGaoxKW40WRYiW1fYgHJu6h0ai42P+aqmSjvQpzyPvgOrKvknq1oKgDH5K2NVqHD2OGDPnr9H80hz9kjgztkLF30O0=';
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
