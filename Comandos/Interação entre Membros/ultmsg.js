import { Command } from '../../CommandoV12/src/index.js';
import Discord from 'discord.js';

export default class UltMsgCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ultmsg',
			aliases: ['vistoporultimo', 'lastmsg', 'ultimamensagem'],
			group: 'interação',
			memberName: 'ultimamensagem',
			description: 'Mostra o conteúdo e a hora da última mensagem de um usuário no servidor.',
			guildOnly: true,
			args: [
				{
					key: 'usuário',
					prompt: 'de quem?',
					type: 'user',
					bot: false,
				},
			],
		});
	}

	async run(message, { usuário }) {
		const lastMessage = await this.client.sqlite.getLastMessage(usuário.id);

		if (!lastMessage) return message.embed({ description: 'sem dados :/' });

		const embed = new Discord.MessageEmbed()
			.setDescription(lastMessage.content)
			.setAuthor(usuário.tag, usuário.avatarURL())
			.setTimestamp(lastMessage.timestamp)
			.addField('Enviado em:', `<#${lastMessage.channelid}>`, true)
			.setImage(lastMessage.attachment ? lastMessage.attachment : undefined);

		await message.embed(embed);
	}
}