import { stripIndents } from 'common-tags';
import emojis from '../Assets/JSON/emojis.js';

function hora() {
	const dataUTC = new Date(new Date().toUTCString());
	const dataBR = new Date(dataUTC.getTime() - 10800000);
	let hora = `${dataBR.toISOString().slice(11, -1)} `;
	return hora
}

export default async (client, invite) => {
  console.log(hora(), 'Evento \`inviteDelete\` emitido...');

  const convite = client.invitesData.get(invite.code);

  client.guilds.cache.get('698560208309452810').channels.cache.get('751568642545680485').send({embed: {
    color: emojis.failC,
    title: 'Convite apagado:',
    author: {
      name: convite.inviter.tag,
      icon_url: convite.inviter.avatarURL()
    },
    description: stripIndents`
    Código: **\'${invite.code}\'**
    Temporário: **${convite.maxAge === 0 ? 'Não' : 'Sim'}**`,
    timestamp: convite.maxAge != 0 ? convite.createdTimestamp + (convite.maxAge * 1000) : convite.createdTimestamp,
    footer: {
      text: convite.maxAge != 0 ? 'Válido até: ' : 'Criado:  '
    }
  }});

  client.data.invites.delete(invite.code);
}
