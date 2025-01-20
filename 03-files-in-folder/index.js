const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

function displayFileInfo() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.log(err.message);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.log(statErr.message);
          return false;
        }
        if (stats.isFile()) {
          const fileSizeInKB = (stats.size / 1024).toFixed(3);
          console.log(
            `${path.basename(file, path.extname(file))}-${path
              .extname(file)
              .slice(1)}-${fileSizeInKB}kb`,
          );
        }
      });
    });
  });
}

displayFileInfo();
