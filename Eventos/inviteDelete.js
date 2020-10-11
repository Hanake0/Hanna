const { invitesDB } = require('../index.js');
const emojis = require('../Assets/JSON/emojis.json');
const d = new Date();
const hora = `${d.getHours() - 3}:${d.getMinutes()}:${d.getSeconds()} `

module.exports = async (client, invite) => {
  console.log(hora, 'Evento \`inviteDelete\` emitido...');

  invitesDB.set(invite.code).write();

  client.guilds.cache.get('698560208309452810').channels.cache.get('751568642545680485').send({embed: {
    color: emojis.failC,
    title: 'Convite apagado:',
    description: `Código: **\'${invite.code}\'**`
  }});
}
