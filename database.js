const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
});

db.connect(function(error){
    if(error)
    {
        throw error;
    }
    else
    {
        console.log('MySQL Database is connected successfully');
    }

    // create database if it doesn't exist
    db.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME, function (err) {
        if (err) throw err;
        db.changeUser({database : process.env.DB_NAME}, function(error) {
            if (error) {
                throw error;
            }

            // create the users table if it does not exist
            db.query(`CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(50) NOT NULL,
                password VARCHAR(60) NOT NULL
            )`, function (error) {
                if (error) {
                    throw error;
                }
            });
        });
    });
});

module.exports = db;
