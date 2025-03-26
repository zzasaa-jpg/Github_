require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error)=> {
    console.error('Mongodb connection error', error);
});
db.once('open', ()=>{
    console.log('connected db');
});
db.on('disconnected', ()=> {
    console.log('disconnected db');
});

module.exports = mongoose;

