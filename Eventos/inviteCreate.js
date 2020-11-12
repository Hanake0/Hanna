const { stripIndents } = require('common-tags');
const emojis = require('../Assets/JSON/emojis.json');

function hora() {
	const dataUTC = new Date(new Date().toUTCString());
	const dataBR = new Date(dataUTC.getTime() - 10800000);
	
	let hora = `${dataBR.toISOString().slice(11, -1)} `;
	return hora
}

module.exports = async (client, invite) => {
  console.log(hora(), 'Evento \`inviteCreate\` emitido...');

  client.invitesData.set(invite.code, invite);

  client.guilds.cache.get('698560208309452810').channels.cache.get('751568642545680485').send(`${invite.inviter} criou um convite \*\*${invite.maxAge === 0 ? 'permanente' : 'temporário'}\*\*`, {embed: {
    color: emojis.successC,
    title: 'Convite criado:',
    author: {
      name: invite.inviter.tag,
      icon_url: invite.inviter.avatarURL()
    },
    description: stripIndents`
    Código: **\'${invite.code}\'**
    Temporário: **${invite.maxAge === 0 ? 'Não' : 'Sim'}**`,
    timestamp: invite.maxAge != 0 ? invite.createdTimestamp + (invite.maxAge * 1000) : invite.createdTimestamp,
    footer: {
      text: invite.maxAge != 0 ? 'Válido até: ' : 'Criado:  '
    }
  }});
}
