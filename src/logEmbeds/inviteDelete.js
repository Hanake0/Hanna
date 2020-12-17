import emojis from '../../Assets/JSON/emojis.js';
import { stripIndents } from 'common-tags';

export default function(client, logChannel, invite) {
	const convite = client.invitesData.get(invite.code);

	logChannel.send({ embed: {
		color: emojis.failC,
		title: 'Convite apagado:',
		author: {
			name: convite.inviter.tag,
			icon_url: convite.inviter.avatarURL(),
		},
		description: stripIndents`
    Código: **\'${invite.code}\'**
    Temporário: **${convite.maxAge === 0 ? 'Não' : 'Sim'}**`,
		timestamp: convite.maxAge != 0 ? convite.createdTimestamp + (convite.maxAge * 1000) : convite.createdTimestamp,
		footer: {
			text: convite.maxAge != 0 ? 'Válido até: ' : 'Criado:  ',
		},
	} });
}