'use strict';

//requires
const fs = require('fs'),
      path = require('path'),
      fsPath = require('fs-path'), //easy way to write to a file and create needed dirs
      yaml = require('js-yaml'), //for converting YAML to JSON
      express = require('express'),
      templater = require('./templates/default');

const app = express(),
      port = 8080;

//serve from static directory 'build'
app.use(express.static('build'));

//set up server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})

//transform files in /content from json or yaml to js objects pass, them to render function and then create files from result and put in /build
fs.readdir('./content', (err, files)=> {
  for(let i = 0; i < files.length; i++) {
    if(path.extname(files[i]) == '.json') {
      let contentObj = fs.readFileSync(`./content/${files[i]}`, 'utf8');
      contentObj = JSON.parse(contentObj);
      if(files[i] == 'index.json') {
        fsPath.writeFileSync(`./build/index.html`, templater(contentObj));
      } else {
        fsPath.writeFileSync(`./build/${files[i].replace(/\.[^/.]+$/, "")}/index.html`, templater(contentObj));
      }
    } else if(path.extname(files[i]) == '.yml' ) {
      let contentObj = yaml.safeLoad(fs.readFileSync(`./content/${files[i]}`, 'utf8'));
      if(files[i] == 'index.yml') {
        fsPath.writeFileSync(`./build/index.html`, templater(contentObj));
      } else {
        fsPath.writeFileSync(`./build/${files[i].replace(/\.[^/.]+$/, "")}/index.html`, templater(contentObj));
      }
    }
  }
})