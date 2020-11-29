import { Collection } from 'discord.js';


export class ColorsManager {
  constructor(client) {

    Object.defineProperty(this, 'client', { value: client });

    this.cache = new Collection();
  }

  get(id) {
    return this.cache.get(id);
  }

  hasColor(user, color) {
    if(this.cache.has(user.id)) return (
      this.cache.get(user.id).some(color => color.aliases.includes(color))
    );
    else return false;
  }
}