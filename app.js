require('./db');

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
//console.log(path.join(__dirname,'./public'));

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
app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname+'/public/home_page.html'));
})


/*
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/register',(req,res)=>{
    res.render('register');
})*/
//toy
const namePassword = {};

//toy
app.post('/login',(req,res)=>{
    console.log(req.body.name, req.body.password,req.body.type);
})

//toy
app.post('/register',(req,res)=>{
    console.log(req.body.type);
    res.render('register_'+req.body.type);
})

app.post('/register_Customer',(req,res)=>{
    //db insert
    console.log(req.body);
    res.sendFile(path.join(__dirname+'/public/home_page.html'));
})

app.post('/register_BookingAgent',(req,res)=>{
    //db insert
    console.log(req.body);
    res.sendFile(path.join(__dirname+'/public/home_page.html'));
})

app.post('/register_AirlineStaff',(req,res)=>{
    //db insert
    console.log(req.body);
    res.sendFile(path.join(__dirname+'/public/home_page.html'));
})

app.post('/',(req,res)=>{
    console.log(req.body);
    if (req.body.action==='search_for_upcoming_flights'){
        //db query
        res.render('home_search_upcoming',{content:'test'});
    }else if (req.body.action==='check_flight_status'){
        //db query
        res.render('home_check_flight',{content:'test'});
    } 
})

app.listen(3000);
console.log('running');