const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const swaggerUi = require('swagger-ui-express');
const yamlJs = require('yamljs');
const swaggerDocument = yamlJs.load('./swagger.yaml');
const bodyParser = require('body-parser');
const con = require('./database');

require('dotenv').config();

const port = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static('public'));

// Use the Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL encoded data
const encodeUrl = bodyParser.urlencoded({ extended: false });

// Session middleware
app.use(sessions({
    secret: "secretkey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));

app.use(cookieParser());

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).send(err.message);
});

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/users', encodeUrl, (req, res) => {
    let password = req.body.password;
    let email = req.body.email;

    // checking user already registered or no
    con.query(`SELECT *
               FROM users
               WHERE email = '${email}'`, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //if not a valid email
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                res.status(400).send('Invalid email');
            } else {
                // if user not registered
                if (result.length === 0) {
                    // hash and salt the password
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        // inserting user data into database
                        con.query(`INSERT INTO users (email, password)
                                   VALUES ('${email}', '${hash}')`, function (err, result){
                        })
                        res.status(201).send('User registered successfully');
                    })
                }
                // if user already registered
                else {
                    res.status(409).send('User already registered');
                }
            }
        }
    });
});

app.listen(port, () => {
    console.log(`App running. Docs at http://localhost:${port}/docs`);
});
