import { observable, action } from 'mobx';

class LoginStore {
  @observable username = '';
  @observable password = '';

  @action setUsername = username => {
    this.username = username;
  };

  @action setPassword = password => {
    this.password = password;
  };

  reset = () => {
    this.setUsername('');
    this.setPassword('');
  };
}

export default LoginStore;
