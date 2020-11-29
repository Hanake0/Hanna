//import { client } from '../../index.js';

export class wcUser {
  constructor(client, data) {

    Object.defineProperty(this, 'client', { value: client });

    this.num = data.num;

    this.id = data.id;

    this.invites = data.invites || 0;

    this.boosting = data.boosting || false;

    this.wallet = data.wallet || { coins: 0, gems: 0 };

    this.messages = data.messages || 0;

    this.xp = data.xp || 0;

    this.lastMessage = data.lastMessage || null;

    const buddy = data.buddy || {};
    this.buddy = {
      hat: buddy['hat'] || null,
      glasses: buddy['glasses'] || null,
      shirt: buddy['shirt'] || null,
      gloves: buddy['gloves'] || null,
      pants: buddy['pants'] || null,
      shoes: buddy['shoes'] || null,
      base: buddy['base'] || null,
      pet: buddy['pet'] || null,
    };

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
    return new thingConstructor(this.client, thingData);
  }

  toFirestore() {
    const userData = {
      id: this.id,
      invites: this.invites,
      boosting: this.boosting,
      wallet: this.wallet,
      messages: this.messages,
      xp: this.xp,
      buddy: this.buddy,
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
    return new this(this.client, data);
  }

}
