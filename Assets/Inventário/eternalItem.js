const InventoryItem = require('./inventoryItem.js');

module.exports = class EternalItem extends InventoryItem {
  constructor(client, infos) {
    super(client, infos)

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