const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')
const glob = require("glob")

let config = require('./config.json')

let app = express()

let savepath = config.savepath

let detectedUsb = false

if(config.pi_autodetect){
  let basepath = config.pi_path
  let folders = fs.readdirSync(basepath)
  for(let usbpath of folders){
    if(usbpath != "SETTINGS" && usbpath != "SETTINGS1" && usbpath != "SETTINGS2"){
      savepath = basepath + "/" + usbpath;
      detectedUsb = true;
      break;
    }	
  }
}

app.use('/', express.static('client'))
app.use('/img', express.static(savepath))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: 100000000 
}));

app.get("/gallery", (req, res) => {
  let files = fs.readdirSync(savepath)
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

app.get("/info", (req, res) => {
  let info = {}
  info.savepath = savepath
  info.detectedUsb = detectedUsb
  res.json(info);
})

function fileCount(){
  return glob.sync(savepath + "/*.png", {}).length;
}

app.get("/num", (req, res) => {
    res.json(fileCount());
})

app.post("/ul", (req, res) => {
  let timestamp = new Date() / 1000;
  let filename = config.prefix + "_" + (fileCount() + 1) + "_" + timestamp + ".png";
  let base64Img = req.body.imgBase64.replace("data:image/png;base64,", "");
  fs.writeFile(savepath + "/" + filename, base64Img, 'base64', function (err) {
    console.log('File created');
    res.sendStatus(200);
  });
})

app.listen(config.port, function () {
  console.log("")
  console.log(chalk.bold.blue("Fotoboks v2.0.0"), chalk.grey("by Jonas Kleinkauf"))
  console.log(
    chalk.grey("[" + moment().format('HH:mm:ss') + "] ")
    + 'Up and running on port ' + config.port
  )
})