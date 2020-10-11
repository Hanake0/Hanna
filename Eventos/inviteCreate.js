const { stripIndents } = require('common-tags');
const { invitesDB } = require('../index.js');
const d = new Date();
const hora = `${d.getHours() - 3}:${d.getMinutes()}:${d.getSeconds()} `

module.exports = async (client, invite) => {
  console.log(hora, 'Evento \`inviteCreate\` emitido...');

  invitesDB.set(invite.code, invite).write();

  client.guilds.cache.get('698560208309452810').channels.cache.get('751568642545680485').send({embed: {
    color: '#24960e',
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
