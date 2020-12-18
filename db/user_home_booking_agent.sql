-- ----------------------------------------------------
-- sql for "buy/search upcoming flights" -> home_search_upcoming
-- search function same as "home_page.sql": query for "search for upcoming flight" 
-- buy function same as "home_search_upcoming.sql": query for "buy" 

-- ----------------------------------------------------
-- sql for "check flight status" -> home_page

-- ----------------------------------------------------
-- query for "view my flights" -> agent_view_my_flights
-- user type: agent
-- input variable: 
-- email (extracted from user info)

-- problem: booking_agent_id might not be unique 
-- possible solution, either change "booking_agent_id" in purchases table into "booking_agent_email",
-- or change  "booking_agent_id" in booking_agent table into "unique"

SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
f.arrival_airport, f.arrival_time, f.status
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
AND f.departure_time > now();

-- -----------------------------------------------------

-- query for "view my commission" -> agent_view_commission
-- user type: agent
-- input variable: 
-- email (extracted from user info)

-- total amount of commission received in the past 30 days:

SELECT 0.1 * SUM(f.price) as total_commission
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
AND p.purchase_date > DATE_SUB(now(),INTERVAL 30 DAY)
GROUP BY p.booking_agent_id;

-- average commission received per ticket booked in the past 30 days:

SELECT commission_past_30_days / ticket_num as average_commission FROM (SELECT 0.1 * SUM(f.price) as commission_past_30_days, COUNT(DISTINCT p.ticket_id) as ticket_num
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = 'bb@nyu.edu') 
AND p.purchase_date > DATE_SUB(curdate(),INTERVAL 30 DAY)
GROUP BY p.booking_agent_id) as subquery;

-- total number of tickets sold in the past 30 days:

SELECT COUNT(DISTINCT p.ticket_id) as total_tickets
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
AND p.purchase_date > DATE_SUB(now(),INTERVAL 30 DAY)
GROUP BY p.booking_agent_id;

-- -----------------------------------------------------

-- query for "view top customer" 
-- user type: agent
-- input variable: 
-- email (extracted from user info)

-- top 5 customers based on number of tickets bought in the past six months:

SELECT c.name as x, COUNT(p.ticket_id) as y
FROM purchases as p, customer as c
WHERE p.customer_email = c.email 
AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
AND p.purchase_date > DATE_SUB(now(),INTERVAL 6 MONTH)
GROUP BY p.customer_email
ORDER BY num_ticket DESC
LIMIT 5;

-- top 5 custmoers based on the commission received last year:

SELECT c.name as x, 0.1 * SUM(f.price) as y
FROM purchases as p, ticket as t, flight as f, customer as c
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name 
AND t.flight_num = f.flight_num AND p.customer_email = c.email 
AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = '${req.session.data.email}') 
AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
GROUP BY p.customer_email
ORDER BY total_commission DESC
LIMIT 5;
-- -----------------------------------------------------