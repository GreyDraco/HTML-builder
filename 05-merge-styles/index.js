const fs = require('fs').promises;
const path = require('path');

async function generateStylesBundle() {
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  const stylesPath = path.join(__dirname, 'styles');

  try {
    await fs.writeFile(bundlePath, '');

    const styleFiles = await fs.readdir(stylesPath, {
      withFileTypes: true,
    });

    styleFiles.forEach(async (styleFile) => {
      const fileName = styleFile.name;
      const filePath = path.join(stylesPath, fileName);

      if (!styleFile.isFile() || path.extname(fileName) !== '.css') {
        return;
      }

      const fileContent = await fs.readFile(filePath, 'utf-8');
      await fs.appendFile(
        bundlePath,
        `/* Source: ${fileName} */\n${fileContent}\n`,
      );
    });

    console.log('Styles bundle created successfully!');
  } catch (error) {
    console.log(error.message);
  }
}

generateStylesBundle();
