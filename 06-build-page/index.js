const fs = require('fs').promises;
const path = require('path');

async function copyDir(sourceFolderPath, copyFolderPath) {
  try {
    await fs.mkdir(copyFolderPath, { recursive: true });

    const items = await fs.readdir(sourceFolderPath, { withFileTypes: true });

    for (const item of items) {
      const sourceItemPath = path.join(sourceFolderPath, item.name);
      const copyItemPath = path.join(copyFolderPath, item.name);

      if (item.isDirectory()) {
        await copyDir(sourceItemPath, copyItemPath);
      } else {
        await fs.copyFile(sourceItemPath, copyItemPath);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function generateStylesBundle() {
  const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
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
  } catch (error) {
    console.log(error.message);
  }
}

async function createProjectDistFolder() {
  const projectDistPath = path.join(__dirname, 'project-dist');

  try {
    await fs.stat(projectDistPath);
    console.log('project-dist folder already exists.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(projectDistPath);
    } else {
      console.log(error.message);
    }
  }
}

async function saveTemplate() {
  const templatePath = path.join(__dirname, 'template.html');

  try {
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    return templateContent;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

function findTagNames(templateContent) {
  const tagRegex = /\{\{([^{}]+)\}\}/g;
  const tagMatches = templateContent.match(tagRegex);
  const tagNames = tagMatches
    ? tagMatches.map((match) => match.slice(2, -2).trim())
    : [];

  return tagNames;
}

async function replaceTemplateTags(templateContent) {
  for (const tagName of findTagNames(templateContent)) {
    const componentPath = path.join(__dirname, 'components', `${tagName}.html`);

    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');

      templateContent = templateContent.replace(
        new RegExp(`\\{\\{${tagName}\\}\\}`, 'g'),
        componentContent,
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  return templateContent;
}

async function writeModifiedTemplate(modifiedTemplate) {
  const indexPath = path.join(__dirname, 'project-dist', 'index.html');

  try {
    await fs.writeFile(indexPath, modifiedTemplate, 'utf-8');
  } catch (error) {
    console.log(error.message);
  }
}

async function main() {
  try {
    await createProjectDistFolder();

    const templateContent = await saveTemplate();

    if (templateContent !== null) {
      const modifiedTemplate = await replaceTemplateTags(templateContent);

      await writeModifiedTemplate(modifiedTemplate);
      await generateStylesBundle();
      const assetsSourceFolderPath = path.join(__dirname, 'assets');
      const assetsCopyFolderPath = path.join(
        __dirname,
        'project-dist',
        'assets',
      );
      await copyDir(assetsSourceFolderPath, assetsCopyFolderPath);
    } else {
      console.log('Error: Unable to read template content.');
    }
  } catch (error) {
    console.log(error.message);
  }
}

main();
