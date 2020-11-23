import { InventoryItem } from './base.js';

export class PermanentItem extends InventoryItem {
  constructor(infos) {
    super(infos)

    this.quantidade = infos.quantidade;

    this.usable = infos.usable;

  }

  use() {
    if(this.usable) {
      throw error('Esse item não tem método de uso!');
    } else return false;
  }

  add(quantidade = 1) {
    this.quantidade += quantidade;
  }

}