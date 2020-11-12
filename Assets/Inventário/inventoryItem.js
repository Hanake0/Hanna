
module.exports = class InventoryItem {
  constructor(client, infos) {
    this.nome = infos.nome;

    this.descrição = infos.descrição;

  }

  addTime(ms) {
    if(this.validTimestamp) {
      this.validTimestamp += ms;
      return true;
    };
    return false;
  }

  removeTime(ms) {
    if(this.validTimestamp) {
      this.validTimestamp -= ms;
      return true;
    };
    return false;
  }

}