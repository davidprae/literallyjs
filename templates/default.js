'use strict';

module.exports = (contentObj) => `
  <html>
    <head>
      <title>${ contentObj.title }</title>
    </head>
    <body>
      ${ contentObj.content }
    </body>
  </html
`;