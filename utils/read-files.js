import fs from 'fs';

// This is starting to get a bit out of control
const ignoreFiles = [
  'yarn.lock',
  'package.json',
  'index.html',
  'index.js',
  '.gitignore',
  'out.json',
  'viz.js',
];

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
