const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')
const glob = require("glob")
const base64Img = require('base64-img')

let config = require('./config.json')

let app = express()

app.use('/', express.static('client'))
app.use('/img', express.static(config.savepath))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: 100000000 
}));

app.get("/gallery", (req, res) => {
  let files = fs.readdirSync(config.savepath)
  let k = 0
  let gallery = []
  for (var i = files.length - 1; i >= 0; i--) {
    if (k == 5) {
      break
    }
    if (files[i].indexOf(".png") > -1) {
      gallery.push("/img/" + files[i])
      k++
    }
  }
  res.json(gallery);
})

function fileCount(){
  return glob.sync(config.savepath + "/*.png", {}).length;
}

app.get("/num", (req, res) => {
    res.json(fileCount());
})

app.post("/ul", (req, res) => {
  let timestamp = new Date() / 1000;
  let filename = config.prefix + "_" + (fileCount() + 1) + "_" + timestamp + ".png";
  let base64Img = req.body.imgBase64.replace("data:image/png;base64,", "");
  fs.writeFile(config.savepath + "/" + filename, base64Img, 'base64', function (err) {
    console.log('File created');
    res.sendStatus(200);
  });
})

app.listen(config.port, function () {
  console.log("")
  console.log(chalk.bold.blue("Fotoboks v0.0.1"))
  console.log(
    chalk.grey("[" + moment().format('HH:mm:ss') + "] ")
    + 'Up and running on port ' + config.port
  )
})