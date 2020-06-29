const { CommandoClient } = require('./commando discord.js-v12/src/index.js');
const path = require('path');
const express = require('express');
const server = express();


//site para dar ping
server.all('/', (req, res)=>{
  res.send('Nenhum problema com o host, deve estar funcionando!');
});
function keepAlive(){
  server.listen(3000, ()=>{console.log("Servidor pronto!")});
}
keepAlive();
//site para dar ping


const client = new CommandoClient({
	commandPrefix: 'h',
	owner: '380512056413257729',
	unknownCommandResponse: false,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['utilidades', 'Utilidades'],
		['basicos', 'Base']
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'Comandos'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	setInterval(async () => {
    let users = 0;
    for (let g of client.guilds.array()) users += (g.members.size - 1);

    await client.user.setActivity(`${users} usuário${users !== 1 ? 's' : ''}`, {type: 'WATCHING'})
    .catch(err => console.error());
  }, 15000);
});

client.on('error', console.error);

client.login(process.env.AUTH_TOKEN);