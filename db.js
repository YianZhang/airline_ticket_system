const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "root",
  password: "root",
  database : 'air_ticket',
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query('SELECT * FROM Airline', function (error, results, fields) {
	if (error) throw error;
	console.log('The selection result is: ', results[0]);
  });