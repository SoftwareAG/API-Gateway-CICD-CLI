# API Gateway CICD CLI

## Install

To install apigw-cicd-cli locally:
```sh
npm i apigw-cicd-cli
```

To install apigw-cicd-cli globally:
```sh
npm i -g apigw-cicd-cli
```

To install the latest version of apigw-cicd-cli:
```sh
npm i apigw-cicd-cli@latest
```

## About
[This](https://www.npmjs.com/package/apigw-cicd-cli) is a Node CLI tool that allows you to make HTTP GET/POST request to REST APIs. It expects as parameter a JSON file `config.json` ,which contains the request URL and credentials necessary to make the requests. By default, responses to GET and POST requests will be saved as `getResponse.zip` and `postResponse.zip` respectively in the current directory. Additionally, the CLI can also be used to copy a file from a `src` folder to a `dest` folder.

## Commands

Note:
1. Command argument within [] are optional and those within <> are mandatory.
2. All commands have a broader and a shorter version. Example: `export` command can be wriiten as `e`
3. All command arguments have a broader (starts with `--`) and a shorter version (starts with `-`).
  Example: `--force` command argument can be written as `-f`

To make a GET request:
```sh
apigw-cicd-cli export <path-to-config.json-file> [--downloadDir <download-directory>] [--filename <name-for-response-file>] [--force]

or

apigw-cicd-cli e <path-to-config.json-file> [-d <download-directory>] [-n <name-for-response-file>] [-f]
```

To make a POST request:
```sh
apigw-cicd-cli import <path-to-config.json-file> <path-to-attachment-file> [--downloadDir <download-directory>] [--filename <name-for-response-file>] [--force]

or

apigw-cicd-cli i <path-to-config.json-file> <path-to-attachment-file> [-d <download-directory>] [-n <name-for-response-file>] [-f]
```
Note: `attachment` is expected to be a .zip file

To copy a file from a `src` to a `dest` folder:
```sh
apigw-cicd-cli copy <complete-path-to-file> <download-directory> [--force]

or

apigw-cicd-cli cp <complete-path-to-file> <download-directory> [-f]
```

To see help:
```sh
apigw-cicd-cli --help
```

```sh
apigw-cicd-gw [options] [command]

Commands:
  export|e <path-to-config.json-file> [options]		                    Send a GET request
  import|i <path-to-config.json-file> <path-to-attachment-file> [options]   Send a POST request
  copy|cp <path-to-file> <download-directory> [force] 	                    Copy a file from a src folder to a dest folder
  --help               				                            Display help for commands and options
  --version                                                                 Output the version number

Options:
  -d, --downloadDir <dir>   Set download directory for GET response
  -n, --filename <name>     Name to save GET response with
  --no-force                If this option is specifed and file already exists in download directory, the file WILL NOT be overwritten
```

## Examples

The `config.json` file should have the following format:

{
	"url": "https://www.example.com/rest-endpoint",
	"username": "user",
	"password": "pass"
}

Note: Currently, this tool only supports Basic Authentication.

## Contributors

*[@Anshuman](https://github.com/anshu96788)

*[@Dipankar](https://github.com/DipankarDDUT)

*[@Nawajish](https://github.com/Nawajish)

## License

This project is licensed under the Apache 2.0 License - see the LICENSE.md file for details
______________________
These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

Contact us at [TECHcommunity](mailto:technologycommunity@softwareag.com?subject=Github/SoftwareAG) if you have any questions.



