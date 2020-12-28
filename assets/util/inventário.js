module.exports = class Itens {
  static cor(cor, membro) {
    if(membro._roles.includes(cor.rID)) return 'Já está usando esta cor'
    
  }
}