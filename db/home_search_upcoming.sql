-- ----------------------------------------------------
-- query for "buy" 
-- user type: customer or agent
-- input variable: 
-- email (extracted from user info)
-- purchase_ticket_for_customer
-- input_airline
-- select_flight

SET @ticket_id := UNIX_TIMESTAMP(now());

INSERT INTO ticket VALUES(@ticket_id, ${watermelon.input_airline}, ${watermelon.select_flight});

-- if user type = "customer":
INSERT INTO purchase VALUES (@ticket_id, ${lemonade.email}, NULL, NOW());
-- else if user type = "agent":
INSERT INTO purchase VALUES (@ticket_id, ${watermelon.purchase_ticket_for_customer}, ${lemonade.email}, NOW());
-- else
-- NULL/error/nothing happens




-- ----------------------------------------------------
