var nconf = require('nconf');

nconf.argv()
    .env()
    .file('custom', process.env.NODE_ENV && process.env.NODE_ENV == 'production' ? './configProd.json' : './configDev.json')
    .file('default', './config.json');

module.exports = nconf;