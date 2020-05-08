# API Gateway CICD CLI

## Install

```sh
npm i apigw-cicd-cli
```

## About
This is a Node CLI tool that allows you to make HTTP GET/POST request to APIs. It expects as parameter a config file `config.json` which contains the necessary details to carry out the requests. Responses to GET and POST requests are saved as `getResponse.zip` and `postResponse.zip` respectively in your current directory.

## Usage

To make a GET request:
```sh
apigw-cicd-cli export|e config.json 
```

To make a POST request:
```sh
apigw-cicd-cli import|i config.json attachment
```
Note: `attachment` is expected to be a .zip file

To see help:
```sh
apigw-cicd-cli --help
```

```sh
Usage: index [options] [command]

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  export|e <filePath>  Send a GET request
  import|i <filename>  Send a POST request
  help [command]       display help for command
```

## Examples

The `config.json` file should have the following format:

{
	"url": "www.example",
	"username": "user",
	"password": "pass"
}

Note: Currently, this tool only supports Basic Authentication.

## Run tests

```sh
npm run test
```

## Contributors

*[@Anshuman](https://github.com/anshu96788) 

*[@Dipankar](https://github.com/DipankarDDUT) 

*[@Nawajish](https://github.com/Nawajish) 

## License

This project is licensed under the Apache 2.0 License - see the LICENSE.md file for details
______________________
These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

Contact us at [TECHcommunity](mailto:technologycommunity@softwareag.com?subject=Github/SoftwareAG) if you have any questions.



