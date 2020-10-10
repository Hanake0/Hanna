const { invitesDB } = require('../index.js');
module.exports = async (client, invite) => {
  invitesDB.set(invite.code).write();

  client.guilds.cache.get('698560208309452810').channels.cache.get('751568642545680485').send({embed: {
    color: '#c22727',
    title: 'Convite apagado:',
    description: `Código: **\'${invite.code}\'**`
  }});
}
