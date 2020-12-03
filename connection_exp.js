const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "root",
  password: "root"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
	if (error) throw error;
	console.log('The solution is: ', results[0].solution);
  });