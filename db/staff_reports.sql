-- ----------------------------------------------------
-- sql for "search" -> staff_report_search
-- user type: staff
-- input variable: 
-- username (extracted from user info)
-- start_date
-- end_date

-- month wise total amount of tickets sold within (start_date - end_date)

SELECT DATE_FORMAT(p.purchase_date,'%Y-%m'), COUNT(DISTINCT t.ticket_id)
FROM purchases as p, ticket as t
WHERE p.ticket_id = t.ticket_id AND 
t.airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${req.session.data.username}')
AND p.purchase_date >= '${req.body.start_date}' AND p.purchase_date <= '${req.body.end_date}'
GROUP BY YEAR(p.purchase_date), MONTH(p.purchase_date);


-- ----------------------------------------------------
