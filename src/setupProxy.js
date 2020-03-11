const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.bIaUZU0Vbp3ER16jDiVZUWcd3UTFFB4d.jSAspCxFMmhIys6p.GLFtuTzjZNAfzSwGRmdqd2Ze3eslGywhUdE4gu6EzP25no8HcuB-waeGYWjes0AyUhu7PpResthwqBdo3zHs7OgZzOA-UC2CZWhUgmGqlIib4pvBggNVr5wJORYnZBI-mEjsgObC-x3OO5c4aYzyGLDBHDjMU1keRVoDpt-XJSTB0ZSR98Yqmlt_whqgOvjLJtEWrx5kiit1HeXFZ_P5Egs4Kwti5v0YhFRkZsm0TajyEum8PsAb9WY7mQ1X9GFu0KWrNtOFj0YDjBLeWZ-bhU1v64LxvdHBuXTK6egSvvXwG2E87EVIpwGRvydjNfHvmHhRQMHaKMJFuf3HAA1040jgAQFGdky76cnHLIW2C32JnQgM-qaU5DGyQMQYJaWv-BufJf77IZ-jpQ0qIfjR8-wAhTE0K2EgxQhi8d7JhSWW9opsIdWmOgEitntzmgu-vjMQ.f65EGX3Yz6Gq0f9I3dYcHw; _SESSION=5YNAZUsJe4v8VxhT4r+5WIs/q4JjiC3ksSwjP49Ih9l2CT398Bp3iU0upvLlqjveG9g6UjrgFNV+J2BF7B4gmRMAJwIGw77cJi1RyIojabFTw/Vm+51bID+Om00ryGl+I0zNimOmNUFKoZTn0o3j/AwCiWvTNjiJd6I19CZWHB5ozfqDjYqGcGl3bZuc631WlrtGVfRbkmNARQDzZ0HrYvNl75gfLbd/A4UDEV8=';
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
