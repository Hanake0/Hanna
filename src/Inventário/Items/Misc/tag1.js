import { TemporaryItem } from '../../temporaryItem.js';

export default class TagN1 extends TemporaryItem {
  constructor(client, infos) {
    super(client, {
      _userID: infos._userID,
      nome: 'Tag Nº1',
      type: 'misc',
      description: 'Representa uma tag customizada comprada na loja, e sua validade',
      defaultTime: 604800000,
      usable: false,
    })

    this.expiringTime = infos.expiringTime || Date.now() + this.defaultTime;

    client.once('ready', () => this.role = client.waifusClub.roles.cache.get(infos.roleID));
  }

  expire() {
    if(this.role) try { 
      this.role.delete('Tempo da tag expirado');

      const user = this.client.users.cache.get(this._userID);
      if(user) user.send(`Sua \`${this.nome}\` acaba de expirar!`)
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
      _type: 'TagN1',
      _path: '../Inventário/Items/Misc/tag1.js',
      _userID: this._userID,
      roleID: this.role.id,
      expiringTime: this.expiringTime
    }
  }

}

