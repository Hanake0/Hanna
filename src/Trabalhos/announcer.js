import { wcJob } from './base.js';

export default class AnnouncerJob extends wcJob {
  constructor(data) {
    super({
      nome: 'Informante',
      description: 'Cuida dos canais de avisos, como por exemplo <#740932451433709608> e <#716796905530589194>.',
      lastWork: data.lastWork || null,
      wage: 4500,
      defaultCooldown: 604800000,
      hasMiniGame: false
    })
  }

  toFirestore() {
    return {
      _type: 'AnnouncerJob',
      _path: '../Trabalhos/announcer.js',
      lastWork: this.lastWork,
      cooldown: this.cooldown
    }
  }

}