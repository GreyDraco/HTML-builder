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

async function generateStylesBundle() {
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  const stylesPath = path.join(__dirname, 'styles');

  try {
    // Initialize or clear bundle.css
    await fs.writeFile(bundlePath, '');

    const styleFiles = await fs.readdir(stylesPath, {
      withFileTypes: true,
    });

    styleFiles.forEach(async (styleFile) => {
      const fileName = styleFile.name;
      const filePath = path.join(stylesPath, fileName);

      if (!styleFile.isFile() || path.extname(fileName) !== '.css') {
        return; // Skip directories and non-CSS files
      }

      const fileContent = await fs.readFile(filePath, 'utf-8');
      await fs.appendFile(
        bundlePath,
        `/* Source: ${fileName} */\n${fileContent}\n`,
      );
    });

    console.log('Styles bundle created successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function createProjectDistFolder() {
  const projectDistPath = path.join(__dirname, 'project-dist');

  try {
    // Check if the project-dist folder exists
    await fs.stat(projectDistPath);
    console.log('project-dist folder already exists.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the folder doesn't exist, create it
      await fs.mkdir(projectDistPath);
      console.log('project-dist folder created successfully.');
    } else {
      console.error('Error checking project-dist folder:', error.message);
    }
  }
}

createProjectDistFolder();
