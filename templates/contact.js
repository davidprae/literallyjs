'use strict';

module.exports = (contentObj) => `
  <html>
    <head>
      <title>${ contentObj.title }</title>
    </head>
    <body>
      ${ contentObj.content }
      <footer>This is the contact template.</footer>
    </body>
  </html
`;