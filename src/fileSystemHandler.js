const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
const path = require('path');
const {
    config
} = require('process');
const {
    timeStamp
} = require('console');

let doesExist = file => fs.existsSync(file);

let generateNewDownloadPath = originalDownloadPath => {
    if (fs.lstatSync(originalDownloadPath).isDirectory()) {
        originalDownloadPath += 'getResponse.zip'
    }

    const {
        dir,
        name,
        ext
    } = path.parse(originalDownloadPath);
    let totalDuplicates = fs.readdirSync(dir).filter(file => file.includes(name)).length;

    let newFileName = '';
    if (totalDuplicates === 0)
        newFileName = name + ext;
    else {
        newFileName = name + totalDuplicates + ext;
        log(chalk.yellow.bold(`** File already exists. Saving file as \'${newFileName}\' **`));
    }

    return dir + '\\' + newFileName;
};

let moveFile = (srcPath, desDir, force) => {
    if (!doesExist(srcPath)) {
        log(chalk.red.bold('Error! Source path does not exist!'));
        process.exit(1);
    }

    if (!doesExist(desDir)) {
        log(chalk.red.bold('Error! Destination directory does not exist!'));
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
    generateNewDownloadPath: generateNewDownloadPath,
    moveFile: moveFile
}