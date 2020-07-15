const chalk = require('chalk');
const fs = require('fs');
const log = console.log;
const path = require('path');
const {
    fixFileName
} = require('./fileSystemHandler');
const request = require('request');

module.exports = {
    get: (data, downloadPath, fileName) => {

        // Set up request
        var options = {
            method: 'GET',
            url: data.url,
            headers: {
                'Authorization': `Basic ${Buffer.from(`${data.username}:${data.password}`, 'utf8').toString('base64')}`
            }
        };

        // Add extension to fileName if it is invalid or missing
        fileName = fixFileName(fileName);

        // If downloadPath does not contain a filename, add it
        if (!path.extname(downloadPath))
            downloadPath += fileName;

        // Make GET request
        request(options, (err, res, body) => {

                // Check for error response
                if (err) {
                    log(chalk.red(err));
                    process.exit(1);
                }

                // Check for Client/Server errors
                if (res) {
                    if (res.statusCode >= 400) {
                        log(chalk.red.bold(` ${res.statusCode} ${res.statusMessage}`));
                        process.exit(1);
                    } else {
                        log(chalk.green.bold(`[✔] Request Status : ${res.statusCode} ${res.statusMessage}`));
                    }
                }

            })
            // Save response
            .pipe(fs.createWriteStream(`${downloadPath}`))
            // Display success message
            .on('close', () => log(chalk.green.bold(`\nSuccess! Response saved to`, chalk.white.bold(`${downloadPath}`))));
    },

    post: (data, attachmentPath, downloadPath, fileName) => {

        // Add extension to fileName if it is invalid or missing
        attachmentPath = fixFileName(attachmentPath);
        // Add extension to fileName if it is invalid or missing
        fileName = fixFileName(fileName);

        if (!path.extname(downloadPath))
            downloadPath += fileName;

        // Set up request
        var options = {
            method: 'POST',
            url: data.url,
            headers: {
                'Authorization': `Basic ${Buffer.from(`${data.username}:${data.password}`, 'utf8').toString('base64')}`,
                'Content-Type': 'application/json'
            },
            formData: {
                'file': {
                    'value': fs.createReadStream(`${attachmentPath}`),
                    'options': {
                        'filename': attachmentPath,
                        'contentType': null
                    }
                }
            }
        };

        // Make POST request
        request(options, (err, res, body) => {

                // Check for error
                if (err) {
                    log(chalk.red(err));
                    process.exit(1);
                }

                // Check for Client/Server errors
                if (res) {
                    if (res.statusCode >= 400) {
                        log(chalk.red.bold(`${res.statusCode} ${res.statusMessage}`));
                        process.exit(1);
                    } else {
                        log(chalk.green.bold(`[✔] Request Status : ${res.statusCode} ${res.statusMessage}`));
                    }
                }
            })
            // Save response
            .pipe(fs.createWriteStream('postResponse.zip'))
            // Display success message
            .on('close', () => log(chalk.green.bold('\nSuccess! Response saved to current directory!')));
    }
}