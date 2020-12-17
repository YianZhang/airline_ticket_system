-- ----------------------------------------------------
-- sql for "submit" 
-- user type: staff
-- input variable: 
-- airport_name
-- airport_city

INSERT INTO airport VALUES ('${req.body.airport_name}', '${req.body.airport_city}');

-- should automatically check if the fields are null (unique) or not
-- ----------------------------------------------------
