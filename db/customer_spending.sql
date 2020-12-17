-- -----------------------------------------------------
-- query for "search": bar chart for month-wise money spent (user specified range)
-- user type: customer
-- input variable: 
-- email (extracted from user info)
-- start_month (this should include year! and in DATE format)
-- end_month (this should include year! and in DATE format)

SELECT DATE_FORMAT(p.purchase_date,'%Y-%m'), SUM(f.price) as spending_per_month
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num 
AND p.customer_email = ${lemonade.email} AND p.purchase_date >= ${watermelon.start_month} 
AND p.purchase_date <= ${watermelon.end_month}
GROUP BY YEAR(p.purchase_date), MONTH(p.purchase_date);

-- -----------------------------------------------------