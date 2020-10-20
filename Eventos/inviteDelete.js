const { invitesDB } = require('../index.js');
const emojis = require('../Assets/JSON/emojis.json');
const { stripIndents } = require('common-tags');
const d = Date.now() - 10800000;
let hora = `${new Date(d).getHours() - 3}:${new Date(d).getMinutes()}:${new Date(d).getSeconds()} `;

module.exports = async (client, invite) => {
  console.log(hora, 'Evento \`inviteDelete\` emitido...');

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

  delete client.invitesData.delete(invite.code);
}
