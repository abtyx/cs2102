CREATE OR REPLACE FUNCTION check_orderitems() RETURNS TRIGGER
  AS '
DECLARE
  restaurantId INTEGER;
  foodRestaurantId INTEGER;
BEGIN
  restaurantId := (
    SELECT restId FROM Orders
    WHERE id = NEW.orderId
    LIMIT 1
  );

  foodRestaurantId := (
    SELECT restId FROM FoodItems
    WHERE id = NEW.foodId
    LIMIT 1
  );

  IF restaurantId = foodRestaurantId THEN
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_orderitems_trigger ON OrderItems;
CREATE TRIGGER check_orderitems_trigger
  BEFORE UPDATE OR INSERT
  ON OrderItems
  FOR EACH ROW
  EXECUTE FUNCTION check_orderitems();

CREATE FUNCTION fmod (
   dividend double precision,
   divisor double precision
) RETURNS double precision
    LANGUAGE sql IMMUTABLE AS
'SELECT dividend - floor(dividend / divisor) * divisor';
REATE OR REPLACE FUNCTION check_hours() RETURNS TRIGGER
  AS '
BEGIN
  IF FMOD(EXTRACT(EPOCH FROM NEW.endDate - NEW.startDate)/3600, 1) = 0 THEN
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_hours ON WorkSchedules;

CREATE TRIGGER check_hours_schedules
  BEFORE UPDATE OR INSERT
  ON WorkSchedules
  FOR EACH ROW
  EXECUTE FUNCTION check_hours();


CREATE OR REPLACE FUNCTION check_orderitems() RETURNS TRIGGER
  AS '
BEGIN

END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_orderitems_trigger ON OrderItems;
CREATE TRIGGER check_orderitems_trigger
  BEFORE UPDATE OR INSERT
  ON OrderItems
  FOR EACH ROW
  EXECUTE FUNCTION check_orderitems();