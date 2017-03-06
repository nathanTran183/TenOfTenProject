const mongoose = require('mongoose');
const config = require('./config/env');
const app = require('./config/express');

mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', function() {
    throw new Error('unable to connect to database:');
});

app.listen(config.port, function(){
    console.log('Magic is happening on port 3000')
});


module.exports = app;