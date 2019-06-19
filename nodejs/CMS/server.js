'use strict';
var http = require('http');

var express = require('express');
var cors = require('cors');

var appAdmin = express();
var app = express();
app.use(cors());
app.use("/admin", appAdmin);

var auth = require('./auth');
var controllersAdmin = require('./controllers/admin');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
appAdmin.use(express.urlencoded({ extended: true }));
appAdmin.use(express.json());

controllersAdmin.init(appAdmin);
auth.init(app);


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (err, req, res, next) {
    if (err) {
        res.status(err.status).json({ message: err.message });
    }

    next();
});

var server = http.createServer(app);

server.listen(3000);

