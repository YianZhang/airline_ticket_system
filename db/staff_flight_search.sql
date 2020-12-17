-- ----------------------------------------------------
-- sql for "see customer" 
-- user type: staff
-- input variable: 
-- username (extracted from user info)
-- flight_num

SELECT p.customer_email, c.name, t.airline_name, t.flight_num
FROM airline_staff as s, purchases as p, ticket as t, customer as c
WHERE s.username = ${lemonade.username} AND t.airline_name = s.airline_name 
AND t.flight_num = ${req.body.flight_num} AND t.ticket_id = p.ticket_id 
AND p.customer_email = c.email;

-- ----------------------------------------------------
