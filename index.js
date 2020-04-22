#!/usr/bin/env node

const chalk = require('chalk');
const log = console.log;
const program = require('commander');
const pjson = require('./package.json');
const {
    get,
    post
} = require('./rest');
const {
    doesExist,
    readFile
} = require('./readFile');

program
    .version(pjson.version)

program
    .command('export <filePath>')
    .alias('e')
    .description('Send a GET request')
    .action((filePath) => {
        // Check for missing arguments
        if (typeof filePath === 'undefined') {
            log(chalk.red("No command given for argument 'filePath'"));
            process.exit(1);
        } else {
            // Read config.json
            readFile(filePath)
                // Read successful
                .then(data => {
                    log(chalk.green('[✔] Read config.json'));
                    // Make GET request
                    get(data);
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

program.parse(process.argv);