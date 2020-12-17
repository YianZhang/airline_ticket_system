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

app.use(express.static(path.join(__dirname, 'public'),{index:false,extensions:['html']}));

app.get('/', (req,res)=>{
    res.redirect('home_page');
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

//GENERAL
//toy
app.post('/login',(req,res)=>{
    //todo db query and cache data
    console.log(req.body.name, req.body.password,req.body.type);
    res.redirect('user_home_'+req.body.type);
})

app.get('/logout',(req,res)=>{
    //todo: cookies
    console.log('logged out');
    res.redirect('/login');
})

//REGISTER
//toy
app.post('/register',(req,res)=>{
    console.log(req.body.type);
    res.render('register_'+req.body.type);
})

app.post('/register_customer',(req,res)=>{
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        //db insert
        const quety = `INSERT INTO customer VALUES (${req.body.email}, ${req.body.name}, 
            ${hash}, ${req.body.building_num}, ${req.body.street}, 
            ${req.body.city}, ${req.body.state}, ${req.body.phone_number}, 
            ${req.body.passport_number}, ${req.body.passport_expiration}, 
            ${req.body.passport_country}, ${req.body.date_of_birth});`

        con.query(query, function (error, results, fields) {
            if (error) throw error;
            console.log('testing');
          });
    });
    //db insert
    console.log(req.body);
    res.redirect('/');
})

app.post('/register_booking_agent',(req,res)=>{
    //db insert
    console.log(req.body);
    res.redirect('/');
    //res.sendFile(path.join(__dirname, '/public/home_page.html'));
})

app.post('/register_airline_staff',(req,res)=>{
    //db insert
    console.log(req.body);
    res.redirect('/');
    //res.sendFile(path.join(__dirname, '/public/home_page.html'));
})

//HOME
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

app.post('/',(req,res)=>{
    console.log(req.body);
    if (req.body.action==='search_for_upcoming_flights'){
        //db query
        res.render('home_search_upcoming',{content:'test'});
    } else if (req.body.action==='check_flight_status'){
        //db query
        res.render('home_check_flight',{content:'test'});
    } 
})

//CUSTOMER
app.post('/user_home_customer',(req,res)=>{
    //todo identity check
    if (req.body.action==="view_my_flights"){
        console.log('testing');
        //todo db query
        res.render('customer_view_my_flights',{content:'test'});
    } else if (req.body.action==="search_for_upcoming_flights"){
        //db query
        res.render('customer_search_upcoming',{content:'test'});
    } else if (req.body.action==='check_flight_status'){
        //db query
        res.render('customer_check_flight',{content:'test'});
    } else if (req.body.action==='track_my_spending'){
        //db query
        res.render('customer_spending',{content:'test_spending'});
    } 
    //else if
})

// ttdd customer buy
//app.post('/agent_search_flights',(req,res)=>{

//AGENT
app.post('/user_home_booking_agent',(req,res)=>{
    //todo identity check
    if (req.body.action==="search_for_upcoming_flights"){
        //todo db query
        res.render('agent_search_flights',{content:'test'});
    } else if (req.body.action==='check_flight_status'){
        //db query
        res.render('agent_check_flight',{content:'test'});
    } else if (req.body.action==="view_my_flights"){
        //todo db query
        res.render('agent_view_my_flights',{content:'test'});
    } else if (req.body.action==="view_my_commission"){
        //todo db query
        res.render('agent_view_commission',{total_commission:'test',average_commission:'test',total_tickets:'test'});
    }
    //todo: db query
})

app.post('/agent_search_flights',(req,res)=>{
    //agent buy
    //todo identity check
    console.log(req.body.purchase_ticket_for_customer, req.body.select_flight, req.body.input_airline);
    //todo db query
    res.redirect('/user_home_booking_agent');
})

app.post('/agent_view_commission',(req,res)=>{
    //agent view commission
    //todo identity check
    console.log(req.body.start_date, req.body.end_date);
    //todo db query
})


//STAFF
app.post('/user_home_airline_staff',(req,res)=>{
    //todo identity check
    if (req.body.action==="search_for_upcoming_flights"){
        //db query
        res.render('staff_search_upcoming',{content:'test'});
    } else if (req.body.action==='check_flight_status'){
        //db query
        res.render('staff_check_flight',{content:'test'});
    }  else if (req.body.action==="view_my_flights"){
        //todo db query
        res.render('staff_view_my_flights',{content:'test'});
    } else if (req.body.action==="create_new_flights"){
        //todo db query
        res.render('staff_create_flights',{content:'test'});
    } else if (req.body.action==="change_status_of_flights"){
        res.render('staff_flight_status');
    } else if (req.body.action==="add_airplane_in_the_system"){
        res.render('staff_add_airplane');
    } else if (req.body.action==="add_new_airport_in_the_system"){
        res.render('staff_add_airport');
    } else if (req.body.action==="view_frequent_customers"){
        res.render('staff_freq_customer');
    } else if (req.body.action==="view_reports"){
        res.render('staff_reports');
    }
    //else if
})

app.post('/staff_view_my_flights',(req,res)=>{
    //agent view commission
    //todo identity check
    console.log(req.body);
    //todo db query
    //res.render
})

//todo: post staff_flight_status  (change status)
//todo: post staff_add_airplane
//todo: post staff_add_airport
//todo: post staff_freq_customer
//todo: post staff_reports
app.listen(3000);
console.log('running');