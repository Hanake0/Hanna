const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

module.exports = class CarteiraCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cores',
			aliases: ['cores', 'colors', 'cores-diponíveis'],
			group: 'p&i',
			memberName: 'cores',
      description: 'Mostra as cores disponíveis para o usuário',
      blackListed: ['698678688153206915'],
			throttling: {
				usages: 2,
				duration: 10
      },
		});
	}

	async run(msg) {

    const catálogo = require('../../Assets/JSON/catálogo.json');

    const uDB = msg.client.usersData.get(msg.author.id);
    const wcRolesCache = msg.client.guilds.cache.get('698560208309452810').roles.cache;
    const wcMember = msg.client.guilds.cache.get('698560208309452810').members.cache.get(msg.author.id);

    let rIDs = [];
    Object.keys(catálogo.cores).forEach(cor => {
      if(catálogo.cores[cor].mID !== undefined) {
        rIDs.push(catálogo.cores[cor].rID);
      }
    });
    let VIPs = [];
    rIDs.forEach( cor => {
      VIPs.push(wcRolesCache.get(cor));
    })

    let emUso;
    wcMember._roles.forEach(role => {
      if(rIDs.includes(role)) emUso = role;
    })
    
    const atual = emUso ? wcRolesCache.get(emUso) : wcRolesCache.get('740940572025552926');

    let compradas;
    if(uDB.cores) {
      compradas = [];
      uDB.cores.forEach(cor => {
        compradas.push(wcRolesCache.get(cor));
      }) 
      compradas = compradas.join(', ');
    } else compradas = '--';

    const embed = new Discord.MessageEmbed()
      .setColor(wcMember.displayColor)
      .setAuthor(msg.author.tag, msg.author.avatarURL())
			.addField('Em uso:', `${atual}`)
      .addField('Compradas: ', `${compradas}`, true)
    if(uDB.vip) {
      embed.addField('VIP:', `${VIPs.join(', ')}`, true);
    }
      msg.embed(embed);
		}
};
