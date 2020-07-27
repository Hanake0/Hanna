module.exports = async (client) => {


  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.guilds.cache.find((a) => a.id === '698560208309452810').channels.cache.find((a) => a.id === '732710544330457161').send(`Online!`);
	setInterval(async () => {
	let users = client.guilds.cache.find(a => a.id === '698560208309452810').members.cache.size - 1;

    await client.user.setActivity(`${users} usuário${users !== 1 ? 's' : ''}`, {type: 'WATCHING'})
    .catch(err => console.error());
  }, 15000);


}
