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
const encodeUrl = bodyParser.urlencoded({extended: false});

// Generate a random UUID to use as session IDs
const {v4: uuidv4} = require('uuid');

// Session middleware
app.use(sessions({
    genid: () => uuidv4(),
    secret: 'secretkey',
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}, // 24 hours
    resave: false,
}));

app.use(cookieParser());

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).send(err.message);
});

// Hash and salt password
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Register user
app.post('/users', encodeUrl, (req, res) => {
    let password = req.body.password;
    let email = req.body.email;

    // checking user already registered or no
    con.query(`SELECT *
               FROM users
               WHERE email = '${email}'`, function (err, result) {
        if (err) {
            return console.log(err);
        }

        //if not a valid email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).send('Invalid email');
        }

        // if user is already registered
        if (result.length !== 0) {
            return res.status(409).send('User already registered');
        }

        // hash and salt the password
        bcrypt.hash(password, saltRounds, function (err, hash) {
            // inserting user data into database
            con.query(`INSERT INTO users (email, password)
                       VALUES ('${email}', '${hash}')`, function (err, result) {
            })
            res.status(201).send('User registered successfully');
        });
    });
});

// Login user
app.post('/sessions', encodeUrl, (req, res) => {
    let password = req.body.password;
    let email = req.body.email;

    con.query(`SELECT *
               FROM users
               WHERE email = '${email}'`, function (err, result) {

        if (err) {
            return console.log(err);
        }

        // create const user which finds the user in the database
        const user = result.find(user => user.email === email);

        // if user not registered
        if (result.length === 0) {
            return res.status(401).send('User not found');
        }

        // compare password with the hashed password
        bcrypt.compare(password, result[0].password, function (err, result) {
            if (!result) {
               return res.status(401).send('Incorrect password');
            }

            // set session ID and user ID
            req.session.id = uuidv4();
            req.session.userId = user.id;

            res.status(201).json({ message: 'User logged in successfully', sessionId: req.session.id, userId: req.session.userId });
        });
    });
});


app.listen(port, () => {
    console.log(`App running. Docs at http://localhost:${port}/docs`);
});