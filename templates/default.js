'use strict';

module.exports = (contentObj) => `
  <html>
    <head>
      <title>${ contentObj.title }</title>
    </head>
    <body>
      <p>Default Template</p>
      ${ contentObj.content }
    </body>
  </html
`;