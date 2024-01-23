const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'files-copy');

  try {
    // Create the copy folder if it doesn't exist
    await fs.mkdir(copyFolderPath, { recursive: true });

    // Read the contents of the source folder
    const sourceFiles = await fs.readdir(sourceFolderPath);

    // Read the contents of the copy folder
    const copyFiles = await fs.readdir(copyFolderPath);

    // Identify files to remove from the copy folder
    const filesToRemove = copyFiles.filter(
      (file) => !sourceFiles.includes(file),
    );

    // Remove files from the copy folder
    const removePromises = filesToRemove.map((file) =>
      fs.unlink(path.join(copyFolderPath, file)),
    );
    await Promise.all(removePromises);

    // Copy each file from the source to the copy folder
    const copyPromises = sourceFiles.map((file) => {
      const sourceFilePath = path.join(sourceFolderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      return fs.copyFile(sourceFilePath, copyFilePath);
    });

    // Wait for all file copying promises to resolve
    await Promise.all(copyPromises);

    console.log('Successes!');
  } catch (err) {
    console.error('Error copying files:', err.message);
  }
}

copyDir();
