const { default: ipinfoMiddleware } = require("ipinfo-express");

const ipinfoService = ipinfoMiddleware({
    token: process.env.IPINFO_TOKEN,
    cache: null,
    timeout: 5000,
    ipSelector: null
});

module.exports = ipinfoService;