
export class InventoryItem {
  constructor(infos) {
    this.nome = infos.nome;

    this.description = infos.description;

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