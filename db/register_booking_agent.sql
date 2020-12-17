-- ----------------------------------------------------
-- sql for "submit" 
-- user type: visitor
-- input variable: 
-- email
-- password
-- booking_agent_id


INSERT INTO booking_agent VALUES (${req.body.email}, ${password_hash}, ${req.body.booking_agent_id});

-- automatically checks if the inputs satisfies the requirements: not null/unique 

-- ----------------------------------------------------
