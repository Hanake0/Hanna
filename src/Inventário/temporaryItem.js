import { InventoryItem } from './base.js';

export class TemporaryItem extends InventoryItem {
  constructor(client, infos) {
    super(client, infos)

    this.type = infos.type;

    this.defaultTime = infos.defaultTime;

    this.timeout = null;

    this.usable = infos.usable;

  }

  get remainingTime() {
    return (this.expiringTime - Date.now());
  }

  use() {
    if(this.usable) {
      throw new Error('Esse item não tem método de uso!');
    } else return false;
  }

  expire() {
    throw new Error('Esse item não tem método de expiração!');
  }

  removeFromInventory() {
    const user =  this.client.data.users.resolveUser({id: this._userID});
    const index = user.inventory.temporary.indexOf(this);

    // Remove o item do inventário
    if(index > -1) {
      delete user.inventory.temporary[index]; 
      user.inventory.temporary = this.removeUndefineds(user.inventory.temporary);

      return true;
    } else return false;
  }

  removeUndefineds(array) {
    return array.filter((i) => i !== undefined);
  }

  removeFromCache(set = this.type === 'misc') {
    const cache = this.client.data[this.type].cache ? this.client.data[this.type].cache : this.client.data[this.type];
    const data = cache.get(this._userID);

    if(set) {
      data.delete(this);
      if(data.size === 0 )
        cache.delete(this._userID);
      } else {
      cache.delete(this._userID);
    }
  }

  remove(set = this.type === 'misc') {
    this.removeFromCache(set);
    this.removeFromInventory();
  }

  addTime(ms) {
    const inventory = this.client.data.users.resolveUser(this._userID).inventory.temporary;
    if(ms) {
      if(this.type === 'misc') inventory.delete(this);

      this.expiringTime += ms;
      if(this.remainingTime + ms <= 1728000000)
        this.timeout = this.client.setTimeout(this.expire, (this.remainingTime));

      if(this.type === 'misc') inventory.add(this);
      this.client.data[this.type].set(this._userID, this);
      return true;
    };
    return false;
  }

  expireIn(ms) {
    const inventory = this.client.data.users.resolveUser(this._userID).inventory.temporary;
    if(ms > 0) {
      if(this.type === 'misc') inventory.delete(this);

      this.expiringTime = Date.now() + ms;
      if(ms <= 1728000000) 
        this.timeout = this.client.setTimeout(this.expire, (this.remainingTime), client);


      if(this.type === 'misc') inventory.add(this);
      this.client.data[this.type].set(this._userID, this);
      return true;
    } else if(ms) {
      this.expire();
      return true;
    }
    return false;
  }

}