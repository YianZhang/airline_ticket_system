-- ----------------------------------------------------
-- sql for "submit" 
-- user type: visitor
-- input variable: 
-- email
-- password
-- booking_agent_id


INSERT INTO booking_agent VALUES (${watermelon.email}, ${password_hash}, ${watermelon.booking_agent_id});

-- automatically checks if the inputs satisfies the requirements: not null/unique 

-- ----------------------------------------------------
