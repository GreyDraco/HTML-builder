const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(copyFolderPath, { recursive: true });

    const sourceFiles = await fs.readdir(sourceFolderPath);

    const copyFiles = await fs.readdir(copyFolderPath);

    const filesToRemove = copyFiles.filter(
      (file) => !sourceFiles.includes(file),
    );

    const removePromises = filesToRemove.map((file) =>
      fs.unlink(path.join(copyFolderPath, file)),
    );
    await Promise.all(removePromises);

    const copyPromises = sourceFiles.map((file) => {
      const sourceFilePath = path.join(sourceFolderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      return fs.copyFile(sourceFilePath, copyFilePath);
    });

    await Promise.all(copyPromises);

    console.log('Successes!');
  } catch (err) {
    console.error('Error copying files:', err.message);
  }
}

copyDir();
