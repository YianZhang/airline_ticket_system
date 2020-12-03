require('./db');

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
//const path = require('path');

const app = express();
app.userSessions = {}

app.set('view engine','hbs');

const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: true, 
    resave: false, 
};

app.use(session(sessionOptions));
app.use(express.urlencoded({extended:false}));
//app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req,res)=>{
    res.render('index');
})

app.listen(3000);
console.log('running');