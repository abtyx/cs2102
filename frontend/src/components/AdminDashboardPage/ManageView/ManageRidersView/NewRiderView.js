import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import LabelledField from '../../../common/LabelledField';
import { registerRider } from '../../../../api';
import useStore from '../../../../stores';

@observer
class NewRiderView extends React.Component {
  @observable name = '';
  @observable username = '';
  @observable password = '';
  @observable bankAccount = '';
  @observable contact = '';
  @observable salary = 0;
  @observable riderType = 'fulltime';

  @action setName = name => (this.name = name);
  @action setUsername = username => (this.username = username);
  @action setPassword = password => (this.password = password);
  @action setBankAccount = bankAccount => (this.bankAccount = bankAccount);
  @action setContact = contact => (this.contact = contact);
  @action setSalary = salary => (this.salary = salary);
  @action setRiderType = riderType => (this.riderType = riderType);

  onSubmit = e => {
    const notifStore = useStore('notifications');
    e.preventDefault();
    registerRider({
      username: this.username,
      password: this.password,
      name: this.name,
      bankAccount: this.bankAccount,
      contact: this.contact,
      salary: this.salary,
      isFulltime: this.riderType === 'fulltime',
    })
      .then(result => {
        notifStore.pushNotification('Registered new rider successfully!');
        this.reset();
      })
      .catch(e => {
        notifStore.pushNotification('Could not register rider successfully.', 'warning');
      });
  };

  reset = () => {
    this.setName('');
    this.setUsername('');
    this.setPassword('');
    this.setBankAccount('');
    this.setContact('');
    this.setSalary(0);
    this.setRiderType('fulltime');
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
            label="Bank Account"
            value={this.bankAccount}
            onChange={this.setBankAccount}
          />
          <LabelledField label="Contact" value={this.contact} onChange={this.setContact} />
          <LabelledField
            label="Salary"
            value={this.salary}
            onChange={this.setSalary}
            type="number"
          />
          <div className="field">
            <label className="label">Rider Type</label>
            <div className="control">
              <div className="select">
                <select onChange={e => this.setRiderType(e.target.value)} value={this.riderType}>
                  <option value="fulltime">Fulltime</option>
                  <option value="parttime">Part Time</option>
                </select>
              </div>
            </div>
          </div>
          <button className="button is-primary">Create</button>
        </form>
      </div>
    );
  }
}

export default NewRiderView;
