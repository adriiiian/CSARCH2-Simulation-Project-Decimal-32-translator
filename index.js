const express = require('express')
const dotenv = require('dotenv')
const router = require('./routes/routes')

const app = express();
dotenv.config();

const _Port = process.env.PORT || 3000;
const _Host = process.env.HOSTNAME;

// register view engine
app.set('view engine','ejs');

// takes url encoded data and parse it into an object usable from a req object
app.use(express.urlencoded({extended: true}));

// make client-side scripts and files accessible
app.use(express.static('public'));

app.use(router);
  
app.listen(_Port, () => {
    console.log('Server is running at port ${ _Port }');
  });