const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "root",
  password: "root",
  database : 'airport_system',
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`,(error,results)=>{if(error){console.error(error)}});
con.query('SELECT * FROM Airline', function (error, results, fields) {
	if (error) throw error;
	console.log('The selection result is: ', results[0]);
  });

const stringify = function(lofo){
    return lofo.reduce((acc,cur)=>{
        return acc+'\n'+JSON.stringify(cur);
    },'');
}

const disentangle = function(lofo){
    console.log('lofo');
    console.log(lofo);
    let p1, p2;
    p1 = lofo.map((a)=>{return a['x'].toString().replace('-','.')});
    p2 = lofo.map((a)=>{return a.y});
    return {p1, p2}
}


const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const { EDESTADDRREQ } = require('constants');
const { read } = require('fs');

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

app.use((req,res,next)=>{
    console.log(req.url);
    console.log(req.session.hasOwnProperty('data'));
    console.log('true');
    console.log('true2');
    if (req.url.startsWith('/agent_') || req.url.startsWith('/user_home_booking_agent')){
        console.log('test');
        if (!req.session.hasOwnProperty('data') || req.session.data.type!=='booking_agent'){
            res.render('error',{message:'you have no right to access this page'});
        } else {next();}
    } else if (req.url.startsWith('/customer_') || req.url.startsWith('/user_home_customer')){
        if (!req.session.hasOwnProperty('data') || req.session.data.type!=='customer'){
            res.render('error',{message:'you have no right to access this page'});
        } else {next();}
    } else if (req.url.startsWith('/staff_') || req.url.startsWith('/user_home_airline_staff')){
        if (!req.session.hasOwnProperty('data') || req.session.data.type!=='airline_staff'){
            res.render('error',{message:'you have no right to access this page'});
        } else {next();}
    } else {
        next();
    }
    
});

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
        //console.log(req.body);
    let query;
    if (req.body.type==='airline_staff'){
        query = `SELECT * FROM airline_staff WHERE username = '${req.body.username}';`
    }
    else{
        query = `SELECT * FROM ${req.body.type} WHERE email = '${req.body.username}';`
    }
    console.log(query);
    con.query(query, function (error, results){
        if (error){
            res.render('error',{message:error.message});
        } else if (results.length===0){
            res.render('error',{message:'no such account'});
        }
        else {
            bcrypt.compare(req.body.password,results[0]['password'],(err,result)=>{
                if (err){
                    res.render('error',{message:err.message});
                    console.error(err);
                }else if (!result){
                    res.render('error',{message:'wrong password'});
                }else{
                    req.session.data=results[0];
                    req.session.data.type=req.body.type;
                    res.redirect('/user_home_'+req.body.type);
                }
            });
        }
    })
  
    //console.log(req.body.name, req.body.password,req.body.type);
})

app.get('/logout',(req,res)=>{
    //todo: cookies
    delete req.session.data;
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
        //db insert2-
        console.log('test');
        //const query = `INSERT INTO customer VALUES (${req.body.email}, ${req.body.name}, ${hash}, ${req.body.building_num}, ${req.body.street}, ${req.body.city}, ${req.body.state}, ${req.body.phone_number}, ${req.body.passport_number}, ${req.body.passport_expiration}, ${req.body.passport_country}, ${req.body.date_of_birth});`
        const query = `INSERT INTO customer VALUES ('${req.body.email}', '${req.body.name}', 
            '${hash}', '${req.body.building_num}', '${req.body.street}', 
            '${req.body.city}', '${req.body.state}', ${req.body.phone_number}, 
            '${req.body.passport_number}', '${req.body.passport_expiration}', 
            '${req.body.passport_country}', '${req.body.date_of_birth}')`

        con.query(query, function (error, results, fields) {
            if (error){
                res.render('error',{message:error.message});
            } else{
                res.redirect('/');
            }
            console.log(results);
            
          });
    });
})

app.post('/register_booking_agent',(req,res)=>{
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        const query = `INSERT INTO booking_agent VALUES ('${req.body.email}', '${hash}', ${req.body.booking_agent_id});`
        con.query(query, function (error, results, fields) {
            if (error){
                res.render('error',{message:error.message});
            } else{
                res.redirect('/');
            }
            console.log(results);
            
          });
    });
})

app.post('/register_airline_staff',(req,res)=>{
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        const query = `INSERT INTO airline_staff VALUES ('${req.body.username}', 
        '${hash}', '${req.body.first_name}', '${req.body.last_name}', 
        '${req.body.date_of_birth}', '${req.body.airline_name}');`
        con.query(query, function (error, results, fields) {
            if (error){
                res.render('error',{message:error.message});
            } else{
                res.redirect('/');
            }
            console.log(results);
            
          });
    });
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

        const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, dep_a.airport_city, 
        f.arrival_airport, arr_a.airport_city, f.departure_time, f.arrival_time, f.price
        FROM flight as f, airport as dep_a, airport as arr_a
        WHERE f.departure_airport = dep_a.airport_name AND f.arrival_airport = arr_a.airport_name AND 
        (f.departure_airport = '${req.body.departure_airport_or_city}' || dep_a.airport_city = '${req.body.departure_airport_or_city}') 
        AND (f.arrival_airport = '${req.body.arrival_airport_or_city}' || arr_a.airport_city = '${req.body.arrival_airport_or_city}')
        AND DATE(f.departure_time) = '${req.body.flight_date}' AND f.departure_time > now();`
        
        con.query(query,function (error,results){
            if (error){
                res.render('error',{message:error.message});
            }else{
                res.render('home_search_upcoming',{content:stringify(results)});
            }
        });
    }else if (req.body.action==='check_flight_status'){
        const query = `SELECT airline_name, flight_num, departure_airport, arrival_airport, 
        departure_time, arrival_time, status
        FROM flight 
        WHERE flight_num = ${req.body.flight_number} 
        AND (DATE(departure_time) = '${req.body.departure_date}' || DATE(arrival_time) = '${req.body.arrival_date}');`
        
        con.query(query,function (error,results){
            if (error){
                console.log('where');
                res.render('error',{message:error.message});
            }else{
                console.log('here');
                console.log(results[0]);
                res.render('home_check_flight',{content:stringify(results)});
            }
        });
    } 
})

