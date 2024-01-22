const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'files-copy');

  try {
    // Create the copy folder if it doesn't exist
    await fs.mkdir(copyFolderPath, { recursive: true });

    // Read the contents of the source folder
    const files = await fs.readdir(sourceFolderPath);

    // Copy each file from the source to the copy folder
    for (const file of files) {
      const sourceFilePath = path.join(sourceFolderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      await fs.copyFile(sourceFilePath, copyFilePath);
    }

    console.log('Successes!');
  } catch (err) {
    console.error('Error copying files:', err.message);
  }
}

copyDir();
