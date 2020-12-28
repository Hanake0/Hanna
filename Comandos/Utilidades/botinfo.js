import { Command } from '../../CommandoV12/src/index.js';
import os from 'os';
import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import { secondsToString } from '../../Assets/util/util3.js';

export default class DigaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bot-info',
			aliases: ['system-info', 'host-info'],
			group: 'utilidades',
			memberName: 'bot-info',
			clientPermissions: ['MANAGE_MESSAGES'],
			description: 'Mostra informações relevantes sobre o bot',
		});
	}

	run(msg) {

		const mTotal = os.totalmem();
		const mUtilizada = mTotal - os.freemem();
		const mPorcentagem = ((mUtilizada / mTotal) * 100).toFixed(2);

		const mU = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
		const mP = ((mU / 500) * 100).toFixed(2);

		const embed = new MessageEmbed()
			.setAuthor('Informações', 'https://twemoji.maxcdn.com/2/72x72/1f4e0.png')
			.addField('__⚙️ Hardware__', stripIndents`
				🖥️ **S. Operacional**: ${os.type()}
				🔧 **Arquitetura**: ${os.arch()}
				📀 **M. total**: ${(mTotal / Math.pow(1024, 3)).toFixed(2)}Gb
				💿 **M. utilizada**: ${(mUtilizada / Math.pow(1024, 3)).toFixed(2)}Gb(${mPorcentagem}%)
				⏱️ **Uptime**: ${secondsToString(os.uptime())}
			`, true)
			.addField('__📡 Software__', stripIndents`
				🛠️ **Plataforma**: Node.js (V${process.versions.node})
				🪛 **Discord.js**: 12.2.0
				📀 **M. total**: 500mb
				💿 **M. utilizada**: ${mU}mb(${mP}%)
				⏱️ **Uptime**: ${secondsToString(process.uptime())}
			`, true);

		msg.inlineReply(embed);
	}

}