import { TemporaryItem } from '../../temporaryItem.js';

export default class VIPtier1 extends TemporaryItem {
  constructor(client, infos) {
    super(client, {
      _userID: infos._userID,
      nome: 'VIP Tier 1',
      type: 'VIPs',
      description: 'Representa o tier VIP 1',
      defaultTime: 604800000,
      usable: false,
    })

    this.tier = 1;

    this.expiringTime = infos.expiringTime || Date.now() + this.defaultTime;
    
  }

  expire() {
    try { 
      const user = this.client.users.cache.get(this._userID);
      if(user) user.send(`Seu \`${this.nome}\` acaba de expirar!`)
    } catch(err) {};

    this.remove()
  }

  use() {
    if(this.usable) {
      throw new Error('Esse item não tem método de uso!');
    } else return false;
  }

  toFirestore() {
    return {
      _type: 'VIPtier1',
      _path: '../Inventário/Items/VIP/vip1.js',
      _userID: this._userID,
      expiringTime: this.expiringTime
    }
  }

}

