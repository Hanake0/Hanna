import { wcJob } from './base.js';

export default class ProgrammerJob extends wcJob {
  constructor(data) {
    super({
      nome: 'Programador',
      description: 'Ajuda nos projetos envolvendo programação no servidor.',
      lastWork: data.lastWork || null,
      wage: 10000,
      defaultCooldown: 604800000,
      hasMiniGame: false
    })
  }

  toFirestore() {
    return {
      _type: 'ProgrammerJob',
      _path: '../Trabalhos/programmer.js',
      lastWork: this.lastWork,
      cooldown: this.cooldown
    }
  }

}