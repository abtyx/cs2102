import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import LabelledField from '../../../common/LabelledField';
import { registerRider, registerStaff } from '../../../../api';
import useStore from '../../../../stores';

@observer
class NewStaffView extends React.Component {
  @observable username = '';
  @observable password = '';

  @action setUsername = username => (this.username = username);
  @action setPassword = password => (this.password = password);

  onSubmit = e => {
    const notifStore = useStore('notifications');
    e.preventDefault();
    registerStaff({
      username: this.username,
      password: this.password,
    })
      .then(result => {
        notifStore.pushNotification('Registered new staff successfully!');
        this.reset();
      })
      .catch(e => {
        notifStore.pushNotification('Could not register staff successfully.', 'warning');
      });
  };

  reset = () => {
    this.setUsername('');
    this.setPassword('');
  };

  componentDidMount() {
    this.reset();
  }

  render() {
    return (
      <div>
        <h1 className="title">New Staff</h1>
        <form onSubmit={this.onSubmit}>
          <LabelledField label="Username" value={this.username} onChange={this.setUsername} />
          <LabelledField
            label="Password"
            value={this.password}
            onChange={this.setPassword}
            type="password"
          />
          <button className="button is-primary">Create</button>
        </form>
      </div>
    );
  }
}

export default NewStaffView;
