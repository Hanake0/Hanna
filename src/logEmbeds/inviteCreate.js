import emojis from '../../Assets/JSON/emojis.js';
import { stripIndents } from 'common-tags';
export default function(client, logChannel, invite) {
	logChannel.send(`${invite.inviter} criou um convite **${invite.maxAge === 0 ? 'permanente' : 'temporário'}**`, { embed: {
		color: emojis.successC,
		title: 'Convite criado:',
		author: {
			name: invite.inviter.tag,
			icon_url: invite.inviter.avatarURL(),
		},
		description: stripIndents`
    Código: **\'${invite.code}\'**
    Temporário: **${invite.maxAge === 0 ? 'Não' : 'Sim'}**`,
		timestamp: invite.maxAge != 0 ? invite.createdTimestamp + (invite.maxAge * 1000) : invite.createdTimestamp,
		footer: {
			text: invite.maxAge != 0 ? 'Válido até: ' : 'Criado:  ',
		},
	} });
}