const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');
const emojis = require('../../Assets/JSON/emojis.json');

module.exports = class SelecionarCorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'selecionar-cor',
			aliases: ['cor','color', 'set-color', 'selecionar-cor'],
			group: 'p&i',
			memberName: 'selecionar-cor',
      description: 'Seleciona a cor do seu usuário, de acordo com as que possui.',
      blackListed: ['698678688153206915'],
			throttling: {
				usages: 2,
				duration: 10
      },
      args: [
				{
					key: 'corS',
					prompt: 'Que cor quer usar?',
          type: 'string',
				},
			],
		});
	}

	async run(msg, { corS }) {
    const catálogo = require('../../Assets/JSON/catálogo.json');

    const uDB = msg.client.usersData.get(msg.author.id);
    const wcRolesCache = msg.client.guilds.cache.get('698560208309452810').roles.cache;
    const wcMember = msg.client.guilds.cache.get('698560208309452810').members.cache.get(msg.author.id);

    let corE = [];
    let rIDs = [];
    Object.keys(catálogo.cores).forEach(cor => {
      if(catálogo.cores[cor].mID !== undefined) {
        if(catálogo.cores[cor].aliases.includes(corS.toLowerCase())) {
        corE.push(catálogo.cores[cor]);
        }
        rIDs.push(catálogo.cores[cor].rID);
      }
    });

    let emUso = [];
    wcMember._roles.forEach(role => {
      if(rIDs.includes(role)) emUso.push(role);
    })

    const padrão = ['padrao', 'padrão', 'cor padrao', 'cor padrão', 'cor-padrao', 'cor-padrão'];
    if(padrão.includes(corS.toLowerCase()) && emUso.length !== 0) return wcMember.roles.remove(wcRolesCache.get(emUso[0]), 'Cor selecionada').then(() => 
      msg.react('738900367814819940')).then(() => null);

    if(corE.length === 0 ) return msg.channel.send(`${msg.author}`, {embed: { color: emojis.failC, description: `${emojis.fail} | Essa cor não existe.` }});
    if(uDB.cores && uDB.vip) {
      if(uDB.cores.includes(corE[0].rID) || uDB.vip) {
        if(emUso.length === 0) {
          wcMember.roles.add(wcRolesCache.get(corE[0].rID), 'Cor selecionada').then(() => 
            msg.react('738900367814819940'));
        } else if(emUso[0] && emUso[0] !== corE[0].rID){
          wcMember.roles.remove(wcRolesCache.get(emUso[0]), 'Cor selecionada').then(() => 
            wcMember.roles.add(wcRolesCache.get(corE[0].rID), 'Cor selecionada')).then(() => 
            msg.react('738900367814819940'));

        } else if(emUso[0] === corE[0].rID) return msg.channel.send(`${msg.author}`, {embed: { color: emojis.warningC, description: `${emojis.warning} | Você já está usando esta cor` }});
      } else return msg.channel.send(`${msg.author}`, {embed: { color: emojis.failC, description: `${emojis.fail} | Você não possui essa cor` }});
    } else if(uDB.vip) {
      if(emUso.length === 0) {
        wcMember.roles.add(wcRolesCache.get(corE[0].rID), 'Cor selecionada').then(() => 
          msg.react('738900367814819940'));
      } else if(emUso[0] && emUso[0] !== corE[0].rID) {
        wcMember.roles.remove(wcRolesCache.get(emUso[0]), 'Cor selecionada').then(() => 
          wcMember.roles.add(wcRolesCache.get(corE[0].rID), 'Cor selecionada')).then(() => 
          msg.react('738900367814819940'));
      } else if(emUso[0] === corE[0].rID) return msg.channel.send(`${msg.author}`, {embed: { color: emojis.warningC, description: `${emojis.warning} | Você já está usando esta cor` }});
    } else return msg.channel.send(`${msg.author}`, {embed: { color: emojis.failC, description: `${emojis.fail} | Você não possui essa cor` }});
  }
};
