const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.3CQ5F-h9zaJnzE7DSG_bh7I6_kIrQBPn.knB9UxVgboVXD78p.NV8Ohg8Xg9mNMgeXeUqd5OfmADOmqb1t2PQ2jPyHJB57LQOlrcxlGMckg3PeAQwbIjn5ngra2l8QP41gamT38he9h5GBumwpyc6KJ7deFRLgdi9nS9_4wIN2cmb6eqbFHMC_f_GuqdYz7sxQEw.F5REvJS0_V1Yrb9OFuK7Kw; _SESSION=1BzS2l6wtAosfQuPRTVFV0dkw+KXCTs1ef8icE5HyTvJfhJy7opGvgRite98sWjpTEatLN+aPKONjVGOVLgG/WtbKiQscBA71TH58B2joxzA2E/1UmCx/I1dUAdqEYYwV+QilG1Ye2WbJRtX795wIP6nCw1oKWkoYQx3QEPOWbOIkkiwjA6MNaByFXy8ovLlMBSx2A8Unkek8AYsF0JYMBouGdIHunFrY3Or3gk=';
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
