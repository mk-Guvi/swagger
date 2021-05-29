export {};
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONFIG, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Ysquare',
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('DB COnnected');
});
