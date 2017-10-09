import fs from 'fs';

const ignoreFiles = ['yarn.lock', 'package.json', 'index.js', '.gitignore'];

/**
 * Ignores directories for now, should be extended to handle recursion through dirs?
 * Couldn't be bothered
 */
export default directory => new Promise((resolve, reject) => {
  fs.readdir(directory, (error, filenames) => {
    if (error) reject(error);

    const files = {};

    filenames.forEach(filename => {
      const stats = fs.statSync(directory + filename);
      if (stats.isDirectory() || ignoreFiles.includes(filename)) return;

      const content = fs.readFileSync(directory + filename, 'utf-8');

      files[filename] = content;
    });

    resolve(files);
  });
});
