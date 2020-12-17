-- ----------------------------------------------------
-- sql for "buy/search upcoming flights" -> home_search_upcoming
-- search function same as "home_page.sql": query for "search for upcoming flight" 
-- buy function same as "home_search_upcoming.sql": query for "buy" 

-- ----------------------------------------------------
-- sql for "check flight status" -> home_page

-- ----------------------------------------------------
-- query for "view my flights" -> customer_view_my_flights
-- user type: customer
-- input variable: (extracted from user info)
-- email

SELECT f.airline_name, f.flight_num, f.departure_airport, f.departure_time, 
f.arrival_airport, f.arrival_time, f.status
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num 
AND f.departure_time > now() AND p.customer_email = '${req.session.data.email}';

-- -----------------------------------------------------
-- query for "track my spending" -> customer_spending
-- user type: customer
-- input variable: 
-- email (extracted from user info)

-- total amount of money spent in the past year
SELECT SUM(f.price) as total_spending_in_the_past_year
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num 
AND p.customer_email = '${req.session.data.email}' AND p.purchase_date > DATE_SUB(now(),INTERVAL 1 YEAR)
GROUP BY p.customer_email;

-- -----------------------------------------------------
-- bar chart for month-wise money spent (last six months)
-- user type: customer
-- input variable: 
-- email (extracted from user info)

-- one issue: if within any month there is no cost, then this month is not in the data (no 0 auto-filled)
SELECT MONTH(p.purchase_date), SUM(f.price) as spending_per_month
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num 
AND p.customer_email = '${req.session.data.email}' AND p.purchase_date > DATE_SUB(now(),INTERVAL 6 MONTH)
GROUP BY p.customer_email, MONTH(p.purchase_date);


-- -----------------------------------------------------
