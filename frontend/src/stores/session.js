import { observable, action, reaction } from 'mobx';

class SessionStore {
  @observable userType = 'none';
  @observable entityId = -1;

  @action
  changeUserType = userType => {
    this.userType = userType;
  };

  @action
  changeEntityId = id => {
    this.entityId = id;
  };

  logout() {
    this.changeUserType('none');
    this.changeEntityId(-1);
  }
}

export default SessionStore;
