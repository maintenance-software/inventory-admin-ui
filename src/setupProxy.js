const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.CrqPKOxVjp35e9UYaMnrQYNb7GrDquDB.B1nJAgE_IXgTdRxl.8g0XqLOZXmHSB4BY4VM2ON3fVGatyS6NNT-yHtJ1JWLd0TCfCrySgHxcmVmsYgQB8jgNsiqej3guZLKsiO9IYh1TH7u89O3KffTAK4en8PqObXK_sLHVKccuwH5i6Ehe8egQqKMqM6QJ6Akw9z3lT8IfII4z_pCn6ET0ci_mh2s9CJ3zstuiVXi7i7-ckZTW9_CzEIL1mMH2cxfFuWJl_iSihRoW0iThe_-g7RRtyE_1K5UVP9fnWhtqrmdWhd_SMLMS_xwJrMmRrF2g4PPxm7NNqQEpqGZSYYiMiwpuX7MuKALRdFFie5vEjVlVqxCgOUvLM__wiy_Ktx7il7YDdqQLGp9pR-q4zuswlnKsWO63Y1Ajuf157u7VAH0K_2MRW-xUR_PbvXlNahYec4MmkQMgV64jeMI7_2lE05ih4Fu8jIpQI20gwg0M7zdtW7SbQfLY.8raCYcTIB4UTNAyx0v_hVg; _SESSION=HfAdpoYsfYNucxGMQo/pQ/tPo8RF8mzsuqsOBHxjlSZnsQrWAiA9YKDjOY+EGKJLDMSL82Kdb7/pr5XvrGFJfsbtDQxmgA4OYi03HOFRIJioid/m7bkqMeoYNcsSNXfR7Wzl8VgLQ8PZxzE6/ZsHshsrhiYcKA61B79uYirDdXhh3mWy7cZZ8vmJqqyKjNtmV7lmHZ+ZDE4KIcbt4BQtUYdcZJftwhxMDzG+YJ0=';
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
