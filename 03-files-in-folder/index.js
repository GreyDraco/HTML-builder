const fs = require('fs');
const path = require('path');
const { readdir, stat } = require('fs/promises');

const folderPath = path.join(__dirname, 'secret-folder');

async function printFiles() {
  try {
    const files = await readdir(folderPath);
    files.forEach(async (file) => {
      const filePath = path.join(folderPath, file);
      const stats = await stat(filePath);

      if (stats.isFile()) {
        const fileSizeInKB = (stats.size / 1024).toFixed(3);
        console.log(
          `${path.basename(file, path.extname(file))}-${path
            .extname(file)
            .slice(1)}-${fileSizeInKB}kb`,
        );
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

printFiles();
