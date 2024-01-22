const readline = require('readline');
const fs = require('fs');
const path = require('path');
//creates a new readline.Interface instance
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// getting script directory
const outputFilePath = path.join(__dirname, 'text.txt');
//create write stream
const writeStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

console.log('Welcome! Enter text (type "exit" to stop)');

// listen for user input
rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

// closing stream
rl.on('close', () => {
  console.log('Farewell!');
  process.exit(0);
});

// catch ctrl + c and handle closing,  SIGINT signal is a standard signal emitted when Ctrl+C pressed
process.on('SIGINT', () => {
  console.log('\nCaught interrupt signal. Closing the program.');
  rl.close();
});

// handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});
