const fs = require('fs');
const chalk = require('chalk');
const log = console.log;

module.exports = {
    doesExist: file => fs.existsSync(file),

    readFile: filePath => {
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
}