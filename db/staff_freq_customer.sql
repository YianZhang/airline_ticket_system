-- -----------------------------------------------------
-- query for "search" 
-- user type: staff
-- input variable: 
-- username (extracted from user info)
-- email

SELECT f.airline_name, f.flight_num, f.departure_airport,
f.departure_time, f.arrival_airport, f.arrival_time, f.status, f.airplane_id
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name 
AND t.flight_num = f.flight_num AND p.customer_email = ${req.body.email}
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = ${lemonade.username});

-- -----------------------------------------------------
