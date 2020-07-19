const Commando = require('./commando discord.js-v12/src/index.js')
const { CommandoClient, SQLiteProvider } = require('./commando discord.js-v12/src/index.js');
const path = require('path');
const sqlite = require('sqlite');



//inicializa o banco de dados (firebase) e exporta
const firebase = require('firebase');
const admin = require('firebase-admin');

firebase.initializeApp({
	serviceAccount: './serviceAccount.json',
	databaseURL: 'https://hanna-91e34.firebaseio.com/'
})

var db = admin.database();
let ref = db.ref('/usuarios');


//guarda os dados localmente
//let usersOn = db.collection('usuarios');

function user(id, money) {
	this.id = id;
	this.money = money;
};

var dados = [];

ref.once("value", function(snap) {
	var data = snap.val();
	console.log(data);
	dados.push(data);
	console.log(dados[0]);
  });


//cria um client do Commpmando
const donos = new Set()
  donos.add('380512056413257729');
  donos.add('348664615175192577');
  donos.add('597037623281975326');
const client = new CommandoClient({
	commandPrefix: 'h',
	owner: donos,
	unknownCommandResponse: false,
});


//registra os comandos no client do Commando
client.registry
	.registerDefaultTypes()
	.registerGroups([
		['utilidades', 'Utilidades'],
		['basicos', 'Base'],
		['adm', 'Administrativos'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'Comandos'))


//mensagem de inicialização e "watching" dinânimico
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.guilds.find((a) => a.id === '698560208309452810').channels.find((a) => a.id === '732710544330457161').send('PRONTO')
	setInterval(async () => {
    let users = 0;
    for (let g of client.guilds.array()) users += (g.members.size - 1);

    await client.user.setActivity(`${users} usuário${users !== 1 ? 's' : ''} online`, {type: 'WATCHING'})
    .catch(err => console.error());
  }, 15000);
});


//erros e login
client.on('error', console.error);
client.login(process.env.AUTH_TOKEN);