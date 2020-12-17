-- ----------------------------------------------------
-- sql for "submit" 
-- user type: staff
-- input variable: 
-- username (extracted from user info)
-- airplane_id
-- seats

INSERT INTO airplane VALUES (
	(SELECT airline_name FROM airline_staff WHERE username = ${lemonade.username}), 
	${watermelon.airplane_id}, ${watermelon.seats});

-- should automatically check if the fields are null or not
-- ----------------------------------------------------