/*
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
*/

//CUSTOMER
app.post('/user_home_customer',(req,res)=>{
    //todo identity check
    if (req.body.action==="view_my_flights"){
        const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
        f.arrival_airport, f.arrival_time, f.status
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num 
        AND f.departure_time > now() AND p.customer_email = '${req.session.data.email}';`
        //todo db query
        con.query(query, function (error, results){
            if (error){
                res.render('error',{message:error.message});
            } else {
                res.render('customer_view_my_flights',{content:stringify(results)});
            }});
    } else if (req.body.action==='search_for_upcoming_flights'){

        const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, dep_a.airport_city, 
        f.arrival_airport, arr_a.airport_city, f.departure_time, f.arrival_time, f.price
        FROM flight as f, airport as dep_a, airport as arr_a
        WHERE f.departure_airport = dep_a.airport_name AND f.arrival_airport = arr_a.airport_name AND 
        (f.departure_airport = '${req.body.departure_airport_or_city}' || dep_a.airport_city = '${req.body.departure_airport_or_city}') 
        AND (f.arrival_airport = '${req.body.arrival_airport_or_city}' || arr_a.airport_city = '${req.body.arrival_airport_or_city}')
        AND DATE(f.departure_time) = '${req.body.flight_date}' AND f.departure_time > now();`
        
        con.query(query,function (error,results){
            if (error){
                res.render('error',{message:error.message});
            }else{
                res.render('customer_search_upcoming',{content:stringify(results)});
            }
        });
    }else if (req.body.action==='check_flight_status'){
        const query = `SELECT airline_name, flight_num, departure_airport, arrival_airport, 
        departure_time, arrival_time, status
        FROM flight 
        WHERE flight_num = ${req.body.flight_number} 
        AND (DATE(departure_time) = '${req.body.departure_date}' || DATE(arrival_time) = '${req.body.arrival_date}');`
        
        con.query(query,function (error,results){
            if (error){
                res.render('error',{message:error.message});
            }else{
                console.log(results[0]);
                res.render('customer_check_flight',{content:stringify(results)});
            }
        });
    } else if (req.body.action==='track_my_spending'){
        //db query
        res.render('customer_spending',{content:'test_spending'});
    } 
    //else if
})

