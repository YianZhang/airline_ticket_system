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

INSERT INTO customer VALUES (${watermelon.email}, ${watermelon.name}, 
	${watermelon.password}, ${watermelon.building_num}, ${watermelon.street}, 
	${watermelon.city}, ${watermelon.state}, ${watermelon.phone_number}, 
	${watermelon.passport_number}, ${watermelon.passport_expiration}, 
	${watermelon.passport_country}, ${watermelon.date_of_birth});

-- automatically checks if the inputs satisfies the requirements: not null/unique 



-- ----------------------------------------------------
