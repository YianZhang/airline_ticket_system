-- ----------------------------------------------------
-- query for "search for upcoming flight" 
-- user type: everybody (whether visitor or user)
-- input variable: 
-- departure_airport_or_city
-- arrival_airport_or_city
-- flight_date

-- please check: if date < date.now(), error

SELECT f.airline_name, f.flight_num, f.departure_airport, dep_a.airport_city, 
f.arrival_airport, arr_a.airport_city, f.departure_time, f.arrival_time, f.price
FROM flight as f, airport as dep_a, airport as arr_a
WHERE f.departure_airport = dep_a.airport_name AND f.arrival_airport = arr_a.airport_name AND 
(f.departure_airport = ${watermelon.departure_airport_or_city} || dep_a.airport_city = ${watermelon.departure_airport_or_city}) 
AND (f.arrival_airport = ${watermelon.arrival_airport_or_city} || arr_a.airport_city = ${watermelon.arrival_airport_or_city})
AND DATE(f.departure_time) = ${watermelon.flight_date} AND f.departure_time > now();

-- ----------------------------------------------------
-- query for "check flight status" 
-- user type: everybody (whether visitor or user)
-- input variable: 
-- flight_number
-- departure_date
-- arrival_date

SELECT airline_name, flight_num, departure_airport, arrival_airport, 
departure_time, arrival_time, status
FROM flight 
WHERE flight_num = ${watermelon.flight_number} 
AND (DATE(departure_time) = ${watermelon.departure_date} || DATE(arrival_time) = ${watermelon.arrival_date});

-- -----------------------------------------------------