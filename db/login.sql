-- ----------------------------------------------------
-- sql for "login" 
-- user type: visitor
-- input variable: 
-- email 

-- if already logged in, cannot log in again

-- if "customer"
SELECT * FROM customer WHERE email = '${req.session.data.username}';

-- if "booking_agent"
SELECT * FROM booking_agent WHERE email = '${req.session.data.username}';

-- if "staff"
SELECT * FROM airline_staff WHERE username = '${req.session.data.username}';

-- ----------------------------------------------------
