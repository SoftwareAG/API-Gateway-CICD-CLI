const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
const path = require('path');

let doesExist = file => fs.existsSync(file);

let removeFilenameFromDownloadPath = downloadPath => {
    const {
        dir,
        name,
        ext
    } = path.parse(downloadPath);
    if (name !== '' && ext !== '') {
        console.log('Download path should not contain a filename.')
        downloadPath = dir;
    }
    return downloadPath;
}

let generateNewDownloadPath = (originalDownloadPath, fileName) => {
    if (!(fs.existsSync(originalDownloadPath) && fs.lstatSync(originalDownloadPath).isDirectory())) {
        log(chalk.red('Invalid Download Path'));
    }
    // If file ends with . and not a proper extension. Example - getResponse.
    if (path.extname(fileName) === '.')
        fileName = fileName.slice(0, -1) + '.zip';
    // If fileName has no extension, append '.zip' to the end
    if (!path.extname(fileName))
        fileName += '.zip';

    let newFileName = fileName;
    do {
        let {
            name,
            ext
        } = path.parse(newFileName);
        let totalDuplicates = fs.readdirSync(originalDownloadPath).filter(file => file.includes(name) && path.extname(file) === ext).length;
        if (totalDuplicates === 0)
            newFileName = name + ext;
        else {
            newFileName = name + " - Copy (" + totalDuplicates + ")" + ext;
            log(chalk.yellow.bold(`** File already exists. Saving file as \'${newFileName}\' **`));
        }
    } while (fs.existsSync(originalDownloadPath + newFileName));

    return originalDownloadPath + newFileName;
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

    if (!force) {
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

let fixFileName = fileName => {
    // If file ends with . and not a proper extension. Example - getResponse.
    if (path.extname(fileName) === '.')
        fileName = fileName.slice(0, -1) + '.zip';
    // If fileName has no extension, append '.zip' to the end
    if (!path.extname(fileName))
        fileName += '.zip';
    return fileName;
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
    fixFileName: fixFileName,
    generateNewDownloadPath: generateNewDownloadPath,
    moveFile: moveFile,
    removeFilenameFromDownloadPath: removeFilenameFromDownloadPath
}