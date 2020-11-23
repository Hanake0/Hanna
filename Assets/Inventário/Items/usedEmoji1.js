import { TemporaryItem } from '../temporaryItem.js';

export default class UsedEmojiN1 extends TemporaryItem {
  constructor(infos) {
    super({
      nome: 'Slot de Emoji Nº1',
      description: 'Representa um slot de emoji comprado na loja, e sua validade',
      defaultTime: 604800000,
      usable: false,
    })
  }

  use() {
    if(this.usable) {
      throw error('Esse item não tem método de uso!');
    } else return false;
  }

  toFirestore() {
    return {
      _type: 'UsedEmojiN1',
      _path: '../Inventário/Items/usedEmoji1.js',
      validTime: this.validTime
    }
  }

}

