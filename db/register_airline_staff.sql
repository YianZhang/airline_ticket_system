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


INSERT INTO airline_staff VALUES (${watermelon.username}, 
	${password_hash}, ${watermelon.first_name}, ${watermelon.last_name}, 
	${watermelon.date_of_birth}, ${watermelon.airline_name});

-- automatically checks if the inputs satisfies the requirements: not null/unique 

-- ----------------------------------------------------
