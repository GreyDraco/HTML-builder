const readline = require('readline');
const fs = require('fs');
const path = require('path');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const outputFilePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

console.log('Welcome! Enter text (type "exit" to stop)');

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('close', () => {
  console.log('Farewell!');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nCaught interrupt signal. Closing the program.');
  rl.close();
});

process.on('uncaughtException', (err) => {
  console.log(err.message);
  process.exit(1);
});
