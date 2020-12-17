-- ----------------------------------------------------
-- sql for "search upcoming flights" -> home_page
-- no "buy" function

-- ----------------------------------------------------
-- sql for "check flight status" -> home_page

-- ----------------------------------------------------
-- query for "view my flights" -> staff_view_my_flights
-- upcoming flights of your airline in the next 30 days
-- user type: staff
-- input variable: (extracted from user info)
-- username

SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
f.arrival_airport, f.arrival_time, f.status
FROM flight as f, airline_staff as s
WHERE s.airline_name = f.airline_name AND s.username = '${lemonade.username}' AND f.departure_time > now()
AND f.departure_time < DATE_ADD(now(),INTERVAL 30 DAY);

-- query for "search flight" (within this airline)
-- user type: staff
-- input variable: 
-- username (extracted from user info)
-- flight_num
-- dept_airport
-- arrival_airport
-- start_date
-- end_date
-- status
-- airplane_id

SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
f.arrival_airport, f.arrival_time, f.status
FROM flight as f, airline_staff as s
WHERE f.airline_name = s.airline_name AND s.username = '${lemonade.username}' AND f.flight_num = ${req.body.flight_num} 
AND f.departure_airport = '${req.body.dept_airport}' AND f.arrival_airport = '${req.body.arrival_airport}'
AND f.status = '${req.body.status}' AND f.airplane_id = ${req.body.airplane_id}
AND f.departure_time > '${req.body.start_date}' AND f.departure_time < '${req.body.end_date}';

-- see all customers of a particular flight -> staff_flight_search

-- -----------------------------------------------------

-- query for "creat new flights"
-- default display: same as query for "view my flights"
-- upcoming flights of your airline in the next 30 days


-- sql for "create" -> staff_create_flights

-- -----------------------------------------------------

-- sql for "change status of flights" -> staff_flight_status

-- -----------------------------------------------------

-- sql for "add airplane in the system" -> staff_add_airplane

-- -----------------------------------------------------

-- sql for "add new airport in the system" -> staff_add_airport

-- -----------------------------------------------------

-- sql for "view all the booking agents" 
-- user type: staff
-- input variable: 
-- username (extracted from user info)

-- top 5 booking agents based on number of ticket sales for the past month

SELECT p.booking_agent_id, COUNT(t.ticket_id) as total_number_of_ticket_sales
FROM purchases as p, ticket as t, airline_staff as s
WHERE p.ticket_id = t.ticket_id AND s.username = '${lemonade.username}'
AND s.airline_name = t.airline_name
AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 MONTH)
AND p.booking_agent_id is not null
GROUP BY p.booking_agent_id;

-- top 5 booking agents based on number of ticket sales for the past year

SELECT p.booking_agent_id, COUNT(t.ticket_id) as total_number_of_ticket_sales
FROM purchases as p, ticket as t, airline_staff as s
WHERE p.ticket_id = t.ticket_id AND s.username = '${lemonade.username}'
AND s.airline_name = t.airline_name
AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
AND p.booking_agent_id is not null
GROUP BY p.booking_agent_id;

-- top 5 booking agents based on the amount of commission received for the last year

SELECT p.booking_agent_id, 0.1 * SUM(f.price) as total_amount_of_commission_received
FROM purchases as p, ticket as t, flight as f, airline_staff as s
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num 
AND t.airline_name = s.airline_name
AND s.username = '${lemonade.username}' AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
AND p.booking_agent_id is not null
GROUP BY p.booking_agent_id;

-- -----------------------------------------------------

-- sql for "view frequent customers" 
-- user type: staff
-- input variable: 
-- username (extracted from user info)

-- most frequent customer within the last year 

SELECT p.customer_email as top_customer -- , COUNT(DISTINCT t.ticket_id) as total_number_of_tickets_purchased
FROM purchases as p, ticket as t
WHERE t.ticket_id = p.ticket_id 
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${lemonade.username}')
AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
GROUP BY p.customer_email
HAVING COUNT(DISTINCT t.ticket_id) >= all (
SELECT COUNT(DISTINCT t.ticket_id)
FROM purchases as p, ticket as t
WHERE t.ticket_id = p.ticket_id 
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${lemonade.username}')
GROUP BY p.customer_email
);


-- sql for "search flights for customer" -> staff_freq_customer

-- -----------------------------------------------------
-- sql for "view reports" -> staff_reports 
-- -----------------------------------------------------
-- sql for "comparision of revenue earned" -> staff_compare
-- -----------------------------------------------------
-- sql for "view top destinations" -> staff_top_destinations
-- user type: staff
-- input variable: 
-- username (extracted from user info)

-- top 3 most popular destinations for last 3 months 

SELECT f.arrival_airport
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.flight_num = f.flight_num AND t.airline_name = f.airline_name
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${lemonade.username}')
AND p.purchase_date > DATE_SUB(curdate(),INTERVAL 3 MONTH)
GROUP BY f.arrival_airport
ORDER BY COUNT(DISTINCT t.ticket_id) 
DESC
LIMIT 3;



-- top 3 most popular destinations for last 1 year

SELECT f.arrival_airport
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.flight_num = f.flight_num AND t.airline_name = f.airline_name
AND t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${lemonade.username}')
AND p.purchase_date > DATE_SUB(curdate(),INTERVAL 1 YEAR)
GROUP BY f.arrival_airport
ORDER BY COUNT(DISTINCT t.ticket_id) 
DESC
LIMIT 3;

-- -----------------------------------------------------

