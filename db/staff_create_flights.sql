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
	(SELECT airline_name FROM airline_staff WHERE username = ${lemonade.username}),
	${watermelon.flight_num}, ${watermelon.dept_airport}, 
	${watermelon.dept_time}, ${watermelon.arrival_airport}, 
	${watermelon.arrival_time}, ${watermelon.price}, ${watermelon.status}, ${watermelon.airplane_id});

-- should automatically check if the fields are null or not
-- ----------------------------------------------------
