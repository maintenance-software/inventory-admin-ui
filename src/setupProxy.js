const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.XhzQWzX96ne766Hs6GODHOLCrFCH6aq7.rKe1J6ZisE246XQt.52AVgZDozX6_th40jdiZsGHEAhaDgsYQmrfbTvtGNr1pWLKtHIl3KpmFXE7IflqdolCV72M86XPs1QwfZEK23c6fzGNLx_IBG7U6igZq8FckQvyGUVVYIvHGaADyd6yJNjPHh7CoTtJsMLG9BA.0odQOpGEaX81wQc_mkLJMg; _SESSION=bZY9/JG/edzDEPFYHADMk7a+BNAEpU/HQEPIe2kDzVo96D9dN7xQiWb0vE7EysXXtcK2g/5ujY0IpWrIHFfL/mYsym+jP5u8fB/FI54quTFd8d+vMLPypCJlNxbhPQ3uIpFQQKUzsHChvTo6L64rrysZp3hnph8mteoZlvnFKmUaJ1WFNxaEMSpE2F7oNRGsKbMAgTQEaKpJfhELvSNa/PL8iKaMoqsNZaMKiZ4=';
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
