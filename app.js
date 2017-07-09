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
//6. If the file is straightup 'index' then just put it in the root of /build as the index file
//    else, rename the file to index.html BUT put it in a folder that is named after the OG filename
//    ex: about.json -> /build/about/index.html
//    THIS IS WHERE THE PROBLEM IS, you can't return from in an async function (so far as I know),
//    you need a callback to do the deed but I can't figure it out
//    logging 'files' works but returning does not
//    You can see in the console that the content and templates are mixed correctly at least
//    note: the 'replace' is just getting rid the file extension (I'm naming the folder right there)

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
        fsPath.writeFile(`./build/index.html`, templater(contentObj, (files) => {
          // return files;
          console.log(files)
        }));
      } else {
        fsPath.writeFile(`./build/${files[i].replace(/\.[^/.]+$/, "")}/index.html`, templater(contentObj, (files) => {
          // return files;
          console.log(files)
        }));
      }
    }
  }
})