import { InventoryItem } from './base.js';

export class PermanentItem extends InventoryItem {
  constructor(client, infos) {
    super(client, infos)

    this.quantidade = infos.quantidade;

    this.usable = infos.usable;

  }

  use() {
    if(this.usable) {
      throw new Error('Esse item não tem método de uso!');
    } else return false;
  }

  add(quantidade = 1) {
    this.quantidade += quantidade;
  }

}