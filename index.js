const commando = require('./CommandoV12/src/index.js');
const { CommandoClient} = require('./CommandoV12/src/index.js');
const path = require('path');
const { readdirSync } = require('fs');
const { Intents } = require('discord.js');
const d = new Date();
const hora = `${d.getHours() - 3}:${d.getMinutes()}:${d.getSeconds()} `


//inicializa o lowDB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adpt1 = new FileSync('./usersOffDB.json');
const usersOffDB = low(adpt1);
const adpt2 = new FileSync('./invitesDB.json');
const invitesDB = low(adpt2);


//inicializa o banco de dados (firebase) e exporta o banco Online
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

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
});
module.exports.usersOffDB = usersOffDB;
module.exports.invitesDB = invitesDB;

setInterval(async () => {
	console.log(hora, 'Iniciando update...')
	usersOn.update(usersOffDB.getState()).then( () => console.log(hora, 'Update concluído com sucesso !'));
}, 3600000);



//cria um client do Comando
const donos = new Set();
  donos.add('380512056413257729');
  donos.add('348664615175192577');
  donos.add('398852531259965440');
const client = new CommandoClient({
	ws: { intents: Intents.ALL },
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	commandPrefix: 'h',
	unknownCommandResponse: false,
	owner: donos,
	disableEveryone: true
});


//registra os comandos no client do Commando
client.registry
	.registerDefaults()
	.registerGroups([
		['autorespostas', 'Auto Respostas'],
		['utilidades', 'Utilidades'],
		['interação', 'Interação entre Membros'],
		['singleplayer', 'Jogos Single Player'],
		['imgs-ia', 'Imagens Geradas com Inteligência Artificial'],
		['p&i', 'Perfil & Inventário'],
		['adm', 'Reservados á Staff'],
		['eventos', 'Relacionados a Eventos']
	])
	.registerCommandsIn(path.join(__dirname, 'Comandos'));


//Event Handler(Project-A) && erros
const evtFiles = readdirSync('./Eventos/');
console.log(hora, `Carregando o total de ${evtFiles.length} eventos`);
evtFiles.forEach(f => {
  const eventName = f.split('.')[0];
  const event = require(`./Eventos/${f}`);

  client.on(eventName, event.bind(null, client));
});
  client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', (debug) => { if (!debug.includes('[WS => ')) console.log(hora, debug); })
	.on('disconnect', () => { console.warn('Disconectado!'); })
	.on('reconnecting', () => { console.warn('Reconectando...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(hora, `Erro no comando ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Comando ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			bloqueado; ${reason}
		`);
	});

//login && token
client.login(process.env.AUTH_TOKEN);