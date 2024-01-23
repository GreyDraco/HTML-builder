const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

function displayFileInfo() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err.message);
      return;
    }

    // Filter out directories, keeping only files
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error('Error checking file stats:', statErr.message);
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
