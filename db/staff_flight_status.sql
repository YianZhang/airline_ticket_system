-- ----------------------------------------------------
-- query for "change status of flights"
-- user type: staff
-- input variable: 
-- username (extracted from user info)
-- airline_name 
-- flight_num
-- new_flight_status


UPDATE flight
SET status = '${req.body.new_flight_status} '
WHERE airline_name = (SELECT airline_name FROM airline_staff WHERE username = '${lemonade.username}') 
AND flight_num = ${req.body.flight_num};

-- should automatically check if the fields are null or not
-- ----------------------------------------------------
