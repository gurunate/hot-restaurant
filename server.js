'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const config = require('rc')('app');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

let tables = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/home.html'));
});

app.get('/reserve', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/reserve.html'));
});

app.get('/tables', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/tables.html'));
});

app.get('/api/:filter', (req, res) => {
    let retval = [];

    switch (req.params.filter) {
        case 'tables':

            retval = _.take(tables, 5);
            break;

        case 'waitlist':

            retval = _.slice(tables, 5);
            break;
    }

    res.json(retval);
});

app.post('/api/tables', (req, res) => {
    tables.push(req.body);
    res.json(true);
});

app.delete('/api/tables', (req, res) => {
    tables = [];
    res.json(tables);
});


// Start server
app.listen(config[env].port, err => {
    if (err) {
        throw err;
    }

    console.log(`${config[env].title} server running on http://localhost:${config[env].port}, Ctrl+C to stop`);
});
