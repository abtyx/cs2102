import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import LabelledField from '../../../common/LabelledField';
import { registerRestaurant } from '../../../../api';
import useStore from '../../../../stores';

@observer
class NewRestaurantView extends React.Component {
  @observable name = '';
  @observable username = '';
  @observable password = '';
  @observable minOrder = 0;

  @action setName = name => (this.name = name);
  @action setUsername = username => (this.username = username);
  @action setPassword = password => (this.password = password);
  @action setMinOrder = minOrder => (this.minOrder = minOrder);

  onSubmit = e => {
    const notifStore = useStore('notifications');
    e.preventDefault();
    registerRestaurant({
      username: this.username,
      password: this.password,
      name: this.name,
      minOrder: this.minOrder,
    })
      .then(result => {
        notifStore.pushNotification('Registered new restaurant successfully!');
        this.reset();
      })
      .catch(e => {
        notifStore.pushNotification('Could not register restaurant successfully.', 'warning');
      });
  };

  reset = () => {
    this.setName('');
    this.setUsername('');
    this.setPassword('');
    this.setMinOrder(0);
  };

  componentDidMount() {
    this.reset();
  }

  render() {
    return (
      <div>
        <h1 className="title">New Rider</h1>
        <form onSubmit={this.onSubmit}>
          <LabelledField label="Username" value={this.username} onChange={this.setUsername} />
          <LabelledField
            label="Password"
            value={this.password}
            onChange={this.setPassword}
            type="password"
          />
          <LabelledField label="Name" value={this.name} onChange={this.setName} />
          <LabelledField
            label="Minimum Order ($)"
            value={this.minOrder}
            onChange={this.setMinOrder}
            type="number"
          />
          <button className="button is-primary">Create</button>
        </form>
      </div>
    );
  }
}

export default NewRestaurantView;