// customer buy
app.post('/customer_search_upcoming',(req,res)=>{
    const query = `SET @ticket_id := UNIX_TIMESTAMP(now());`
    con.query(query,(error,result)=>{
        if (error){
            res.render('error',{message:error.message});
        } else{
            con.query(`INSERT INTO ticket VALUES(@ticket_id, '${req.body.input_airline}', ${req.body.select_flight})`,(error,results)=>{
                if (error){
                    res.render('error',{message:error.message});
                } else {
                    const query = `INSERT INTO purchases VALUES (@ticket_id, '${req.session.data.email}', NULL, NOW());`
                    con.query(query,(error,result)=>{
                        if (error){
                            res.render('error',{message:error.message});
                        }else{
                            res.redirect('/user_home_customer');
                        }
                    })
                }
            })
            
        }
    })

})

//AGENT
app.post('/user_home_booking_agent',(req,res)=>{
    //todo identity check
    if (req.body.action==='search_for_upcoming_flights'){

        const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, dep_a.airport_city, 
        f.arrival_airport, arr_a.airport_city, f.departure_time, f.arrival_time, f.price
        FROM flight as f, airport as dep_a, airport as arr_a
        WHERE f.departure_airport = dep_a.airport_name AND f.arrival_airport = arr_a.airport_name AND 
        (f.departure_airport = '${req.body.departure_airport_or_city}' || dep_a.airport_city = '${req.body.departure_airport_or_city}') 
        AND (f.arrival_airport = '${req.body.arrival_airport_or_city}' || arr_a.airport_city = '${req.body.arrival_airport_or_city}')
        AND DATE(f.departure_time) = '${req.body.flight_date}' AND f.departure_time > now();`
        
        con.query(query,function (error,results){
            if (error){
                res.render('error',{message:error.message});
            }else{
                res.render('agent_search_flights',{content:stringify(results)});
            }
        });
    }else if (req.body.action==='check_flight_status'){
        const query = `SELECT airline_name, flight_num, departure_airport, arrival_airport, 
        departure_time, arrival_time, status
        FROM flight 
        WHERE flight_num = ${req.body.flight_number} 
        AND (DATE(departure_time) = '${req.body.departure_date}' || DATE(arrival_time) = '${req.body.arrival_date}');`
        
        con.query(query,function (error,results){
            if (error){
                console.log('where');
                res.render('error',{message:error.message});
            }else{
                console.log('here');
                console.log(results[0]);
                res.render('agent_check_flight',{content:stringify(results)});
            }
        });
    }else if (req.body.action==="view_my_flights"){
        //todo db query
        const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
        f.arrival_airport, f.arrival_time, f.status
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
        AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
        AND f.departure_time > now();`;
        con.query(query, function (error, results){
            if (error){
                res.render('error',{message:error.message});
            } else {
                res.render('agent_view_my_flights',{content:stringify(results)});
            }});
    } else if (req.body.action==="view_my_commission"){
        //todo db query
        const query1 = `SELECT 0.1 * SUM(f.price) as total_commission
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
        AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
        AND p.purchase_date > DATE_SUB(now(),INTERVAL 30 DAY)
        GROUP BY p.booking_agent_id;`

        const query2 = `SELECT commission_past_30_days / ticket_num as average_commission FROM (SELECT 0.1 * SUM(f.price) as commission_past_30_days, COUNT(DISTINCT p.ticket_id) as ticket_num
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
        AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
        AND p.purchase_date > DATE_SUB(curdate(),INTERVAL 30 DAY)
        GROUP BY p.booking_agent_id) as subquery;`
        
        const query3 = `SELECT COUNT(DISTINCT p.ticket_id) as total_tickets
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
        AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
        AND p.purchase_date > DATE_SUB(now(),INTERVAL 30 DAY)
        GROUP BY p.booking_agent_id;`

        con.query(query1, function(error1, results1){
            if (error1){
                res.render('error',{message:error1.message});
            } else {
                console.log(results1);
                con.query(query2, function(error2,results2){
                    if (error2){
                        res.render('error',{message:error2.message});
                    } else {
                        con.query(query3, function(error3, results3){
                            if (error3){
                                res.render('error',{message:error3.message});
                            } else {
                                if (results1.length===0 || results2.length===0 || results3.length===0){
                                    res.render('error',{message:'You probably need to work harder...'})
                                }else{
                                    res.render('agent_view_commission',{total_commission:results1[0].total_commission, average_commission:results2[0].average_commission, total_tickets:results3[0].total_tickets});
                                }
                                
                            }
                        })
                    }
                })
            }
        })
    } else if (req.body.action==='view_top_customer'){
        const query1 = `SELECT c.name as x, COUNT(p.ticket_id) as y
        FROM purchases as p, customer as c
        WHERE p.customer_email = c.email 
        AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
        AND p.purchase_date > DATE_SUB(now(),INTERVAL 6 MONTH)
        GROUP BY p.customer_email
        ORDER BY y DESC
        LIMIT 5;`;

        const query2 = `SELECT c.name as x, 0.1 * SUM(f.price) as y
        FROM purchases as p, ticket as t, flight as f, customer as c
        WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name 
        AND t.flight_num = f.flight_num AND p.customer_email = c.email 
        AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
        AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
        GROUP BY p.customer_email
        ORDER BY y DESC
        LIMIT 5;`;

        con.query(query1,(error1, results1)=>{
            if (error1){
                console.log(query1);
                res.render('error',{message:error1.message});
            } else{
                const {p1,p2} = disentangle(results1);
                console.log('['+p2.toString()+']','['+p1.toString()+']');
                //res.render('agent_view_customer',{data:'['+p2.toString()+']',labels:'['+p1.toString()+']'});
                res.render('agent_view_customer',{data:'['+p2.toString()+']',labels:'[yian]'});
                //res.render('agent_view_customer',{data:'[1,2,3]',labels:'[1,2,3]'});
            }
        })
    }
    
})

