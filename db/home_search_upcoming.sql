-- ----------------------------------------------------
-- query for "buy" 
-- user type: customer or agent
-- input variable: 
-- email (extracted from user info)
-- purchase_ticket_for_customer
-- input_airline
-- select_flight

SET @ticket_id := UNIX_TIMESTAMP(now());

INSERT INTO ticket VALUES(@ticket_id, '${req.body.input_airline}', ${req.body.select_flight});

-- if user type = "customer":
INSERT INTO purchase VALUES (@ticket_id, '${req.session.data.email}', NULL, NOW());
-- else if user type = "agent":
INSERT INTO purchase VALUES (@ticket_id, '${req.body.purchase_ticket_for_customer}', '${req.session.data.booking_agent_id}', NOW());
-- else
-- NULL/error/nothing happens




-- ----------------------------------------------------
