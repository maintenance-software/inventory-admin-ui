const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.XiQo-JG_W_RCUCAe9kO0yEmfkO7Fk20r.ytyU_QNGxNHkmp-n.LvqbIK0k0uq5IxZef802sDrqtKmAL9OWHAcEpK6NU8zC1KItHh4_35gbM_ifiToSUFgJ72j7kuTKQQjokzbCLdgWiJgpLkFSUxSQTmFUlM2d8849NSqD7fxngM-aqIuEbcXGTMgqoNvGzCrQ.ojTKTlasfSgE6jJP1JQCuA; _SESSION=q4o4BZwIEqCLI0A0fx/4NKVUQdyOKjyCmqScXzv80lnGLfM/P33hD4mu94N20oeoTrjtikwRkIJHK5sZab6/sBJyVzi58brkoBK1d3wXjMbeaOZnZT1D4tzC/SrFkfEsgoihEOFKvtEwPCC3SrdqzpYnwATr9awdxBuH9SP4+rUyKuo6tpi6vaz/IBOlMSp3N8+4pf2QIZeaFecBTX8xBiy909jMO7ENBJav2Os=';
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
