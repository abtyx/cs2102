import { observable, action, computed } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

class Notification {
  @observable id;
  @observable type;
  @observable message;
  @observable createdAt;

  constructor(id, message, type) {
    this.id = id;
    this.type = type;
    this.message = message;
    this.createdAt = Date.now();
  }
}

class NotificationStore {
  @observable notificationDict = {};
  @computed get notifications() {
    return Object.values(this.notificationDict).sort((a, b) => a.createdAt - b.createdAt);
  }

  constructor() {}

  @action pushNotification(message, type = 'success') {
    const id = uuidv4();
    const notif = new Notification(id, message, type);
    this.notificationDict[id] = notif;

    setTimeout(() => {
      delete this.notificationDict[id];
    }, 4000);
  }
}

export default NotificationStore;
