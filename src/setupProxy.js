const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.5OQo2F9BLa3LFE0GKmJkO7tuSLTuJV42.2bWFVvUBiJ3yoFjN.bMJPdHlAd7mcE23jCkc_QuhDuuMzTLwe3JfmHImOb7UAeRA5MFFnN8v1jBoHp4JLATuIiyN70k_3OYwmM0422ityLYmRe-II5GHnHP7v6zjsgsRQQRJXKyhDIF9YFsYK9Z1ZnUfJT6bWLe_aRdGz9_4HHS09SudlOKZUcaIuTidXZog4TtCfwVIzTgR3ui_1jsls4S1uvu3f67cYfIRcBlFiwpYFYEb7VG8xP9SR8YsaDgjvbKcIHYrjThj00_SuszYQPNbaVgE4SEHr7tJScvI7wiazR396Z9JYrPYsdvPDWLNSRKk0sKHlnRunhfWd8IqTZofEgYQqM4B6VJMoYrrV5sb3HY3Y7QCN0ppEOGfUoh7mv3SE72uVcfwYmzYljSsJlqg3rJgTEfrPnKYwrDTwJdqQgzwve9_qcMOJNe3rlycvXbdF906-ICOzWDdq__w.4lGuk3niut5uDUd7-40zBA; _SESSION=RfAZU6SHQN37d6Cp7FaAVmR2zJTSuKYMLlAniUPHwh4ZkMYA+iTUstx6myXo7d6ps0s8jsTEyBJ/PJDG+nSDguA4xebC361FRA6LPBNSH5YFd+CYHe6HMeZvryiOY9GNAiyfUSshpHS92jR7LKC2VIdWcgyqtHJ86dwv6HLCPhDtbjtg6fxGKVvpGz7yUpZb422wC9nwnqgPrJW/95oecNPWog1noQr0ADupGrM=';
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
