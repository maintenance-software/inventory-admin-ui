const proxy = require('http-proxy-middleware');
console.log('setting proxy test');
var cookieValue = 'bsid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiQTEyOEtXIn0.NjL1sWEhLJqOrTa4k8ESln7NgW0qvaZw.zrnn9U4kHXoXBFIu.8EhKtpqd6P6tIujnDt1GccDWtGrG6QtQscVEB-WO-EkzgmGgizSXjG4oBNswRe7E5Z3gJbHfqX1FZj69itANGP-Hv-Z81oWJxS1HGrMuPMTvQ-UjpU3pIbSNEU6vl3Bj_Eh4EIkBQvXePgiqzodo9i69tnsuc5YHwJsuUz9OWTnNIJmC2fCyrKlld3lCCVdkBOZpXe53gsAAjBS6GNOQ61A8CFLzU43iL8bzTscgtLoZd__htYVgZb-BNxSop8I-TFfprJWoSjaAbJcbwdF975GJBHxVQtKMWgyn477EE5y68sFJ0oNdBHUOSsEhWZfUbMPhleVvj98rgCv4Lpte73K9I-SyP_2QyaS6QfhgkOrvksV_1doGpbhHGiGtFALAtNtTH0zMR27xnxvlg4ibP3J732BuPDwf2vNCI7v6SM34ezvnxCinDOM7R8GPTQLDzS8O.--yMBBRFwm6DsYy0HLKrSg; _SESSION=CMjW8r4vMIawQJnhtsk9akrJkyDcfHoeDZEd8oZZG94i5+lRNKAOFvOjVpTl20rPUrrve2mkEjcOu83uDUn4rt11kd1T8+AEhcd6eqUJZrN0WsdEd61rx31HmrSbn7Y9vm4i/b5uM6JJy7XX/dJTfF6r3UXjbwcqD/Q/GH658OSWmsolcP5JN0LGezHcFx9i1KUcyRjnwPL7oMxqjNbum+GxvIM1VXJfCJGLtYQ=';
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
