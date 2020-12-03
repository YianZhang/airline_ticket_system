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
app.use((req,res,next)=>{
    console.log(req.path);
    next();
})
//app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req,res)=>{
    res.render('index');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/register',(req,res)=>{
    res.render('register');
})
//toy
const namePassword = {};

//toy
app.post('/login',(req,res)=>{
    console.log(req.body.name, req.body.password,req.body.type);
})

//toy
app.post('/register',(req,res)=>{
    console.log(req.body.type);
})

app.listen(3000);
console.log('running');