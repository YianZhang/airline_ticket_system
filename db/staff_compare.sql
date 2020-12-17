-- ----------------------------------------------------
-- sql for "comparison of revenue earned"
-- user type: staff
-- input variable: 
-- username (extracted from user info)

-- total amount of revenue earned from direct sales 
-- (when customer bought tickets without using a booking agent)
-- in the last month

SELECT SUM(f.price)
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND f.airline_name = t.airline_name AND f.flight_num = t.flight_num
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = ${lemonade.username})
AND p.booking_agent_id is null AND p.purchase_date > DATE_SUB(now(), INTERVAL 1 MONTH);

-- total amount of revenue earned from direct sales 
-- (when customer bought tickets without using a booking agent)
-- in the last year

SELECT SUM(f.price)
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND f.airline_name = t.airline_name AND f.flight_num = t.flight_num
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = ${lemonade.username})
AND p.booking_agent_id is null AND p.purchase_date > DATE_SUB(now(), INTERVAL 1 YEAR);

-- total amount of revenue earned from indirect sales 
-- (when customer bought tickets using a booking agent)
-- in the last month

SELECT SUM(f.price)
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND f.airline_name = t.airline_name AND f.flight_num = t.flight_num
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = ${lemonade.username})
AND p.booking_agent_id is not null AND p.purchase_date > DATE_SUB(now(), INTERVAL 1 MONTH);

-- total amount of revenue earned from indirect sales 
-- (when customer bought tickets using a booking agent)
-- in the last year

SELECT SUM(f.price)
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND f.airline_name = t.airline_name AND f.flight_num = t.flight_num
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = ${lemonade.username})
AND p.booking_agent_id is not null AND p.purchase_date > DATE_SUB(now(), INTERVAL 1 YEAR);

-- ----------------------------------------------------
