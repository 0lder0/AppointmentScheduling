# Appointment Scheduling System

This is a simple appointment scheduling system. It is a REST API built with Node.js and Express. The API is documented with Swagger and the documentation can be found in the [swagger.yaml](swagger.yaml) file. The API is connected to a MySQL database. 

## Prerequisites

To begin working with this project, you need to have Node.js and a MySQL server installed on your machine.

- Node.js: You can download it from the official Node.js website (https://nodejs.org/en/download/).

- MySQL server: Please follow the instructions on the official MySQL website (https://dev.mysql.com/downloads/mysql/) to download and install the MySQL server.


## Getting Started

Once you have installed Node.js, follow these steps:

1. Open the root directory of the project in terminal. 
1. Copy the .env.sample file to .env by executing `cp .env.sample .env` and change the values to your liking.
1. Run `npm install` to install all the necessary dependencies for the project.
1. Run `npm start` to start the server on port 3000 (or whatever port you have specified in the .env file).
1. Navigate to [http://localhost:3000/docs](http://localhost:3000/docs) to see the API documentation.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- [Express](https://expressjs.com/) for the web framework.
- [Node.js](https://nodejs.org/en/) for the JavaScript runtime.
- [NPM](https://www.npmjs.com/) for the package manager.
- [Dotenv](https://www.npmjs.com/package/dotenv) for the environment variables.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) for the password hashing.
- [Swagger](https://swagger.io/) for the API documentation.
- [MySQL](https://www.mysql.com/) for the database.