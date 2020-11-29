

export class wcJob {
  constructor(data) {
    this.nome = data.nome;

    this.description = data.description;

    this.lastWork = data.lastWork || null;

    this.wage = data.wage;

    this.defaultCooldown = data.defaultCooldown;

    this.cooldown = data.cooldown || 0;

    this.hasMiniGame = data.hasMiniGame;
  }

  work(wcUser, channel) {
    wcUser.wallet.coins += this.wage;
    this.cooldown = Date.now() + this.defaultCooldown
    if(this.hasMiniGame) this.miniGame(wcUser);
  }

  miniGame(wcUser, channel) {
    throw new Error('esse trabalho não tem mini-game')
  }
}