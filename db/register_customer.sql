-- ----------------------------------------------------
-- sql for "submit" 
-- user type: visitor 
-- input variable: 
-- email
-- password
-- name
-- building_num
-- street
-- city
-- state
-- phone_number
-- passport_number
-- passport_expiration
-- passport_country
-- date_of_birth

INSERT INTO customer VALUES ('${req.body.email}', '${req.body.name}', 
	'${password_hash}', '${req.body.building_num}', '${req.body.street}', 
	'${req.body.city}', '${req.body.state}', ${req.body.phone_number}, 
	'${req.body.passport_number}', '${req.body.passport_expiration}', 
	'${req.body.passport_country}', '${req.body.date_of_birth}');

-- automatically checks if the inputs satisfies the requirements: not null/unique 



-- ----------------------------------------------------