app.post('/agent_search_flights',(req,res)=>{
    const query = `SET @ticket_id := UNIX_TIMESTAMP(now());`
    con.query(query,(error,result)=>{
        if (error){
            res.render('error',{message:error.message});
        } else{
            con.query(`INSERT INTO ticket VALUES(@ticket_id, '${req.body.input_airline}', ${req.body.select_flight})`,(error,results)=>{
                if (error){
                    res.render('error',{message:error.message});
                } else {
                    const query = `INSERT INTO purchases VALUES (@ticket_id, '${req.body.purchase_ticket_for_customer}', '${req.session.data.booking_agent_id}', NOW());`
                    con.query(query,(error,result)=>{
                        if (error){
                            res.render('error',{message:error.message});
                        }else{
                            res.redirect('/user_home_booking_agent');
                        }
                    })
                }
            })
            
        }
    })

})

app.post('/agent_view_commission',(req,res)=>{
    //agent view commission
    //todo identity check
    const query1 = `SELECT 0.1 * SUM(f.price) as total_commission
    FROM purchases as p, ticket as t, flight as f
    WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
    AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
    AND p.purchase_date > '${req.body.start_date}' AND p.purchase_date < '${req.body.end_date}'
    GROUP BY p.booking_agent_id;`;

    const query2 = `SELECT COUNT(DISTINCT p.ticket_id) as total_tickets
    FROM purchases as p, ticket as t, flight as f
    WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
    AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
    AND p.purchase_date > '${req.body.start_date}' AND p.purchase_date < '${req.body.end_date}'
    GROUP BY p.booking_agent_id;`;

    con.query(query1, (error1,result1)=>{
        if (error1){
            res.render('error',{message:error1.message})
        } else{
            con.query(query2, (error2, result2)=>{
                if (error2){
                    res.render('error',{message:error2.message})
                } else {
                    res.render('agent_view_commission',{total_commission:result1[0].total_commission,total_tickets:result2[0].total_tickets, average_commission:"not applicable"});
                }
            })
        }
    })
    console.log(req.body.start_date, req.body.end_date);
    //todo db query
})


