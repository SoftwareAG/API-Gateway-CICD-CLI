#!/usr/bin/env node

const chalk = require('chalk');
const log = console.log;
const program = require('commander');
const pjson = require('./package.json');
const {
    get,
    post
} = require('./src/restHandler');
const {
    doesExist,
    generateNewDownloadPath,
    moveFile,
    readFile
} = require('./src/fileSystemHandler');

program
    .version(pjson.version)

program
    .command('export <filePath> [downloadPath] [force]')
    .alias('e')
    .description('Send a GET request')
    .action((filePath, downloadPath = process.cwd(), force) => {
        // Check for missing arguments
        if (typeof filePath === 'undefined' || !doesExist(filePath)) {
            log(chalk.red("Error! Cannot find `config.json`. Please provide correct path."));
            process.exit(1);
        } else {
            // Read config.json
            readFile(filePath)
                // Read successful
                .then(data => {
                    log(chalk.green('[✔] Read config.json'));

                    // Check if a download path is explicitly provided and not invalid
                    if (downloadPath !== process.cwd() && !doesExist(downloadPath)) {
                        log(chalk.red.bold('** Invalid path. Saving in current directory. **'));
                        downloadPath = process.cwd();
                    }

                    // If not present already, add '\\' to the end of download path
                    if (!downloadPath.endsWith('\\'))
                        downloadPath += '\\';

                    // If force flag is absent, create duplicate if file is already present
                    if (force === undefined) {
                        downloadPath = generateNewDownloadPath(downloadPath)
                    }

                    // Make GET request
                    get(data, downloadPath);
                })
                // Read failed
                .catch(err => log(chalk.red(err)));
        }
    })

program
    .command('import <filename> <attachment>')
    .alias('i')
    .description('Send a POST request')
    .action((fileName, attachment) => {

        // Check for missing arguments
        if (typeof fileName === 'undefined' || typeof attachment === 'undefined') {
            log(chalk.red("Error! Both `filename` and `attachment` are required parameters."));
            process.exit(1);
        } else {
            // Check if config.json exists
            if (!doesExist(fileName)) {
                log(chalk.red.bold(`Error! config.json not found. Please try again.`));
                process.exit(1);
            }
            // Read config.json
            readFile(fileName)
                // Read successful
                .then(data => {
                    // Print config.json
                    log(chalk.green('[✔] Read config.json'));

                    // Check if attachment exists
                    if (doesExist(attachment)) {
                        // Make POST request
                        post(data, attachment);
                    } else {
                        log(chalk.red.bold(`Error! ${attachment} not found.`));
                    }
                })
                // Read failed
                .catch(err => log(chalk.red(err)));
        }
    })

program
    .command('copy <srcPath> <destDir> [force]')
    .alias('cp')
    .description('Copy file from src to dest')
    .action((srcPath, destDir, force) => {
        if (srcPath === undefined || destDir === undefined) {
            log(chalk.red.bold('Error! Missing source or destination path.'))
            process.exit(1);
        }
        moveFile(srcPath, destDir, force);
    })

program.parse(process.argv);