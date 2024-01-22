const fs = require('fs').promises;
const path = require('path');

async function copyDir(sourceFolderPath, copyFolderPath) {
  try {
    // Create the copy folder if it doesn't exist
    await fs.mkdir(copyFolderPath, { recursive: true });

    // Read the contents of the source folder
    const items = await fs.readdir(sourceFolderPath, { withFileTypes: true });

    // Copy each item from the source to the copy folder
    for (const item of items) {
      const sourceItemPath = path.join(sourceFolderPath, item.name);
      const copyItemPath = path.join(copyFolderPath, item.name);

      if (item.isDirectory()) {
        // If it's a directory, recursively copy its contents
        await copyDir(sourceItemPath, copyItemPath);
      } else {
        // If it's a file, copy it
        await fs.copyFile(sourceItemPath, copyItemPath);
      }
    }
  } catch (err) {
    console.error('Error copying files:', err.message);
  }
}

async function generateStylesBundle() {
  const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
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
    } else {
      console.error('Error checking project-dist folder:', error.message);
    }
  }
}

async function saveTemplate() {
  const templatePath = path.join(__dirname, 'template.html');

  try {
    // Read the content of the template file
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    // Save the content to a variable
    return templateContent;
  } catch (error) {
    console.error('Error reading template file:', error.message);
    return null;
  }
}

function findTagNames(templateContent) {
  // Use a regular expression to find all template tags
  const tagRegex = /\{\{([^{}]+)\}\}/g;
  const tagMatches = templateContent.match(tagRegex);

  // Extract tag names from matches
  const tagNames = tagMatches
    ? tagMatches.map((match) => {
        // Remove double curly braces and trim whitespaces
        return match.slice(2, -2).trim();
      })
    : [];

  return tagNames;
}

async function replaceTemplateTags(templateContent) {
  // Iterate over each tag in the template content
  for (const tagName of findTagNames(templateContent)) {
    // Construct the path to the component file based on the tag name
    const componentPath = path.join(__dirname, 'components', `${tagName}.html`);

    try {
      // Read the content of the component file
      const componentContent = await fs.readFile(componentPath, 'utf-8');

      // Replace the template tag with the component content in the template content
      templateContent = templateContent.replace(
        new RegExp(`\\{\\{${tagName}\\}\\}`, 'g'),
        componentContent,
      );
    } catch (error) {
      console.error(
        `Error reading component file (${tagName}.html):`,
        error.message,
      );
    }
  }

  return templateContent;
}

async function writeModifiedTemplate(modifiedTemplate) {
  const indexPath = path.join(__dirname, 'project-dist', 'index.html');

  try {
    // Write the modified template to the index.html file
    await fs.writeFile(indexPath, modifiedTemplate, 'utf-8');
  } catch (error) {
    console.error(
      'Error writing modified template to index.html:',
      error.message,
    );
  }
}

async function main() {
  try {
    // Call the function to create the project-dist folder
    await createProjectDistFolder();

    // Call the function to save the template content
    const templateContent = await saveTemplate();

    // Check if the template content is available
    if (templateContent !== null) {
      const modifiedTemplate = await replaceTemplateTags(templateContent);

      // Call the function to write the modified template to index.html
      await writeModifiedTemplate(modifiedTemplate);
      // Call the function to generate the styles bundle (style.css)
      await generateStylesBundle();
      // Call the function to copy assets to project-dist folder
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
    console.error('Error:', error.message);
  }
}

main();
