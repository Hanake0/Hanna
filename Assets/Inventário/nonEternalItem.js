const InventoryItem = require('./inventoryItem.js');

module.exports = class NonEternalItem extends InventoryItem {
  constructor(client, infos) {
    super(client, infos)

    this.validTimestamp = Date.now() + infos.tempo;

    this.usable = infos.usable;

  }

  use() {
    if(this.usable) {
      throw error('Esse item não tem método de uso!');
    } else return false;
  }


}