const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
const path = require('path');
const {
    config
} = require('process');

let doesExist = file => fs.existsSync(file);

let generateNewDownloadPath = originalDownloadPath => {
    const {
        dir,
        name,
        ext
    } = path.parse(originalDownloadPath);
    const totalDuplicates = fs.readdirSync(dir).filter(file => file.includes(name)).length;
    const newFileName = name + totalDuplicates + ext;
    log(chalk.yellow.bold(`** WARNING - File with this name already exists in directory. Saving file as \'${newFileName}\' **`));
    return dir + '\\' + newFileName;
};

let moveFile = (srcPath, desDir, force) => {
    if (!isValidDirectory(srcPath) || !isValidDirectory(desDir)) {
        log(chalk.red.bold('ERROR! Invalid source or destination path!'));
        process.exit(1);
    }

    let filename = path.basename(srcPath);
    let fullDestPath = desDir + '\\' + filename;

    if (force === undefined) {
        if (doesExist(fullDestPath)) {
            fullDestPath = generateNewDownloadPath(fullDestPath);
        }
    }

    const source = fs.createReadStream(srcPath);
    const dest = fs.WriteStream(fullDestPath);
    source.pipe(dest);
    source.on('end', () => {
        log(chalk.green.bold('[✔] File Successfully Copied!'));
    })
    source.on('error', () => {
        log(chalk.red.bold(err));
    })
}

let fixPath = path => {
    // Replaces special characters in path with HEX values
    let newPath = escape(path).replace(/([a-z])([A-Z])/g, '$1 $2');

    // Stores each sub-directory name
    let result = [];

    // Replace each special HEX values with original characters
    newPath = newPath.split(' ').forEach(part => {
        if (part.includes('%3A')) part = part.split('%3A').join(':\\');
        if (part.includes('%20')) part = part.split('%20').join(' ');
        if (part.includes('%27')) part = part.split('%27').join("'");
        if (part.includes('%2C')) part = part.split('%2C').join(',');
        if (part.includes('%5B')) part = part.split('%5B').join('[');
        if (part.includes('%5D')) part = part.split('%5D').join(']');
        if (part.includes('%0A')) part = part.split('%0A').join('\\n');
        result.push(part);
    });

    // Create final configured path
    newPath = result.join('\\') + '\\';

    // Validate path
    if (!isValidDirectory(newPath)) {
        // If invalid, return current directory
        log(chalk.red("Path could not be fixed!"), chalk.white.bold('-> Saving in current directory instead.'));
        return __dirname + "\\";
    }

    // Else return configured path
    log(chalk.green.bold('[✔] Download path has been fixed'))
    return newPath;
}

let readFile = filePath => {
    return new Promise((resolve, reject) => {
            // Read config.json
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        })
        // If read is successful, return data
        .then(data => JSON.parse(data))
        // Else throw error
        .catch(err => {
            if (err.code === 'ENOENT')
                log(chalk.red.bold('Error! Specified JSON File Not Found.'));
            else
                log(chalk.red(err));
            process.exit(1);
        })
}

module.exports = {
    readFile: readFile,
    doesExist: doesExist,
    fixPath: fixPath,
    generateNewDownloadPath: generateNewDownloadPath,
    moveFile: moveFile
}