//STAFF
app.post('/user_home_airline_staff',(req,res)=>{
    //todo identity check
    if (req.body.action==='search_for_upcoming_flights'){

        const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, dep_a.airport_city, 
        f.arrival_airport, arr_a.airport_city, f.departure_time, f.arrival_time, f.price
        FROM flight as f, airport as dep_a, airport as arr_a
        WHERE f.departure_airport = dep_a.airport_name AND f.arrival_airport = arr_a.airport_name AND 
        (f.departure_airport = '${req.body.departure_airport_or_city}' || dep_a.airport_city = '${req.body.departure_airport_or_city}') 
        AND (f.arrival_airport = '${req.body.arrival_airport_or_city}' || arr_a.airport_city = '${req.body.arrival_airport_or_city}')
        AND DATE(f.departure_time) = '${req.body.flight_date}' AND f.departure_time > now();`
        
        con.query(query,function (error,results){
            if (error){
                res.render('error',{message:error.message});
            }else{
                res.render('staff_search_upcoming',{content:stringify(results)});
            }
        });
    }else if (req.body.action==='check_flight_status'){
        const query = `SELECT airline_name, flight_num, departure_airport, arrival_airport, 
        departure_time, arrival_time, status
        FROM flight 
        WHERE flight_num = ${req.body.flight_number} 
        AND (DATE(departure_time) = '${req.body.departure_date}' || DATE(arrival_time) = '${req.body.arrival_date}');`
        
        con.query(query,function (error,results){
            if (error){
                console.log('where');
                res.render('error',{message:error.message});
            }else{
                console.log('here');
                console.log(results[0]);
                res.render('staff_check_flight',{content:stringify(results)});
            }
        });
    }  else if (req.body.action==="view_my_flights"){
        const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
        f.arrival_airport, f.arrival_time, f.status
        FROM flight as f, airline_staff as s
        WHERE s.airline_name = f.airline_name AND s.username = '${req.session.data.username}' AND f.departure_time > now()
        AND f.departure_time < DATE_ADD(now(),INTERVAL 30 DAY);`
        con.query(query,function(error,results){
            if (error){
                res.render('error',error.message);
            }else{
                res.render('staff_view_my_flights',{content:stringify(results)});
            }
        });
    } else if (req.body.action==="create_new_flights"){
        //todo db query
        const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
        f.arrival_airport, f.arrival_time, f.status
        FROM flight as f, airline_staff as s
        WHERE s.airline_name = f.airline_name AND s.username = '${req.session.data.username}' AND f.departure_time > now()
        AND f.departure_time < DATE_ADD(now(),INTERVAL 30 DAY);`;
        con.query(query,(error,results)=>{
            if (error){
                res.render('error',{message:error.message});
            } else {
                res.render('staff_create_flights',{content:stringify(results)});
            }
        })
    } else if (req.body.action==="view_all_the_booking_agents"){
        const query1 = `SELECT p.booking_agent_id, COUNT(t.ticket_id) as total_number_of_ticket_sales
        FROM purchases as p, ticket as t, airline_staff as s
        WHERE p.ticket_id = t.ticket_id AND s.username = '${req.session.data.username}'
        AND s.airline_name = t.airline_name
        AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 MONTH)
        AND p.booking_agent_id is not null
        GROUP BY p.booking_agent_id;`

        const query2 = `SELECT p.booking_agent_id, COUNT(t.ticket_id) as total_number_of_ticket_sales
        FROM purchases as p, ticket as t, airline_staff as s
        WHERE p.ticket_id = t.ticket_id AND s.username = '${req.session.data.username}'
        AND s.airline_name = t.airline_name
        AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
        AND p.booking_agent_id is not null
        GROUP BY p.booking_agent_id;`
        
        const query3 = `SELECT p.booking_agent_id, 0.1 * SUM(f.price) as total_amount_of_commission_received
        FROM purchases as p, ticket as t, flight as f, airline_staff as s
        WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num 
        AND t.airline_name = s.airline_name
        AND s.username = '${req.session.data.username}' AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
        AND p.booking_agent_id is not null
        GROUP BY p.booking_agent_id;`

        con.query(query1, function(error1, results1){
            if (error1){
                res.render('error',{message:error1.message});
            } else {
                console.log(results1);
                con.query(query2, function(error2,results2){
                    if (error2){
                        res.render('error',{message:error2.message});
                    } else {
                        con.query(query3, function(error3, results3){
                            if (error3){
                                res.render('error',{message:error3.message});
                            } else {
                                if (results1.length===0 || results2.length===0 || results3.length===0){
                                    res.render('error',{message:'not enough agents'})
                                }else{
                                    res.render('staff_view_agents',{ticket_month:stringify(results1),ticket_year:stringify(results2),commission_year:stringify(results3)}); 
                                }
                            }
                        })
                    }
                })
            }
        });
        
    } else if (req.body.action==="change_status_of_flights"){
        res.render('staff_flight_status');
    } else if (req.body.action==="add_airplane_in_the_system"){
        res.render('staff_add_airplane');
    } else if (req.body.action==="add_new_airport_in_the_system"){
        res.render('staff_add_airport');
    } else if (req.body.action==="view_frequent_customers"){
        const query = `SELECT p.customer_email as top_customer -- , COUNT(DISTINCT t.ticket_id) as total_number_of_tickets_purchased
        FROM purchases as p, ticket as t
        WHERE t.ticket_id = p.ticket_id 
        AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
        GROUP BY p.customer_email
        HAVING COUNT(DISTINCT t.ticket_id) >= all (
        SELECT COUNT(DISTINCT t.ticket_id)
        FROM purchases as p, ticket as t
        WHERE t.ticket_id = p.ticket_id 
        AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        GROUP BY p.customer_email
        );`;
        con.query(query,(error,results)=>{
            if (error){
                res.render('error',{message:error.message});
            } else {
                res.render('staff_freq_customer',{top_customer:stringify(results)});
            }
        });
    } else if (req.body.action==="view_top_destinations"){
        const query1 = `SELECT f.arrival_airport
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND t.flight_num = f.flight_num AND t.airline_name = f.airline_name
        AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        AND p.purchase_date > DATE_SUB(curdate(),INTERVAL 3 MONTH)
        GROUP BY f.arrival_airport
        ORDER BY COUNT(DISTINCT t.ticket_id) 
        DESC
        LIMIT 3;`

        const query2 = `SELECT f.arrival_airport
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND t.flight_num = f.flight_num AND t.airline_name = f.airline_name
        AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        AND p.purchase_date > DATE_SUB(curdate(),INTERVAL 1 YEAR)
        GROUP BY f.arrival_airport
        ORDER BY COUNT(DISTINCT t.ticket_id) 
        DESC
        LIMIT 3;`

        con.query(query1, function(error1, results1){
            if (error1){
                res.render('error',{message:error1.message});
            } else {
                con.query(query2, function(error2,results2){
                    if (error2){
                        res.render('error',{message:error2.message});
                    } else {
                        res.render('staff_top_destinations',{dest_months:stringify(results1),dest_year:stringify(results2)});
                    }
                })
            }
        });
    }
    else if (req.body.action==="view_reports"){
        res.render('staff_report');
    } else if (req.body.action==="comparison_of_revenue_earned"){
        const query1 = `SELECT SUM(f.price) as value
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND f.airline_name = t.airline_name AND f.flight_num = t.flight_num
        AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        AND p.booking_agent_id is null AND p.purchase_date > DATE_SUB(now(), INTERVAL 1 MONTH);`;

        const query3 = `SELECT SUM(f.price) as value
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND f.airline_name = t.airline_name AND f.flight_num = t.flight_num
        AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        AND p.booking_agent_id is null AND p.purchase_date > DATE_SUB(now(), INTERVAL 1 YEAR);`;

        const query2 = `SELECT SUM(f.price) as value
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND f.airline_name = t.airline_name AND f.flight_num = t.flight_num
        AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        AND p.booking_agent_id is not null AND p.purchase_date > DATE_SUB(now(), INTERVAL 1 MONTH);`;

        const query4 = `SELECT SUM(f.price) as value
        FROM purchases as p, ticket as t, flight as f
        WHERE p.ticket_id = t.ticket_id AND f.airline_name = t.airline_name AND f.flight_num = t.flight_num
        AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        AND p.booking_agent_id is not null AND p.purchase_date > DATE_SUB(now(), INTERVAL 1 YEAR);` ;

        con.query(query1,(error1,results1)=>{
            if (error1){
                res.render('error',{message:error1.messasge});
            } else {
                con.query(query2, (error2, results2)=>{
                    if (error2){
                        res.render('error',{message:error2.message});
                    } else {
                        con.query(query3, (error3, results3)=>{
                            if (error3){
                                res.render('error',{message:error2.message});
                            } else {
                                con.query(query4, (error4,results4)=>{
                                    if (error4){
                                        res.render('error',{message:error2.message});
                                    } else {
                                        res.render('staff_compare',{x1:results1[0].value,y1:results2[0].value, x2:results3[0].value,y2:results4[0].value});
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})

app.post('/staff_view_my_flights',(req,res)=>{
    const query = `SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
    f.arrival_airport, f.arrival_time, f.status, f.airplane_id
    FROM flight as f, airline_staff as s, airport as dep_a, airport as arr_a
    WHERE f.airline_name = s.airline_name AND s.username = '${req.session.data.username}'
    AND f.arrival_airport = arr_a.airport_name AND f.departure_airport = dep_a.airport_name
    AND (f.departure_airport = '${req.body.departure_airport_or_city}' || dep_a.airport_city = '${req.body.departure_airport_or_city}' ||
     f.arrival_airport = '${req.body.arrival_airport}' || arr_a.airport_city = '${req.body.arrival_airport_or_city}')
    AND f.departure_time > '${req.body.start_date}' AND f.departure_time < '${req.body.end_date}';`
    
    con.query(query,function(error,results){
        if (error){
            res.render('error',error.message);
        }else{
            res.render('staff_view_my_flights',{content:stringify(results)});
        }
    });
})

app.post('/staff_create_flights',(req,res)=>{
    const query = `INSERT INTO flight VALUES (
        (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}'),
        ${req.body.flight_num}, '${req.body.dept_airport}', 
        '${req.body.dept_time}', '${req.body.arrival_airport}', 
        '${req.body.arrival_time}', ${req.body.price}, '${req.body.status}', ${req.body.airplane_id});`
    con.query(query,(error,results)=>{
        if (error){
            res.render('error',{message:error.message});
        } else {
            res.redirect('/user_home_airline_staff');
        }
    });
});

//todo: post staff_flight_status  (change status)
//todo: post staff_add_airplane
app.post('/staff_add_airplane',(req,res)=>{
    const query =  `INSERT INTO airplane VALUES (
        (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}'), 
        ${req.body.airplane_id}, ${req.body.seats});`
    con.query(query,(error,results)=>{
        if (error){
            res.render('error',{message:error.message});
        } else {
            res.redirect('/user_home_airline_staff');
        }
    });
});

app.post('/staff_add_airport',(req,res)=>{
    const query =  `INSERT INTO airport VALUES ('${req.body.airport_name}', '${req.body.airport_city}');`
    con.query(query,(error,results)=>{
        if (error){
            res.render('error',{message:error.message});
        } else {
            res.redirect('/user_home_airline_staff');
        }
    });
});

app.post('/staff_freq_customer',(req,res)=>{
    const query = `SELECT f.airline_name, f.flight_num, f.departure_airport,
    f.departure_time, f.arrival_airport, f.arrival_time, f.status, f.airplane_id
    FROM purchases as p, ticket as t, flight as f
    WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name 
    AND t.flight_num = f.flight_num AND p.customer_email = '${req.body.email}'
    AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}');
    `;
    con.query(query, (error,results)=>{
        if (error){
            res.render('error',{message:error.message});
        } else {
            res.render('staff_plain',{content:stringify(results)});
        }
    })
})
//todo: post staff_reports
app.post('/staff_report',(req,res)=>{
    const query = `SELECT DATE_FORMAT(p.purchase_date,'%Y-%m') as x, COUNT(DISTINCT t.ticket_id) as y
        FROM purchases as p, ticket as t
        WHERE p.ticket_id = t.ticket_id AND 
        t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
        AND p.purchase_date >= '${req.body.start_date}' AND p.purchase_date <= '${req.body.end_date}'
        GROUP BY YEAR(p.purchase_date), MONTH(p.purchase_date);`

        con.query(query,(error,results)=>{
            if (error){
                console.log(query);
                res.render('error',{message:error.message});
            } else {
                const {p1,p2} = disentangle(results);
                console.log(p1.toString(),p2.toString());
                res.render('staff_report',{data:'['+p2.toString()+']',labels:'['+p1.toString()+']'});
                //res.render('staff_report',{data:'[1,2,3]',labels:'[1,2,3]'});
            }
        });
})
app.post('/staff_flight_status',(req,res)=>{
    const query =  `UPDATE flight
    SET status = '${req.body.new_flight_status}'
    WHERE airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}') 
    AND flight_num = ${req.body.flight_num};`
    con.query(query,(error,results)=>{
        if (error){
            res.render('error',{message:error.message});
        } else {
            res.redirect('/user_home_airline_staff');
        }
    });
});

app.listen(3000);
console.log('running');