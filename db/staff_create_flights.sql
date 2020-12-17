-- ----------------------------------------------------
-- sql for "create" 
-- user type: staff
-- input variable: 
-- username (extracted from user info)
-- flight_num
-- dept_airport
-- dept_time
-- arrival_airport
-- arrival_time
-- price
-- status
-- airplane_id

INSERT INTO flight VALUES (
	(SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}'),
	${req.body.flight_num}, '${req.body.dept_airport}', 
	'${req.body.dept_time}', '${req.body.arrival_airport}', 
	'${req.body.arrival_time}', ${req.body.price}, '${req.body.status}', ${req.body.airplane_id});

-- should automatically check if the fields are null or not
-- ----------------------------------------------------
