const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

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
    const { usersOffDB } = require('../../index');
    const catálogo = require('../../Assets/JSON/catálogo.json');
    
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
    msg.member._roles.forEach(role => {
      if(rIDs.includes(role)) emUso.push(role);
    })

    const padrão = ['padrao', 'padrão', 'cor padrao', 'cor padrão', 'cor-padrao', 'cor-padrão'];
    if(padrão.includes(corS.toLowerCase()) && emUso.length !== 0) return msg.member.roles.remove(msg.client.guilds.cache.get('698560208309452810').roles.cache.get(emUso[0]), 'Cor selecionada').then(() => 
      msg.react('738900367814819940')).then(() => null);

    if(corE.length === 0 ) return msg.channel.send(`${msg.author}`, {embed: { color: '#ff2b1c', description: '<a:cross_gif:738900572664496169> | Essa cor não existe.' }});
    if(usersOffDB.get(msg.author.id).has('cores').value()) {
      if(usersOffDB.get(msg.author.id).value().cores.includes(corE[0].rID)) {
        if(emUso.length === 0) {
          msg.member.roles.add(msg.client.guilds.cache.get('698560208309452810').roles.cache.get(corE[0].rID), 'Cor selecionada').then(() => 
            msg.react('738900367814819940'));
        } else if(emUso[0] && emUso[0] !== corE[0].rID){
          msg.member.roles.remove(msg.client.guilds.cache.get('698560208309452810').roles.cache.get(emUso[0]), 'Cor selecionada').then(() => 
            msg.member.roles.add(msg.client.guilds.cache.get('698560208309452810').roles.cache.get(corE[0].rID), 'Cor selecionada')).then(() => 
            msg.react('738900367814819940'));
        } else if(emUso[0] === corE[0]) return msg.channel.send(`${user}`, {embed: { color: '#ff2b1c', description: '<a:cross_gif:738900572664496169> | Você já está usando esta cor' }});
      } else return msg.channel.send(`${msg.author}`, {embed: { color: '#ff2b1c', description: '<a:cross_gif:738900572664496169> | Você não possui essa cor' }});
    } else return msg.channel.send(`${msg.author}`, {embed: { color: '#ff2b1c', description: '<a:cross_gif:738900572664496169> | Você não possui essa cor' }});

		}
};
