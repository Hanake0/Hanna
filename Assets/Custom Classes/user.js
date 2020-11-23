//import { client } from '../../index.js';

export default class wcUser {
  constructor(data) {
    this.num = data.num;

    this.id = data.id;

    this.invites = data.invites || 0;

    this.wallet = data.wallet || { coins: 0, gems: 0 };

    this.messages = data.messages || 0;

    this.xp = data.xp || 0;

    this.lastMessage = data.lastMessage || null;

    this.inventory = { permanent: [], temporary: [] };

    // Converte os itens do inventário em suas respectivas classes
    if(data.inventory) if(Object.keys(data.inventory).length > 0) {
      for(const [itemType, itemTypeData] of Object.entries(data.inventory)) {
        this.inventory[itemType] = [];

        if(itemTypeData.length > 0) for(const itemData of itemTypeData) {
          this.importThing(itemData).then(item => this.inventory[itemType].push(item));
        }
      }
    }

    this.jobs = {};

    // Converte os trabalhos em suas respectivas classes
    if(data.jobs) if(Object.keys(data.jobs).length > 0) {
      for(const [jobNum, jobData] of Object.entries(data.jobs)) {
        this.importThing(jobData).then(job => this.jobs[jobNum] = job);
      }
    }
  };


  async importThing(thingData) {
    const { default: thingConstructor } = await import(`${thingData._path}`);
    return new thingConstructor(thingData);
  }

  toFirestore() {
    const userData = {
      id: this.id,
      invites: this.invites,
      wallet: this.wallet,
      messages: this.messages,
      xp: this.xp,
      inventory: {},
      jobs: {},
      lastMessage: this.lastMessage
    };

    // Coloca cada tipo de item em seu respectivo lugar no inventário e converte eles
    if(Object.keys(this.inventory).length > 0) {
      for(const itemType of Object.keys(this.inventory)) {
        userData.inventory[itemType] = [];
        for(const item of this.inventory[itemType]) {
          userData.inventory[itemType].push(item.toFirestore());
        }
      }
    }

    // Guarda as informações de trabalho e converte
    if(Object.keys(this.jobs).length > 0) {
      for(const jobNum of Object.keys(this.jobs)) {
        userData.jobs[jobNum] = this.jobs[jobNum].toFirestore();
      }
    }
    return userData;
  }

  static fromFirestore(data) {
    return new this(data);
  }

}
