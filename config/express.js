const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../server/routes/IndexRoute');
const httpStatus = require('http-status');
const APIError = require('../server/helpers/APIError');
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);
app.use(express.static(path.join(__dirname, '/../public'), { maxAge: 31557600000 }));
app.use((req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND);
    return next(err);
});

module.exports = app;