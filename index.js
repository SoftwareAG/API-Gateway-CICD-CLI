#!/usr/bin/env node

const chalk = require('chalk');
const log = console.log;
const program = require('commander');
const pkgJson = require('./package.json');
const {
    get,
    post
} = require('./src/restHandler');
const {
    doesExist,
    fixFileName,
    generateNewDownloadPath,
    moveFile,
    readFile,
    removeFilenameFromDownloadPath
} = require('./src/fileSystemHandler');

program
    .version(pkgJson.version);

program
    .command('export <filePath>')
    .alias('e')
    .description('Send a GET request')
    .option('-d, --downloadDir <dir>', 'Set download directory for GET response', process.cwd())
    .option('-f, --force', 'If file exists in download directory, it is overwritten', false)
    .option('-n, --filename <name>', 'Name to save GET response with', 'getResponse')
    .action((filePath, options) => {
        let {
            downloadDir: downloadPath,
            filename: fileName,
            force
        } = options;

        // Check for missing arguments
        if (typeof filePath === undefined || !doesExist(filePath)) {
            log(chalk.red("Error! Cannot find `config.json`. Please provide correct path."));
            process.exit(1);
        } else {
            // Read config.json
            readFile(filePath)
                // Read successful
                .then(data => {
                    log(chalk.green('[✔] Read config.json'));

                    // If download path contains a file name, remove it
                    downloadPath = removeFilenameFromDownloadPath(downloadPath);

                    // Check if download path is invalid
                    if (!doesExist(downloadPath)) {
                        log(chalk.red.bold('** Invalid download path. Saving in current directory. **'));
                        // If specified download path is invalid, set it to current directory
                        if (downloadPath = process.cwd())
                            downloadPath = process.cwd();
                    }

                    // If not present already, add '\\' to the end of download path
                    if (!downloadPath.endsWith('\\'))
                        downloadPath += '\\';

                    // If force flag is absent, create duplicate if file is already present
                    if (!force) {
                        downloadPath = generateNewDownloadPath(downloadPath, fileName)
                    }

                    // Make GET request
                    get(data, downloadPath, fileName);
                })
                // Read failed
                .catch(err => log(chalk.red(err)));
        }
    })

program
    .command('import <filePath> <attachment>')
    .alias('i')
    .description('Send a POST request')
    .option('-d, --downloadDir <dir>', 'Set download directory for POST response', process.cwd())
    .option('-f, --force', 'If file exists in download directory, it is overwritten', false)
    .option('-n, --filename <name>', 'Name to save POST response with', 'postResponse')
    .action((filePath, attachment, options) => {
        let {
            downloadDir: downloadPath,
            filename: fileName,
            force
        } = options;

        // Check for missing arguments
        if (typeof filePath === undefined || typeof attachment === undefined) {
            log(chalk.red("Error! Both `filePath` and `attachment` are required parameters."));
            process.exit(1);
        } else {
            // Check if config.json exists
            if (!doesExist(filePath)) {
                log(chalk.red.bold(`Error! config.json not found. Please try again.`));
                process.exit(1);
            }
            // Read config.json
            readFile(filePath)
                // Read successful
                .then(data => {
                    // Print config.json
                    log(chalk.green('[✔] Read config.json'));

                    // If download path contains a file name, remove it
                    downloadPath = removeFilenameFromDownloadPath(downloadPath);

                    // Check if download path is invalid
                    if (!fs.existsSync(downloadPath)) {
                        // log(chalk.red.bold('** Invalid download path. Saving in current directory. **'));
                        console.log('Invalid download path. Saving in current directory');
                        // If specified download path is invalid AND also, a custom path,
                        // set it to current directory
                        if (downloadPath !== process.cwd())
                            downloadPath = process.cwd();
                    }

                    // If not present already, add '\\' to the end of download path
                    if (!downloadPath.endsWith('\\'))
                        downloadPath += '\\';

                    // If force flag is absent, create duplicate if file is already present
                    if (!force) {
                        downloadPath = generateNewDownloadPath(downloadPath, fileName)
                    }

                    // Check if attachment exists
                    if (!fs.existsSync(attachmentPath)) {
                        // log(chalk.red.bold(`Error! ${attachmentPath} not found.`));
                        console.log(`Attachment file could not be found. Please try again.`)
                        process.exit(1);
                    }

                    // Make POST request
                    post(data, attachmentPath, downloadPath, fileName);
                })
                // Read failed
                .catch(err => log(chalk.red(err)));
        }
    })

program
    .command('copy <srcPath> <destDir>')
    .alias('cp')
    .description('Copy file from src to dest')
    .option('-f, --force', 'If file exists in download directory, it is overwritten', false)
    .action((srcPath, destDir, options) => {
        let {
            force
        } = options;

        if (srcPath === undefined || destDir === undefined) {
            log(chalk.red.bold('Error! Missing source or destination path.'))
            process.exit(1);
        }
        moveFile(srcPath, destDir, force);
    })

program.on('--help', () => {
    log('');
    log('Options:');
    log('-d, --downloadDir <dir>', 'Set download directory for GET response')
    log('-f, --force', '\t\tIf file exists in download directory, it is overwritten')
    log('-n, --filename <name>', '\tName to save GET response with')
});

program.parse(process.argv);