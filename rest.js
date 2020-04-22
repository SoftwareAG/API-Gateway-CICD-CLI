const chalk = require('chalk');
const fs = require('fs');
const log = console.log;
const request = require('request');

module.exports = {
    get: data => {

        // Set up request
        var options = {
            method: 'GET',
            url: data.url,
            headers: {
                'Authorization': `Basic ${Buffer.from(`${data.username}:${data.password}`, 'utf8').toString('base64')}`
            }
        };

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
                        log(chalk.red.bold(`${res.statusCode} ${res.statusMessage}`));
                        process.exit(1);
                    } else {
                        log(chalk.green.bold(`${res.statusCode} ${res.statusMessage}`));
                    }
                }

            })
            // Save response
            .pipe(fs.createWriteStream('getResponse.zip'))
            // Display success message
            .on('close', () => log(chalk.green.bold('Sucess! Response saved to current directory!')));
    },

    post: (data, attachment) => {

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
                    'value': fs.createReadStream(`${attachment}`),
                    'options': {
                        'filename': attachment,
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
                        log(chalk.green.bold(`${res.statusCode} ${res.statusMessage}`));
                    }
                }
            })
            // Save response
            .pipe(fs.createWriteStream('postResponse.zip'))
            // Display success message
            .on('close', () => log(chalk.green.bold('Sucess! Response saved to current directory!')));
    }
}