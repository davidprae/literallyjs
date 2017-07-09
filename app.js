'use strict';

//requires
const fs = require('fs'),
      path = require('path'),
      fsPath = require('fs-path'), //easy way to write to a file and create needed dirs
      yaml = require('js-yaml'), //for converting YAML to JSON
      express = require('express'),
      templater = require('./templates'); //the module that combines a content page with a layout

const app = express(),
      port = 8080;

//serve from static directory 'build'
app.use(express.static('build')); 

//set up server
app.listen(port, (err) => {
  if(err) return err;
  console.log(`App listening on port ${port}`);
})

//1. reads the /content directory, finds the files in it,
//2. 'for' each of those files:
//3. check if it's JSON or YAML,
//4. get the contents of the file with readFileSync,
//5. appropriately transform the content if json or yaml into a plain JS object
//6. Create the file. If the file is straightup 'index' then just put it in the root of /build as the index file
//    else, rename the file to index.html BUT put it in a folder that is named after the OG filename
//    ex: about.json -> /build/about/index.html

//1
fs.readdir('./content', (err, files)=> {

  //2
  for(let i = 0; i < files.length; i++) {

    //3
    if(path.extname(files[i]) == '.json' || '.yml') {

      //4
      let contentObj = fs.readFileSync(`./content/${files[i]}`, 'utf8');

      //5
      switch(path.extname(files[i])) {
        case '.json' :
          contentObj = JSON.parse(contentObj);
          break;
        case '.yml' :
          contentObj = yaml.safeLoad(fs.readFileSync(`./content/${files[i]}`, 'utf8'));
          break;
        default:
          'error'
          break;
      }

      //6
      if(files[i].replace(/\.[^/.]+$/, "") == 'index') {
        templater(contentObj, `./build/index.html`, createFile );
      } else {
        templater(contentObj, `./build/${files[i].replace(/\.[^/.]+$/, "")}/index.html`, createFile );
      }
    }
  }
})

const createFile = (directory, content) => {
  fsPath.writeFile(directory, content);
}