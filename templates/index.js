'use strict';

const fs = require('fs'),
      path = require('path');

//This just gets a list of the files in the /templates directory
//Need this list to compare and match to contentObj.template ('template' property of a content page)
//Using a callback because you can't 'return' from an asynchronous function
const getTemplateFileNames = (callback) => {
  fs.readdir('./templates', (err, files) => {
    if(err) `Error: ${ err }`;
    callback(files);
  });
}

//This matches a content page (coming from 'contentObj')
//with a template by comparing the list of available templates (from getTemplateFileNames)
//and then requires in that "template" (which is technically a module / function) and passes the contentObj
//to the "template" (which again, is really a module / function)
//returns the result which is the compiled page
const makePage = (files, contentObj) => {
  let template = `${contentObj.template}.js`; 
  for(let i = 0; i < files.length; i++) {
    if(path.extname(files[i]) == '.js') {
      if(template == files[i]) {
        let templateModule = require(`./${template}`);
        return templateModule(contentObj);
      }
    }
  }
}

//this is the function that is actually exported when requiring this file.
//take an object which is the object'd version of a JSON or YAML file, called from app.js
//note that this 'callback' is defined in app.js (just an anon function)
module.exports = (contentObj, callback) => {
  getTemplateFileNames((files) => {
    callback(makePage(files, contentObj));
  })
}
