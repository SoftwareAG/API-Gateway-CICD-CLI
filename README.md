# API Gateway CICD CLI

## Install

```sh
npm i apigw-cicd-cli
```

## About
[This](https://www.npmjs.com/package/apigw-cicd-cli) is a Node CLI tool that allows you to make HTTP GET/POST request to REST APIs. It expects as parameter a JSON file `config.json` ,which contains the request URL and credentials necessary to make the requests. Responses to GET and POST requests are saved as `getResponse.zip` and `postResponse.zip` respectively, in the specified directory. If specified directory is invalid, the responses will be saved in the current directory. Additionally, the CLI can also be used to copy a file from a `src` folder to a `dest` folder. 

## Commands

To make a GET request:
```sh
apigw-cicd-cli export config.json [download-path]

or

apigw-cicd-cli e config.json [download-path]
```
Note: Parameters within [] are optional

To make a POST request:
```sh
apigw-cicd-cli import config.json attachment

or

apigw-cicd-cli i config.json attachment
```
Note: `attachment` is expected to be a .zip file

To copy a file from a `src` to a `dest` folder:
```sh
apigw-cicd-cli copy <complete-path-to-file> <download-directory>

or

apigw-cicd-cli cp <complete-path-to-file> <download-directory>
```

To see help:
```sh
apigw-cicd-cli --help
```

```sh
apigw-cicd-gw [options] [command]

Options:
  --version        output the version number
  --help           display help for command

Commands:
  export|e <filePath> [downloadPath]  		Send a GET request
  import|i <filename>  			      	Send a POST request
  copy|cp <path-to-file> <download-directory> 	Copy a file from a src folder to a dest folder
  help [command]       				display help for command
```

## Examples

The `config.json` file should have the following format:

{
	"url": "https://www.example.com/rest-endpoint",
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



