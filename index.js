let express = require('express')
let chalk = require('chalk')
let moment = require('moment')
let config = require('./config.json')

let app = express()
express.static.mime.define({'application/json': ['json']});

app.use('/', express.static('client'));
app.use('/img', express.static(config.savepath));


function rawBody(req, res, next) {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function (chunk) {
        req.rawBody += chunk;
    });
    req.on('end', function () {
        next();
    });
}
app.use(rawBody)

app.get("/gallery", (req, res) => {

})

app.post("/ul", (req, res) => {

})

app.listen(config.port, function () {
    console.log("");
    console.log(chalk.bold.blue("Fotoboks v0.0.1"));
    console.log(
        chalk.grey("[" + moment().format('HH:mm:ss') + "] ")
        + 'Up and running on port ' + config.port
    )
})