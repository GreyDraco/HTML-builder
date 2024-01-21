const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);

readableStream.on('data', (chunk) => {
  console.log(`content: ${chunk}`);
});

readableStream.on('end', () => {
  console.log('end of content');
});
