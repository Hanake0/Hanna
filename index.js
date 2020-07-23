const Commando = require('./commando discord.js-v12/src/index.js')
const { CommandoClient, SQLiteProvider } = require('./commando discord.js-v12/src/index.js');
const path = require('path');


//inicializa o lowDB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('usersOffDB.json');
const usersOffDB = low(adapter);

//inicializa o banco de dados (firebase) e exporta o banco Online
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
})

let db = admin.firestore();
module.exports.db = db;

//guarda os dados localmente e exporta o banco Offline
let usersOn = db.collection('usuarios').doc('usuarios');
module.exports.usersOn = usersOn;

usersOn.get().then(snap => {
	var usersOff = new Map(Object.entries(snap.data()));

    usersOff.forEach(user => {
        usersOffDB.set(`${user.id}`, user).write();
    });

    module.exports.usersOffDB = usersOffDB;
});

setInterval(async () => {
	usersOn.update(usersOffDB.getState()).then( () => console.log('Update concluído com suscesso'));
}, 3600000);



//cria um client do Comando
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


//mensagem de inicialização e "watching" dinânamico
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.guilds.find((a) => a.id === '698560208309452810').channels.find((a) => a.id === '732710544330457161').send(`PRONTO}`);
	setInterval(async () => {
	let users = client.guilds.find(a => a.id === '698560208309452810').members.size - 1

    await client.user.setActivity(`${users} usuário${users !== 1 ? 's' : ''}`, {type: 'WATCHING'})
    .catch(err => console.error());
  }, 15000);
});


//sistema de contagem de xp e "as parada"
client.on("message", message => {
	async function gambiarra(message) {
		if (usersOffDB.get(message.author.id).value() === 'undefined') {
			await usersOffDB.set(message.author.id, {
				"galo_nivel": 0,
				"medalhas": [],
				"galo?": false,
				"username": message.author.id,
				"idade": null,
				"interesses": [],
				"mensagens": 0,
				"xp": 0,
				"id": message.author.id,
				"xp_semanal": 0,
				"money": 0,
				"sexualidade": null
			  }).write();
			  var user = usersOffDB.get(message.author.id);
		} else {const user = usersOffDB.get(message.author.id)};

		if (message.author.lastMessage) {
			const tempinho = message.author.lastMessage.createdAt - Date();
	  
			if ( tempinho > 86400000) {
			  user.update('xp', n => n - (25 * Math.round(tempinho / 60000)))
				  .update('mensagens', n => n + 1).write();
			}
		  } else {
			  user.update('xp', n => n + 1).update('mensagens', n => n + 1).write();
		  }
	};
	gambiarra(message)
});

//erros e login
client.on('error', console.error);
client.login(process.env.AUTH_TOKEN);