import SessionStore from './session';
import LoginStore from './login';
import StaffStore from './staff';
import RiderStore from './riders';
import CustomerStore from './customers';
import RestaurantStore from './restaurants';
import DashboardStore from './dashboard';
import CampaignStore from './campaigns';
import FoodSearchStore from './foodSearch';
import NotificationStore from './notifications';

const rootStore = {
  session: new SessionStore(),
  login: new LoginStore(),
  staff: new StaffStore(),
  riders: new RiderStore(),
  customers: new CustomerStore(),
  restaurants: new RestaurantStore(),
  dashboard: new DashboardStore(),
  campaigns: new CampaignStore(),
  foodSearch: new FoodSearchStore(),
  notifications: new NotificationStore(),
};

const useStore = path => {
  if (!path || !rootStore[path]) {
    return rootStore;
  }
  return rootStore[path];
};

export { rootStore };
export default useStore;
