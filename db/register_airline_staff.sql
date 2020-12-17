-- ----------------------------------------------------
-- sql for "submit" 
-- user type: visitor
-- input variable: 
-- username
-- password
-- first_name
-- last_name
-- date_of_birth
-- airline_name


INSERT INTO airline_staff VALUES ('${req.body.username}', 
	'${password_hash}', '${req.body.first_name}', '${req.body.last_name}', 
	'${req.body.date_of_birth}', '${req.body.airline_name}');

-- automatically checks if the inputs satisfies the requirements: not null/unique 

-- ----------------------------------------------------
