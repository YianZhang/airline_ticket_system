-- -----------------------------------------------------

-- query for "view commission" 
-- user type: agent
-- input variable: 
-- email (extracted from user info)
-- start_date
-- end_date

-- total amount of commission received in the past (end_date - start_date) days:

SELECT 0.1 * SUM(f.price) as total_commission
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = ${lemonade.email}) 
AND p.purchase_date > ${req.body.start_date} AND p.purchase_date < ${req.body.end_date}
GROUP BY p.booking_agent_id;

-- total number of tickets sold in the past (end_date - start_date) days:

SELECT COUNT(DISTINCT p.ticket_id) as total_tickets
FROM purchases as p, ticket as t, flight as f
WHERE p.ticket_id = t.ticket_id AND t.airline_name = f.airline_name AND t.flight_num = f.flight_num
AND p.booking_agent_id = (SELECT booking_agent_id FROM booking_agent WHERE email = ${lemonade.email}) 
AND p.purchase_date > ${req.body.start_date} AND p.purchase_date < ${req.body.end_date}
GROUP BY p.booking_agent_id;

-- -----------------------------------------------------