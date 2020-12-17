-- ----------------------------------------------------
-- sql for "submit" 
-- user type: staff
-- input variable: 
-- airport_name
-- airport_city

INSERT INTO airport VALUES (${watermelon.airport_name}, ${watermelon.airport_city});

-- should automatically check if the fields are null (unique) or not
-- ----------------------------------------------------
