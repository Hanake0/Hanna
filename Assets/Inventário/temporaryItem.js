import { InventoryItem } from './base.js';

export class TemporaryItem extends InventoryItem {
  constructor(infos) {
    super(infos)

    this.defaultTime = infos.defaultTime;

    this.validTime = infos.validTime || Date.now() + this.defaultTime;

    this.usable = infos.usable;

    this.expired = infos.expired || false;

  }

  use() {
    if(this.usable) {
      throw error('Esse item não tem método de uso!');
    } else return false;
  }

  expire() {
    this.expired = true;
    return;
  }

}