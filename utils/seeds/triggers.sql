-- Trigger 1:
-- Check whether all OrderItems in an order belong to the same Order
CREATE OR REPLACE FUNCTION check_orderitems() RETURNS TRIGGER
  AS $$
DECLARE
  restaurantUsername VARCHAR(128);
  foodRestaurantUsername VARCHAR(128);
BEGIN
  restaurantUsername:= (
    SELECT restUsername FROM Orders
    WHERE id = NEW.orderId
    LIMIT 1
  );

  foodRestaurantUsername := (
    SELECT restUsername FROM FoodItems
    WHERE id = NEW.foodId
    LIMIT 1
  );

  IF restaurantUsername = foodRestaurantUsername THEN
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_orderitems_trigger ON OrderItems;
CREATE TRIGGER check_orderitems_trigger
  BEFORE UPDATE OR INSERT
  ON OrderItems
  FOR EACH ROW
  EXECUTE FUNCTION check_orderitems();

-- Trigger 2:
-- Check whether a worker's work hours fulfil the following conditions:
-- - Starts on hour and ends on hour
-- - No overlapping hours on a given day
-- - Work intervals should only not be across days
-- - Is within the timeframe 10am to 10pm
-- - At least 1 hour break between two consecutive hour intervals

-- Fmod is a utility function that helps us do a modulo on 2 floating point numbers
CREATE OR REPLACE FUNCTION fmod (
   dividend double precision,
   divisor double precision
) RETURNS double precision AS $$
BEGIN
  RETURN dividend - floor(dividend / divisor) * divisor;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_start_end_hours(
  startDate TIMESTAMP,
  endDate TIMESTAMP
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN FMOD(EXTRACT(EPOCH FROM endDate - startDate) / 3600, 1) = 0;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_hours_on_same_day(
  startDate TIMESTAMP,
  endDate TIMESTAMP
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN DATE(startDate) = DATE(endDate);
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_within_working_hours(
  d TIMESTAMP
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXTRACT(HOUR FROM d) >= 10 AND EXTRACT(HOUR FROM d) <= 22;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_hours() RETURNS TRIGGER
  AS $$
DECLARE
  shouldAdd BOOLEAN;
BEGIN
  IF check_start_end_hours(NEW.startDate, NEW.endDate) AND
    check_hours_on_same_day(NEW.startDate, NEW.endDate) AND
    is_within_working_hours(NEW.startDate) AND
    is_within_working_hours(NEW.endDate) THEN

    shouldAdd := (WITH SameDayWorkshifts AS (
      SELECT startDate, endDate, 
        ABS(EXTRACT(hour FROM startDate) - EXTRACT(HOUR FROM NEW.endDate)) AS interval1, 
        ABS(EXTRACT(hour FROM endDate) - EXTRACT(HOUR FROM NEW.startDate)) AS interval2
      FROM WorkSchedules
      WHERE 
        riderUsername = NEW.riderUsername AND
        DATE(NEW.startDate) = DATE(startDate)
    )
    SELECT NOT EXISTS(
      SELECT 1
      FROM SameDayWorkshifts
      WHERE (startDate, endDate) OVERLAPS (NEW.startDate, NEW.endDate) OR
        (
          interval1 < 1 AND
          interval2 < 1
        )
    ));

    IF shouldAdd THEN
      RETURN NEW;
    END IF;
    RETURN NULL;
  END IF;
  RETURN NULL;
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_hours_trigger ON WorkSchedules;

CREATE TRIGGER check_hours_trigger
  BEFORE UPDATE OR INSERT
  ON WorkSchedules
  FOR EACH ROW
  EXECUTE FUNCTION check_hours();


-- Trigger 3:
-- Checks for fulltime rider constraints:
-- - Each work day needs have 2 4-hour shifts
-- - Between the 2 shifts, there must be exactly a 1-hour break
-- - There must be 5 consecutive workdays in a week, no more, no less.
CREATE OR REPLACE FUNCTION check_fulltime_rider_constraints() RETURNS TRIGGER
  AS $$
DECLARE
  isFulltime BOOLEAN;
  shouldAdd BOOLEAN;
  durationIsFourHours BOOLEAN;
BEGIN
  isFulltime := (
    SELECT EXISTS(
      SELECT 1 FROM FullTimeRiders WHERE riderUsername = NEW.riderUsername
    )
  );

  IF isFulltime THEN
    durationIsFourHours := (
      SELECT EXISTS(
        SELECT 1 WHERE EXTRACT(hour FROM NEW.endDate - NEW.startDate) = 4
      )
    );

    shouldAdd := (WITH SameDayWorkshifts AS (
      SELECT startDate, endDate, 
        ABS(EXTRACT(HOUR FROM startDate) - EXTRACT(HOUR FROM NEW.endDate)) AS interval1, 
        ABS(EXTRACT(hour FROM endDate) - EXTRACT(HOUR FROM NEW.startDate)) AS interval2
      FROM WorkSchedules
      WHERE 
        riderUsername = NEW.riderUsername AND
        DATE(NEW.startDate) = DATE(startDate)
    )
    SELECT NOT EXISTS(
      SELECT 1
      FROM SameDayWorkshifts
      WHERE (startDate, endDate) OVERLAPS (NEW.startDate, NEW.endDate) OR
        (
          interval1 <> 1 AND
          interval2 <> 1
        )
    ));

    IF durationIsFourHours AND shouldAdd THEN
      RETURN NEW;
    END IF;
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_fulltime_rider_constraints_trigger ON WorkSchedules;
CREATE TRIGGER check_fulltime_rider_constraints_trigger
  BEFORE UPDATE OR INSERT
  ON WorkSchedules
  FOR EACH ROW
  EXECUTE FUNCTION check_fulltime_rider_constraints();