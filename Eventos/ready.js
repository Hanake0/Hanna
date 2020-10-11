const wait = require('util').promisify(setTimeout);
const { invitesDB } = require('../index.js');
const d = new Date();
const hora = `${d.getHours() - 3}:${d.getMinutes()}:${d.getSeconds()} `

module.exports = async (client) => {
  console.log(hora, 'Evento \`ready\` emitido...');

  wait(1000);

  const WaifusClub = client.guilds.cache.find((a) => a.id === '698560208309452810');

  console.log(`Logado como ${client.user.tag}! (${client.user.id})`);
	WaifusClub.channels.cache.find((a) => a.id === '732710544330457161').send(`Online!`);
	setInterval(async () => {
	let users = WaifusClub.members.cache.size - 1;

    await client.user.setActivity(`${users} usuário${users !== 1 ? 's' : ''}`, {type: 'WATCHING'})
    .catch(err => console.error());
  }, 15000);

  WaifusClub.fetchInvites().then( invites => {
    invites.forEach( invite => {
      invitesDB.set(invite.code, invite).write()
    })
  })
}
