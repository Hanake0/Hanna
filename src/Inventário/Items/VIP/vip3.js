import { TemporaryItem } from '../../temporaryItem.js';

export default class VIPtier3 extends TemporaryItem {
  constructor(client, infos) {
    super(client, {
      _userID: infos._userID,
      nome: 'VIP Tier 3',
      type: 'VIPs',
      description: 'Representa o tier VIP 2',
      defaultTime: 604800000,
      usable: false,
    })

    this.tier = 3;

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
      _type: 'VIPtier3',
      _path: '../Inventário/Items/VIP/vip3.js',
      _userID: this._userID,
      expiringTime: this.expiringTime
    }
  }

}

