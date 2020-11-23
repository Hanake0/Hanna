import { wcJob } from './base.js';

export default class VerifierJob extends wcJob {
  constructor(data) {
    super({
      nome: 'Verificador',
      description: 'Verifica emojis e tags compradas na loja',
      lastWork: data.lastWork || null,
      wage: 3500,
      defaultCooldown: 0,
      hasMiniGame: false
    })
  }

  toFirestore() {
    return {
      _type: 'VerifierJob',
      _path: '../Trabalhos/verifier.js',
      lastWork: this.lastWork,
      cooldown: this.cooldown
    }
  }

}